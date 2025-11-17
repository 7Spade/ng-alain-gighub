import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  BlueprintService,
  OrganizationContextService,
  WeatherService,
  type CwaWeatherResponse,
  type WeatherDatasetKey,
  type WeatherDatasetMeta
} from '@core';
import { SHARED_IMPORTS, TAIWAN_CITIES } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, filter, finalize, map, switchMap } from 'rxjs/operators';

/**
 * Weather Component
 *
 * 顯示藍圖相關的天氣資訊
 * 支援手動選擇地點查詢天氣預報
 */
interface ForecastMetricView {
  label: string;
  value: string;
}

interface ForecastEntryView {
  startTime: string;
  endTime?: string;
  metrics: ForecastMetricView[];
}

interface ForecastPresentation {
  locationName: string;
  datasetId: string;
  entries: ForecastEntryView[];
}

interface HighlightForecast {
  headline: string;
  temperature: string;
  rainProbability?: string;
  humidity?: string;
  windSpeed?: string;
  icon?: string;
  timeline: Array<{ label: string; temperature: number }>;
}

interface DailySummaryItem {
  label: string;
  icon?: string;
  description: string;
  temperatureHigh?: string;
  temperatureLow?: string;
  rainProbability?: string;
}

const TEMPERATURE_ELEMENT_NAMES = new Set([
  'MinT',
  'MaxT',
  'MinAT',
  'MaxAT',
  'T',
  'Tmin',
  'Tmax',
  'Temperature',
  '溫度',
  '體感溫度',
  'AverageTemperature',
  '平均溫度',
  '最高溫度',
  '最低溫度',
  '最高溫度12H',
  '最低溫度12H',
  '最高體感溫度',
  '最低體感溫度',
  'MaxTemperature',
  'MinTemperature',
  'MaxApparentTemperature',
  'MinApparentTemperature',
  'DewPoint',
  '露點溫度'
]);

const TEMPERATURE_UNIT_CANDIDATES = new Set(['C', '℃', '°C', '攝氏', '攝氏度', '度C', 'degC']);
const PERCENTAGE_UNIT_CANDIDATES = new Set(['%', '％', '百分比', '百分率']);
const PERCENTAGE_ELEMENT_NAMES = new Set([
  'PoP',
  'PoP6h',
  'PoP12h',
  'ProbabilityOfPrecipitation',
  'ProbabilityOfPrecipitation12H',
  '12小時降雨機率',
  '降雨機率'
]);

const TEXTUAL_WEATHER_ELEMENTS = new Set([
  'Wx',
  'Weather',
  'WeatherDesc',
  'WeatherDescription',
  'WeatherDescription12H',
  'WeatherDescription24H',
  'WeatherDescriptionNight',
  'WeatherDescriptionDay',
  '天氣現象',
  '天氣預報綜合描述',
  'CI',
  'ComfortIndexDescription',
  'MaxComfortIndexDescription',
  'MinComfortIndexDescription',
  'UVExposureLevel',
  'WindDirection',
  'WeatherCode'
]);

type DatasetResult =
  | { kind: 'forecast'; data: CwaWeatherResponse; meta: WeatherDatasetMeta; location: string }
  | { kind: 'error'; error: unknown };

@Component({
  selector: 'app-blueprint-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintWeatherComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly weatherService = inject(WeatherService);

  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintId = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.getBlueprintIdBySlug()).pipe(
          catchError(error => {
            console.error('計算 Blueprint ID 失敗:', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  readonly blueprint = toSignal(
    toObservable(this.blueprintId).pipe(
      switchMap(blueprintId => {
        if (!blueprintId) {
          return of(null);
        }
        return from(this.blueprintService.getBlueprintById(blueprintId)).pipe(
          switchMap(({ data, error }) => {
            if (error || !data) {
              this.msg.error(error?.message || '獲取藍圖資料失敗');
              return of(null);
            }
            return of(data);
          }),
          catchError(error => {
            this.msg.error(error?.message || '載入藍圖資料失敗');
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  readonly loading = computed(() => {
    const blueprintId = this.blueprintId();
    const blueprint = this.blueprint();
    return blueprintId !== null && blueprint === null;
  });

  readonly weatherLoading = signal(false);
  readonly selectedDataset = signal<WeatherDatasetKey>('forecast-36h');
  readonly selectedLocation = signal<string>('臺北市');
  readonly forecastView = signal<ForecastPresentation | null>(null);
  readonly highlightForecast = signal<HighlightForecast | null>(null);
  readonly dailySummaries = signal<DailySummaryItem[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly lastUpdated = signal<string | null>(null);

  private readonly refreshNonce = signal(0);
  private lastRefreshNonce = -1;

  readonly datasetOptions = this.weatherService.datasets.map(dataset => ({
    label: dataset.label,
    value: dataset.key
  }));

  readonly currentDatasetMeta = computed(() => this.weatherService.getDatasetMetaByKey(this.selectedDataset()) ?? null);

  readonly currentDatasetSource = computed(() => this.currentDatasetMeta()?.source ?? 'CWA');

  readonly currentLocation = computed(() => {
    const bp = this.blueprint();
    if (bp?.site_location) {
      return bp.site_location;
    }
    return this.selectedLocation() || '臺北市';
  });

  readonly cityOptions = TAIWAN_CITIES.map(city => ({ label: city, value: city }));

  private readonly datasetResult = toSignal<DatasetResult | null>(
    toObservable(
      computed(() => ({
        datasetKey: this.selectedDataset(),
        location: this.currentLocation(),
        blueprint: this.blueprint(),
        isConfigured: this.weatherService.isConfigured,
        refreshNonce: this.refreshNonce()
      }))
    ).pipe(
      filter(context => {
        if (!context.isConfigured) {
          this.errorMessage.set('請先在環境設定中配置中央氣象署 API 授權碼');
          this.weatherLoading.set(false);
          return false;
        }
        if (!context.location) {
          this.errorMessage.set('請選擇縣市或自訂查詢地點');
          this.weatherLoading.set(false);
          return false;
        }
        return true;
      }),
      switchMap(context => {
        const meta = this.weatherService.getDatasetMetaByKey(context.datasetKey);
        if (!meta) {
          this.weatherLoading.set(false);
          this.errorMessage.set('找不到對應的氣象資料集設定');
          return of<DatasetResult>({ kind: 'error', error: new Error('unknown dataset meta') });
        }

        const forceRefresh = context.refreshNonce > this.lastRefreshNonce;
        if (forceRefresh) {
          this.lastRefreshNonce = context.refreshNonce;
        }

        this.errorMessage.set(null);
        this.weatherLoading.set(true);

        if (!meta.datasetId) {
          this.weatherLoading.set(false);
          this.errorMessage.set('資料集設定不完整，缺少 datasetId。');
          return of<DatasetResult>({ kind: 'error', error: new Error('invalid dataset configuration') });
        }

        return this.weatherService.getWeatherData(context.location, meta.datasetId, { forceRefresh }).pipe(
          map(data => ({ kind: 'forecast', data, meta, location: context.location }) as DatasetResult),
          catchError(error => {
            this.errorMessage.set(error.message || '載入天氣資料失敗');
            return of<DatasetResult>({ kind: 'error', error });
          }),
          finalize(() => this.weatherLoading.set(false))
        );
      })
    ),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const blueprint = this.blueprint();
      if (blueprint) {
        if (blueprint.site_location) {
          this.selectedLocation.set(blueprint.site_location);
        } else {
          this.selectedLocation.set('臺北市');
        }
      }
    });

    effect(() => {
      const result = this.datasetResult();
      if (!result || result.kind === 'error') {
        if (result?.kind === 'error') {
          this.forecastView.set(null);
          this.lastUpdated.set(null);
        }
        return;
      }

      if (result.kind === 'forecast') {
        const view = this.buildForecastPresentation(result.data, result.meta, result.location);
        this.forecastView.set(view);
        this.highlightForecast.set(this.buildHighlightForecast(view));
        this.dailySummaries.set(this.buildDailySummaries(view));
        this.lastUpdated.set(this.computeForecastUpdatedAt(view));
      }
    });
  }

  onLocationChange(location: string): void {
    this.selectedLocation.set(location);
  }

  onDatasetChange(datasetKey: WeatherDatasetKey): void {
    this.selectedDataset.set(datasetKey);
  }

  refreshWeather(): void {
    this.refreshNonce.update(value => value + 1);
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const orgSlug = params['org'];
    const slug = params['slug'];

    if (!slug) {
      return null;
    }

    const isUserView = !orgSlug;

    try {
      if (isUserView) {
        const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
        return data?.id || null;
      }
      const org = this.orgContext.currentOrganization();
      if (!org) {
        return null;
      }
      const { data } = await this.blueprintService.getBlueprintBySlug(org.id, slug);
      return data?.id || null;
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  private buildForecastPresentation(
    response: CwaWeatherResponse,
    meta: WeatherDatasetMeta,
    locationName: string
  ): ForecastPresentation | null {
    if (!response?.records) {
      return null;
    }

    const cityLocations = response.records.location;
    if (cityLocations?.length) {
      const location = this.pickCityLocation(cityLocations, locationName) ?? cityLocations[0];
      const entries = this.buildCityForecastEntries(location.weatherElement ?? []);
      return {
        locationName: location.locationName,
        datasetId: meta.datasetId ?? 'unknown',
        entries
      };
    }

    const districtGroups = response.records.Locations;
    if (districtGroups?.length) {
      const location = this.pickDistrictLocation(districtGroups, locationName);
      if (location) {
        const entries = this.buildDistrictForecastEntries(location.WeatherElement ?? []);
        return {
          locationName: location.LocationName,
          datasetId: meta.datasetId ?? 'unknown',
          entries
        };
      }
    }

    return null;
  }

  private buildCityForecastEntries(
    weatherElements: Array<{
      elementName: string;
      time: Array<{
        startTime: string;
        endTime: string;
        parameter:
          | { parameterName: string; parameterValue?: string; parameterUnit?: string }
          | Array<{ parameterName: string; parameterValue?: string; parameterUnit?: string }>;
      }>;
    }>
  ): ForecastEntryView[] {
    const timeline = new Map<string, { startTime: string; endTime?: string; metrics: Map<string, string> }>();

    for (const element of weatherElements) {
      for (const timeSlot of element.time ?? []) {
        const key = `${timeSlot.startTime}|${timeSlot.endTime ?? ''}`;
        if (!timeline.has(key)) {
          timeline.set(key, {
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            metrics: new Map<string, string>()
          });
        }
        const container = timeline.get(key)!;
        const parameters = Array.isArray(timeSlot.parameter) ? timeSlot.parameter : [timeSlot.parameter];
        const readableLabel = this.describeElement(element.elementName) ?? element.elementName;
        const formatted = this.formatCityWeatherValues(element.elementName, parameters);
        if (formatted) {
          container.metrics.set(readableLabel, formatted);
        }
      }
    }

    return Array.from(timeline.values())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .map(item => ({
        startTime: item.startTime,
        endTime: item.endTime,
        metrics: Array.from(item.metrics.entries()).map(([label, value]) => ({ label, value }))
      }));
  }

  private buildDistrictForecastEntries(
    weatherElements: Array<{
      ElementName: string;
      Time: Array<{
        StartTime: string;
        EndTime: string;
        ElementValue: Array<Record<string, string>>;
      }>;
    }>
  ): ForecastEntryView[] {
    const timeline = new Map<string, { startTime: string; endTime?: string; metrics: Map<string, string> }>();

    for (const element of weatherElements) {
      for (const timeSlot of element.Time ?? []) {
        const key = `${timeSlot.StartTime}|${timeSlot.EndTime ?? ''}`;
        if (!timeline.has(key)) {
          timeline.set(key, {
            startTime: timeSlot.StartTime,
            endTime: timeSlot.EndTime,
            metrics: new Map<string, string>()
          });
        }
        const container = timeline.get(key)!;
        const value = (timeSlot.ElementValue ?? [])
          .map(record => this.formatDistrictWeatherValue(element.ElementName, record))
          .filter((entry): entry is string => !!entry)
          .join(' / ');
        const readableLabel = this.describeElement(element.ElementName) ?? element.ElementName;
        if (value) {
          container.metrics.set(readableLabel, value);
        }
      }
    }

    return Array.from(timeline.values())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .map(item => ({
        startTime: item.startTime,
        endTime: item.endTime,
        metrics: Array.from(item.metrics.entries()).map(([label, value]) => ({ label, value }))
      }));
  }

  private pickCityLocation(
    locations: Array<{
      locationName: string;
      weatherElement: Array<{
        elementName: string;
        time: Array<{
          startTime: string;
          endTime: string;
          parameter:
            | { parameterName: string; parameterValue?: string; parameterUnit?: string }
            | Array<{ parameterName: string; parameterValue?: string; parameterUnit?: string }>;
        }>;
      }>;
    }>,
    locationName: string
  ) {
    return (
      locations.find(location => location.locationName === locationName) ||
      locations.find(location => locationName.includes(location.locationName)) ||
      null
    );
  }

  private pickDistrictLocation(
    groups: Array<{
      LocationName: string;
      Location: Array<{
        LocationName: string;
        WeatherElement: Array<{
          ElementName: string;
          Time: Array<{
            StartTime: string;
            EndTime: string;
            ElementValue: Array<Record<string, string>>;
          }>;
        }>;
      }>;
    }>,
    locationName: string
  ) {
    for (const group of groups) {
      const direct = group.Location.find(loc => loc.LocationName === locationName);
      if (direct) {
        return direct;
      }
      const fuzzy = group.Location.find(loc => locationName.includes(loc.LocationName));
      if (fuzzy) {
        return fuzzy;
      }
    }
    return null;
  }

  private describeElement(raw: string): string | null {
    const dictionary: Record<string, string> = {
      Wx: '天氣狀況',
      PoP: '降雨機率',
      PoP6h: '降雨機率',
      PoP12h: '降雨機率',
      CI: '舒適度',
      MinT: '最低溫',
      MaxT: '最高溫',
      MinAT: '最低體感溫度',
      MaxAT: '最高體感溫度',
      T: '溫度',
      溫度: '溫度',
      Tmax: '最高溫',
      Tmin: '最低溫',
      Temperature: '溫度',
      AverageTemperature: '平均溫度',
      平均溫度: '平均溫度',
      最高溫度: '最高溫',
      最低溫度: '最低溫',
      最高溫度12H: '最高溫',
      最低溫度12H: '最低溫',
      MaxTemperature: '最高溫',
      MinTemperature: '最低溫',
      MaxApparentTemperature: '最高體感溫度',
      MinApparentTemperature: '最低體感溫度',
      體感溫度: '體感溫度',
      DewPoint: '露點溫度',
      露點溫度: '露點溫度',
      RelativeHumidity: '相對濕度',
      平均相對濕度: '相對濕度',
      ProbabilityOfPrecipitation: '降雨機率',
      ProbabilityOfPrecipitation12H: '降雨機率',
      '12小時降雨機率': '降雨機率',
      Weather: '天氣狀況',
      WeatherDesc: '天氣狀況',
      WeatherDescription: '天氣狀況',
      WeatherDescription12H: '天氣狀況',
      WeatherDescription24H: '天氣狀況',
      WeatherDescriptionNight: '天氣狀況',
      WeatherDescriptionDay: '天氣狀況',
      天氣現象: '天氣狀況',
      天氣預報綜合描述: '天氣狀況',
      WindSpeed: '風速',
      WindDirection: '風向',
      BeaufortScale: '蒲福風級',
      UVIndex: '紫外線指數',
      UVExposureLevel: '紫外線等級',
      MaxComfortIndex: '最大舒適度指數',
      MinComfortIndex: '最小舒適度指數',
      MaxComfortIndexDescription: '舒適度描述',
      MinComfortIndexDescription: '舒適度描述'
    };
    return dictionary[raw] ?? null;
  }

  private buildHighlightForecast(view: ForecastPresentation | null): HighlightForecast | null {
    if (!view?.entries?.length) {
      return null;
    }

    const [firstEntry] = view.entries;
    if (!firstEntry) {
      return null;
    }

    const metrics = new Map(firstEntry.metrics.map(metric => [metric.label, metric.value]));
    const temperature =
      this.pickMetricValue(metrics, ['最高溫', '最高溫度', '最低溫', '最低溫度', '平均溫度', '最高體感溫度']) ||
      metrics.values().next().value ||
      '';

    const timeline = view.entries.slice(0, 6).map(entry => ({
      label: this.formatTimeLabel(entry.startTime),
      temperature: this.extractTemperature(entry.metrics)
    }));

    return {
      headline: `${view.locationName} ${this.describeDataset(view.datasetId)}`,
      temperature,
      rainProbability: this.pickMetricValue(metrics, ['降雨機率', '12小時降雨機率']) || undefined,
      humidity: this.pickMetricValue(metrics, ['舒適度', '舒適度描述', '最大舒適度指數']) || undefined,
      windSpeed: this.pickMetricValue(metrics, ['風速', '天氣狀況']) || undefined,
      timeline
    };
  }

  private describeDataset(datasetId: string): string {
    switch (datasetId) {
      case 'F-C0032-001':
        return '36 小時預報';
      case 'F-D0047-089':
        return '3 天預報';
      case 'F-D0047-091':
        return '1 週預報';
      default:
        return '天氣預報';
    }
  }

  private formatTimeLabel(value: string): string {
    try {
      return new Intl.DateTimeFormat('zh-TW', {
        weekday: 'short',
        hour: 'numeric'
      }).format(new Date(value));
    } catch {
      return value;
    }
  }

  private extractTemperature(metrics: ForecastMetricView[]): number {
    const temperatureMetric = metrics.find(metric =>
      ['最高溫', '最低溫', '最高溫度', '最低溫度', '平均溫度', '最高體感溫度', '最低體感溫度', '溫度', '體感溫度'].includes(metric.label)
    );
    const candidateValue = temperatureMetric?.value ?? '';
    const parseTemperatureFromDescription = () => {
      const descriptionMetric = metrics.find(metric => /溫度/.test(metric.value));
      if (!descriptionMetric) {
        return Number.NaN;
      }
      const tempPattern = /溫度(?:攝氏)?(-?\d+(?:\.\d+)?)(?:至(-?\d+(?:\.\d+)?))?度/;
      const match = descriptionMetric.value.match(tempPattern);
      if (match) {
        const start = Number.parseFloat(match[1]);
        const end = match[2] ? Number.parseFloat(match[2]) : Number.NaN;
        if (!Number.isNaN(end)) {
          return (start + end) / 2;
        }
        return start;
      }
      const fallback = descriptionMetric.value.match(/-?\d+(?:\.\d+)?/g);
      if (!fallback || fallback.length === 0) {
        return Number.NaN;
      }
      const candidate = fallback.find((_, index) => {
        if (index === 0 && /降雨|風速|濕度/.test(descriptionMetric.value)) {
          return false;
        }
        return true;
      });
      return candidate ? Number.parseFloat(candidate) : Number.NaN;
    };

    if (!candidateValue) {
      return parseTemperatureFromDescription();
    }
    const numeric = Number.parseFloat(candidateValue.replace(/[^\d.-]/g, ''));
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
    const descriptionMetric = metrics.find(metric => /溫度/.test(metric.value));
    if (!descriptionMetric) {
      return Number.NaN;
    }
    const tempPattern = /溫度(?:攝氏)?(-?\d+(?:\.\d+)?)(?:至(-?\d+(?:\.\d+)?))?度/;
    const match = descriptionMetric.value.match(tempPattern);
    if (match) {
      const start = Number.parseFloat(match[1]);
      const end = match[2] ? Number.parseFloat(match[2]) : Number.NaN;
      if (!Number.isNaN(end)) {
        return (start + end) / 2;
      }
      return start;
    }
    const fallback = descriptionMetric.value.match(/-?\d+(?:\.\d+)?/g);
    if (!fallback || fallback.length === 0) {
      return Number.NaN;
    }
    const candidate = fallback.find((_, index) => {
      if (index === 0 && /降雨|風速|濕度/.test(descriptionMetric.value)) {
        return false;
      }
      return true;
    });
    return candidate ? Number.parseFloat(candidate) : Number.NaN;
  }

  private buildDailySummaries(view: ForecastPresentation | null): DailySummaryItem[] {
    if (!view?.entries?.length) {
      return [];
    }

    const summaries = new Map<string, DailySummaryItem>();

    for (const entry of view.entries) {
      const dayLabel = this.formatDayLabel(entry.startTime);
      const existing = summaries.get(dayLabel);

      const metricsMap = new Map(entry.metrics.map(metric => [metric.label, metric.value]));

      const summary: DailySummaryItem = existing ?? {
        label: dayLabel,
        icon: undefined,
        description: '',
        temperatureHigh: undefined,
        temperatureLow: undefined,
        rainProbability: undefined
      };

      summary.description = metricsMap.get('天氣狀況') ?? summary.description ?? '';
      summary.temperatureHigh = metricsMap.get('最高溫') ?? summary.temperatureHigh;
      summary.temperatureLow = metricsMap.get('最低溫') ?? summary.temperatureLow;
      summary.rainProbability = metricsMap.get('降雨機率') ?? summary.rainProbability;

      summaries.set(dayLabel, summary);
    }

    return Array.from(summaries.values()).slice(0, 7);
  }

  private formatDayLabel(value: string): string {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat('zh-TW', { weekday: 'short', month: 'numeric', day: 'numeric' }).format(date);
    } catch {
      return value;
    }
  }

  private computeForecastUpdatedAt(view: ForecastPresentation | null): string | null {
    if (!view?.entries.length) {
      return null;
    }
    return view.entries[0].startTime;
  }

  private formatCityWeatherValues(
    elementName: string,
    parameters: Array<{ parameterName: string; parameterValue?: string; parameterUnit?: string }>
  ): string | null {
    const values = parameters
      .map(param => {
        const raw = this.pickPreferredParameterValue(elementName, param.parameterName, param.parameterValue);
        return this.composeValue(elementName, raw, param.parameterUnit);
      })
      .filter((value): value is string => !!value);

    return values.length ? values.join(' / ') : null;
  }

  private formatDistrictWeatherValue(elementName: string, record: Record<string, string>): string | null {
    const rawValue = this.pickRecordValue(record);
    const rawUnit = this.pickRecordUnit(record);
    const description = this.pickRecordDescription(record);

    if (TEXTUAL_WEATHER_ELEMENTS.has(elementName)) {
      return description ?? rawValue ?? null;
    }

    const composed = this.composeValue(elementName, rawValue, rawUnit);
    if (composed && description) {
      if (description === composed || composed.includes(description)) {
        return composed;
      }
      return `${composed} (${description})`;
    }

    return composed ?? description ?? rawValue ?? null;
  }

  private composeValue(elementName: string, rawValue?: string | null, unit?: string | null): string | null {
    const value = rawValue?.trim();
    if (!value) {
      return null;
    }

    const normalizedUnit = this.normalizeUnit(unit);

    if (this.isTemperatureElement(elementName) || this.isTemperatureUnit(normalizedUnit)) {
      const numeric = this.extractNumericText(value);
      if (numeric !== null) {
        return `${numeric}°C`;
      }
    }

    if (!normalizedUnit && PERCENTAGE_ELEMENT_NAMES.has(elementName)) {
      const numeric = this.extractNumericText(value);
      if (numeric !== null) {
        return `${numeric}%`;
      }
      return value.includes('%') ? value : `${value}%`;
    }

    if (normalizedUnit) {
      if (this.unitAlreadyPresent(value, normalizedUnit)) {
        return value;
      }
      if (normalizedUnit === '%') {
        const numeric = this.extractNumericText(value);
        return numeric !== null ? `${numeric}%` : `${value}%`;
      }
      return `${value}${normalizedUnit}`;
    }

    return value;
  }

  private normalizeUnit(unit?: string | null): string | null {
    const trimmed = unit?.trim();
    if (!trimmed) {
      return null;
    }

    const normalized = trimmed.replace(/\s+/g, '');
    if (TEMPERATURE_UNIT_CANDIDATES.has(normalized)) {
      return '°C';
    }
    if (PERCENTAGE_UNIT_CANDIDATES.has(normalized)) {
      return '%';
    }
    if (['公尺/秒', '公尺每秒', 'm/s', 'M/S'].includes(normalized)) {
      return 'm/s';
    }
    if (['公里/小時', '公里每小時', 'km/h', 'KM/H'].includes(normalized)) {
      return 'km/h';
    }
    if (['毫米', 'mm', 'MM'].includes(normalized)) {
      return 'mm';
    }
    if (normalized === '度') {
      return '°C';
    }
    return trimmed;
  }

  private isTemperatureElement(elementName: string): boolean {
    return TEMPERATURE_ELEMENT_NAMES.has(elementName);
  }

  private isTemperatureUnit(unit?: string | null): boolean {
    return unit ? TEMPERATURE_UNIT_CANDIDATES.has(unit) : false;
  }

  private unitAlreadyPresent(value: string, unit: string): boolean {
    return value.includes(unit);
  }

  private extractNumericText(input: string): string | null {
    const match = input.match(/-?\d+(?:\.\d+)?/);
    return match ? match[0] : null;
  }

  private pickRecordValue(record: Record<string, string>): string | null {
    const preferredKeys = [
      'Value',
      'value',
      'ParameterValue',
      'parameterValue',
      'ElementValue',
      'elementValue',
      'Temperature',
      'AverageTemperature',
      'MaxTemperature',
      'MinTemperature',
      'MaxApparentTemperature',
      'MinApparentTemperature',
      'MaxComfortIndex',
      'MinComfortIndex',
      'RelativeHumidity',
      'DewPoint',
      'WindSpeed',
      'WindDirection',
      'Weather',
      'WeatherDescription',
      'WeatherCode',
      'ProbabilityOfPrecipitation',
      'UVIndex'
    ];

    for (const key of preferredKeys) {
      const raw = record[key];
      if (typeof raw === 'string' && raw.trim()) {
        return raw.trim();
      }
    }

    const first = Object.values(record).find(entry => typeof entry === 'string' && entry.trim());
    return typeof first === 'string' ? first.trim() : null;
  }

  private pickRecordUnit(record: Record<string, string>): string | null {
    const preferredKeys = ['Measures', 'Measure', 'Unit', 'unit', 'ParameterUnit', 'parameterUnit', 'UnitCode'];
    for (const key of preferredKeys) {
      const raw = record[key];
      if (typeof raw === 'string' && raw.trim()) {
        return raw.trim();
      }
    }
    return null;
  }

  private pickRecordDescription(record: Record<string, string>): string | null {
    const preferredKeys = [
      'Description',
      'Weather',
      'WeatherDescription',
      'WeatherCode',
      'Status',
      'Narrative',
      'Text',
      'MaxComfortIndexDescription',
      'MinComfortIndexDescription',
      'UVExposureLevel'
    ];
    for (const key of preferredKeys) {
      const raw = record[key];
      if (typeof raw === 'string' && raw.trim()) {
        return raw.trim();
      }
    }
    return null;
  }

  private pickPreferredParameterValue(elementName: string, parameterName?: string, parameterValue?: string): string | null {
    const name = parameterName?.trim();
    const value = parameterValue?.trim();

    if (TEXTUAL_WEATHER_ELEMENTS.has(elementName)) {
      return name || value || null;
    }

    if (value && this.isNumericValue(value)) {
      return value;
    }
    if (name && this.isNumericValue(name)) {
      return name;
    }

    return value ?? name ?? null;
  }

  private isNumericValue(value: string): boolean {
    return /^-?\d+(?:\.\d+)?$/.test(value);
  }

  private pickMetricValue(map: Map<string, string>, labels: string[]): string | undefined {
    for (const label of labels) {
      const value = map.get(label);
      if (value) {
        return value;
      }
    }
    return undefined;
  }
}
