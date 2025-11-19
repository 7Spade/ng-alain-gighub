import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { TAIWAN_CITIES } from '@shared';
import { Observable, catchError, retry, shareReplay, tap, throwError, timer } from 'rxjs';

import { ErrorStateService } from '../../net/error';

export type WeatherDatasetKey = 'forecast-36h' | 'forecast-3d' | 'forecast-1w';

export interface WeatherDatasetMeta {
  readonly key: WeatherDatasetKey;
  readonly label: string;
  readonly description: string;
  readonly datasetId?: string;
  readonly type: 'forecast';
  readonly source: string;
}

const WEATHER_DATASETS: readonly WeatherDatasetMeta[] = [
  {
    key: 'forecast-36h',
    label: '36 小時預報',
    description: '中央氣象署一般天氣預報（縣市級，36 小時，每 6 小時一筆）',
    datasetId: 'F-C0032-001',
    type: 'forecast',
    source: 'CWA /api/v1/rest/datastore/F-C0032-001'
  },
  {
    key: 'forecast-3d',
    label: '3 天預報',
    description: '中央氣象署鄉鎮天氣預報（全臺 3 天資料，逐 3 小時）',
    datasetId: 'F-D0047-089',
    type: 'forecast',
    source: 'CWA /api/v1/rest/datastore/F-D0047-089'
  },
  {
    key: 'forecast-1w',
    label: '1 週預報',
    description: '中央氣象署鄉鎮天氣預報（全臺 1 週資料，逐 3 小時）',
    datasetId: 'F-D0047-091',
    type: 'forecast',
    source: 'CWA /api/v1/rest/datastore/F-D0047-091'
  }
];

/**
 * CWA API 天氣數據介面
 * 支援多種資料集格式：
 * - F-C0032-001: 一般天氣預報（使用 location 格式）
 * - F-D0047-091: 鄉鎮天氣預報（使用 Locations 格式）
 */
export interface CwaWeatherResponse {
  success: string;
  result: {
    resource_id: string;
    fields: Array<{
      id: string;
      type: string;
    }>;
  };
  records: {
    datasetDescription?: string;
    // 格式 1: 一般天氣預報 (F-C0032-001)
    location?: Array<{
      locationName: string;
      weatherElement: Array<{
        elementName: string;
        time: Array<{
          startTime: string;
          endTime: string;
          // CWA API 的 parameter 可能是單一物件或陣列
          parameter:
            | {
                parameterName: string;
                parameterValue?: string;
                parameterUnit?: string;
              }
            | Array<{
                parameterName: string;
                parameterValue?: string;
                parameterUnit?: string;
              }>;
        }>;
      }>;
    }>;
    // 格式 2: 鄉鎮天氣預報 (F-D0047-091)
    Locations?: Array<{
      LocationName: string;
      Location: Array<{
        LocationName: string;
        Geocode?: string;
        Latitude?: string;
        Longitude?: string;
        WeatherElement: Array<{
          ElementName: string;
          Time: Array<{
            StartTime: string;
            EndTime: string;
            ElementValue: Array<Record<string, string>>;
          }>;
        }>;
      }>;
    }>;
  };
}

/**
 * 簡化版天氣數據介面
 */
export interface WeatherData {
  locationName: string;
  weatherElement: Array<{
    elementName: string;
    time: Array<{
      startTime: string;
      endTime: string;
      parameter: {
        parameterName: string;
        parameterValue?: string;
        parameterUnit?: string;
      };
    }>;
  }>;
}

/**
 * CWA 即時天氣觀測資料回應介面
 */
/**
 * Weather Service
 *
 * 提供臺灣中央氣象局 (CWA) API 的整合服務
 * 用於獲取天氣數據，僅用於顯示，不存儲到數據庫
 *
 * @example
 * ```typescript
 * constructor(private weatherService: WeatherService) {}
 *
 * async getWeather(location: string) {
 *   const result = await this.weatherService.getWeatherData(location).toPromise();
 *   if (result) {
 *     console.log(result);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorStateService);
  private readonly forecastCache = new Map<string, { expiresAt: number; stream: Observable<CwaWeatherResponse> }>();
  private readonly forecastCacheTtlMs = 10 * 60 * 1000; // 10 分鐘
  private readonly retryCount = 2;
  private readonly retryDelayMs = 400;

  get datasets(): readonly WeatherDatasetMeta[] {
    return WEATHER_DATASETS;
  }

  getDatasetMetaByKey(key: WeatherDatasetKey): WeatherDatasetMeta | undefined {
    return WEATHER_DATASETS.find(dataset => dataset.key === key);
  }

  clearCaches(): void {
    this.forecastCache.clear();
  }

  private getCachedForecast(cacheKey: string): Observable<CwaWeatherResponse> | null {
    const cached = this.forecastCache.get(cacheKey);
    if (!cached) {
      return null;
    }
    if (cached.expiresAt <= Date.now()) {
      this.forecastCache.delete(cacheKey);
      return null;
    }
    cached.expiresAt = Date.now() + this.forecastCacheTtlMs;
    return cached.stream;
  }

  private setForecastCache(cacheKey: string, stream: Observable<CwaWeatherResponse>): void {
    this.forecastCache.set(cacheKey, {
      expiresAt: Date.now() + this.forecastCacheTtlMs,
      stream
    });
  }

  private createRetryDelay(): (error: unknown, retryIndex: number) => Observable<number> {
    return (_error, retryIndex) => timer(this.retryDelayMs * (retryIndex + 1));
  }

  // CWA API 基礎 URL
  // 開發環境使用 proxy，生產環境可能需要使用完整 URL 或後端代理
  // 支援兩個 API 端點：
  // 1. 一般資料 API: /api/v1/rest/datastore/...
  // 2. 歷史資料 API: /api/v1/rest/historicaldatastore/...
  private get cwaBaseUrl(): string {
    // 開發環境使用 proxy 避免 CORS
    if (!environment.production) {
      return '/cwa-api';
    }
    // 生產環境：如果 CORS 允許則直接呼叫，否則需要後端代理
    // 這裡使用完整 URL，如果遇到 CORS 問題需要後端代理
    return 'https://opendata.cwa.gov.tw/api/v1/rest';
  }

  // API 金鑰（從環境變數讀取）
  private get apiKey(): string {
    const cwaConfig = (environment as { cwa?: { apiKey: string } })['cwa'];
    return cwaConfig?.apiKey || '';
  }

  /**
   * 獲取天氣預報數據（智能選擇資料集）
   *
   * @param locationName 地點名稱（縣市或鄉鎮市區）
   * @param dataId 資料集 ID（可選，若不提供則自動判斷）
   * @returns 天氣數據的 Observable
   */
  getWeatherData(locationName: string, dataId?: string, options?: { forceRefresh?: boolean }): Observable<CwaWeatherResponse> {
    if (!this.apiKey) {
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '天氣 API 配置錯誤',
        details: 'CWA API 金鑰未配置，請在 environment.ts 中設定 cwa.apiKey',
        source: 'WeatherService.getWeatherData',
        retryable: false
      });
      return throwError(() => new Error('CWA API 金鑰未配置，請在 environment.ts 中設定 cwa.apiKey'));
    }

    // 如果未指定 dataId，根據 locationName 智能選擇資料集
    // F-C0032-001: 一般天氣預報（縣市級，36小時）
    // F-D0047-091: 鄉鎮天氣預報（鄉鎮市區級，48小時）
    const finalDataId = dataId || this.determineDataId(locationName);
    const cacheKey = `${finalDataId}|${locationName}`;

    if (options?.forceRefresh) {
      this.forecastCache.delete(cacheKey);
    } else {
      const cached = this.getCachedForecast(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // CWA API 支援兩種 Authorization 方式：
    // 1. Query parameter（推薦，避免 CORS preflight）
    // 2. HTTP Header
    const params = new HttpParams().set('Authorization', this.apiKey).set('locationName', locationName).set('format', 'JSON');

    // 一般資料 API 使用 datastore 路徑
    const url = `${this.cwaBaseUrl}/datastore/${finalDataId}`;

    let shared$: Observable<CwaWeatherResponse>;

    const request$ = this.http.get<CwaWeatherResponse>(url, { params }).pipe(
      retry({ count: this.retryCount, delay: this.createRetryDelay() }),
      tap({
        error: () => this.forecastCache.delete(cacheKey)
      }),
      catchError(error => {
        this.errorService.addError({
          type: 'network',
          severity: 'warning',
          message: '獲取天氣數據失敗',
          details: error.error?.message || error.message || '未知錯誤',
          source: 'WeatherService.getWeatherData',
          retryable: true,
          retryFn: () => {
            // 重試邏輯由調用方處理
          },
          metadata: {
            locationName,
            statusCode: error.status
          }
        });
        return throwError(
          () => new Error(`獲取天氣數據失敗: ${error.error?.message || error.message || '未知錯誤'} (狀態碼: ${error.status || 'N/A'})`)
        );
      })
    );

    shared$ = request$.pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.setForecastCache(cacheKey, shared$);

    return shared$;
  }

  /**
   * 根據 locationName 智能判斷使用哪個資料集
   *
   * @param locationName 地點名稱
   * @returns 資料集 ID
   *
   * 判斷邏輯（依據 CWA OpenData API 文檔）：
   * - F-C0032-001: 一般天氣預報（縣市級，36小時）- 只支援縣市名稱
   * - F-D0047-091: 鄉鎮天氣預報（鄉鎮市區級，48小時）- 支援鄉鎮市區名稱
   *
   * 如果 locationName 是完整的縣市名稱，使用 F-C0032-001
   * 否則視為鄉鎮市區，使用 F-D0047-091（更精確）
   */
  private determineDataId(locationName: string): string {
    // 使用 location.ts 中的縣市列表進行精確匹配
    if (TAIWAN_CITIES.includes(locationName as (typeof TAIWAN_CITIES)[number])) {
      return 'F-C0032-001'; // 一般天氣預報（縣市級，36小時）
    }

    // 否則視為鄉鎮市區，使用鄉鎮預報 API（更精確的資料）
    return 'F-D0047-091'; // 鄉鎮天氣預報（鄉鎮市區級，48小時）
  }

  /**
   * 獲取縣市天氣預報（明確指定使用縣市資料集）
   *
   * @param cityName 縣市名稱（例如：'臺北市'）
   * @returns 天氣數據的 Observable
   */
  getCityWeather(cityName: string): Observable<CwaWeatherResponse> {
    return this.getWeatherData(cityName, 'F-C0032-001');
  }

  /**
   * 獲取鄉鎮市區天氣預報（明確指定使用鄉鎮資料集）
   *
   * @param districtName 鄉鎮市區名稱（例如：'板橋區'）
   * @returns 天氣數據的 Observable
   */
  getDistrictWeather(districtName: string): Observable<CwaWeatherResponse> {
    return this.getWeatherData(districtName, 'F-D0047-091');
  }

  /**
   * 獲取天氣預報（多個地點）
   *
   * @param locationNames 地點名稱陣列（必須是完整縣市名稱）
   * @param dataId 資料集 ID
   * @returns 天氣數據的 Observable
   */
  getMultipleWeatherData(locationNames: string[], dataId = 'F-C0032-001'): Observable<CwaWeatherResponse> {
    if (!this.apiKey) {
      return throwError(() => new Error('CWA API 金鑰未配置，請在 environment.ts 中設定 cwa.apiKey'));
    }

    // CWA API 支援多個地點，用逗號分隔
    const locationParam = locationNames.join(',');
    const params = new HttpParams().set('Authorization', this.apiKey).set('locationName', locationParam).set('format', 'JSON');

    // 一般資料 API 使用 datastore 路徑
    const url = `${this.cwaBaseUrl}/datastore/${dataId}`;

    return this.http.get<CwaWeatherResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('CWA API 請求失敗:', error);
        return throwError(
          () => new Error(`獲取天氣數據失敗: ${error.error?.message || error.message || '未知錯誤'} (狀態碼: ${error.status || 'N/A'})`)
        );
      })
    );
  }

  /**
   * 檢查 API 配置是否完整
   */
  get isConfigured(): boolean {
    return !!this.apiKey;
  }
}
