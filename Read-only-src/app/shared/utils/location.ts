/**
 * 臺灣縣市資訊工具
 *
 * 提供縣市名稱、代碼、地區、鄉鎮市區等相關工具函數
 * 資料來源：中央氣象局 OpenData API
 */

/**
 * 臺灣縣市列表
 */
export const TAIWAN_CITIES = [
  '臺北市',
  '新北市',
  '桃園市',
  '臺中市',
  '臺南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '嘉義市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '臺東縣',
  '澎湖縣',
  '金門縣',
  '連江縣'
] as const;

/**
 * 臺灣縣市類型
 */
export type TaiwanCity = (typeof TAIWAN_CITIES)[number];

/**
 * 縣市代碼映射（依據行政區代碼）
 */
export const CITY_CODE_MAP: Record<TaiwanCity, string> = {
  臺北市: '63000',
  新北市: '65000',
  桃園市: '68000',
  臺中市: '66000',
  臺南市: '67000',
  高雄市: '64000',
  基隆市: '10017',
  新竹市: '10018',
  嘉義市: '10020',
  新竹縣: '10004',
  苗栗縣: '10005',
  彰化縣: '10007',
  南投縣: '10008',
  雲林縣: '10009',
  嘉義縣: '10010',
  屏東縣: '10013',
  宜蘭縣: '10002',
  花蓮縣: '10015',
  臺東縣: '10014',
  澎湖縣: '10016',
  金門縣: '09020',
  連江縣: '09007'
};

/**
 * 縣市地區分類
 */
export const CITY_REGIONS: Record<string, TaiwanCity[]> = {
  北部: ['臺北市', '新北市', '桃園市', '基隆市', '新竹市', '新竹縣', '宜蘭縣'],
  中部: ['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣'],
  南部: ['臺南市', '高雄市', '嘉義市', '嘉義縣', '屏東縣', '澎湖縣'],
  東部: ['花蓮縣', '臺東縣'],
  離島: ['金門縣', '連江縣']
};

/**
 * 根據縣市名稱獲取代碼
 *
 * @param cityName 縣市名稱
 * @returns 縣市代碼，如果找不到則返回 undefined
 *
 * @example
 * ```typescript
 * const code = getCityCode('臺北市'); // '63000'
 * ```
 */
export function getCityCode(cityName: TaiwanCity): string | undefined {
  return CITY_CODE_MAP[cityName];
}

/**
 * 根據縣市代碼獲取名稱
 *
 * @param code 縣市代碼
 * @returns 縣市名稱，如果找不到則返回 undefined
 *
 * @example
 * ```typescript
 * const name = getCityName('63000'); // '臺北市'
 * ```
 */
export function getCityName(code: string): TaiwanCity | undefined {
  return Object.entries(CITY_CODE_MAP).find(([, value]) => value === code)?.[0] as TaiwanCity | undefined;
}

/**
 * 獲取縣市所屬地區
 *
 * @param cityName 縣市名稱
 * @returns 地區名稱，如果找不到則返回 undefined
 *
 * @example
 * ```typescript
 * const region = getCityRegion('臺北市'); // '北部'
 * ```
 */
export function getCityRegion(cityName: TaiwanCity): string | undefined {
  return Object.entries(CITY_REGIONS).find(([, cities]) => cities.includes(cityName))?.[0];
}

/**
 * 根據地區獲取縣市列表
 *
 * @param region 地區名稱（北部、中部、南部、東部、離島）
 * @returns 縣市名稱陣列
 *
 * @example
 * ```typescript
 * const cities = getCitiesByRegion('北部'); // ['臺北市', '新北市', ...]
 * ```
 */
export function getCitiesByRegion(region: string): TaiwanCity[] {
  return CITY_REGIONS[region] || [];
}

/**
 * 驗證縣市名稱是否有效
 *
 * @param cityName 縣市名稱
 * @returns 是否為有效的縣市名稱
 *
 * @example
 * ```typescript
 * isValidCity('臺北市'); // true
 * isValidCity('臺北市'); // false（簡體字）
 * ```
 */
export function isValidCity(cityName: string): cityName is TaiwanCity {
  return TAIWAN_CITIES.includes(cityName as TaiwanCity);
}

/**
 * 獲取所有縣市選項（用於下拉選單等 UI 組件）
 *
 * @returns 包含 label 和 value 的選項陣列
 *
 * @example
 * ```typescript
 * const options = getCityOptions();
 * // [{ label: '臺北市', value: '臺北市' }, ...]
 * ```
 */
export function getCityOptions(): Array<{ label: string; value: TaiwanCity }> {
  return TAIWAN_CITIES.map(city => ({
    label: city,
    value: city
  }));
}

/**
 * 根據關鍵字搜尋縣市
 *
 * @param keyword 搜尋關鍵字
 * @returns 符合的縣市名稱陣列
 *
 * @example
 * ```typescript
 * searchCities('臺'); // ['臺北市', '臺中市', '臺南市', '臺東縣']
 * ```
 */
export function searchCities(keyword: string): TaiwanCity[] {
  if (!keyword.trim()) {
    return [...TAIWAN_CITIES];
  }
  const normalizedKeyword = keyword.trim();
  return TAIWAN_CITIES.filter(city => city.includes(normalizedKeyword));
}

/**
 * 臺灣鄉鎮市區類型
 */
export type TaiwanDistrict = string;

/**
 * 縣市與鄉鎮市區對應映射
 * 資料來源：中央氣象局 OpenData API (https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf)
 */
export const CITY_DISTRICTS_MAP: Record<TaiwanCity, readonly TaiwanDistrict[]> = {
  臺北市: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  新北市: [
    '板橋區',
    '三重區',
    '中和區',
    '永和區',
    '新莊區',
    '新店區',
    '樹林區',
    '鶯歌區',
    '三峽區',
    '淡水區',
    '汐止區',
    '瑞芳區',
    '土城區',
    '蘆洲區',
    '五股區',
    '泰山區',
    '林口區',
    '深坑區',
    '石碇區',
    '坪林區',
    '三芝區',
    '石門區',
    '八里區',
    '平溪區',
    '雙溪區',
    '貢寮區',
    '金山區',
    '萬裡區',
    '烏來區'
  ],
  桃園市: [
    '桃園區',
    '中壢區',
    '大溪區',
    '楊梅區',
    '蘆竹區',
    '大園區',
    '龜山區',
    '八德區',
    '龍潭區',
    '平鎮區',
    '新屋區',
    '觀音區',
    '復興區'
  ],
  臺中市: [
    '中區',
    '東區',
    '南區',
    '西區',
    '北區',
    '西屯區',
    '南屯區',
    '北屯區',
    '豐原區',
    '東勢區',
    '大甲區',
    '清水區',
    '沙鹿區',
    '梧棲區',
    '后里區',
    '神岡區',
    '潭子區',
    '大雅區',
    '新社區',
    '石岡區',
    '外埔區',
    '大安區',
    '烏日區',
    '大肚區',
    '龍井區',
    '霧峰區',
    '太平區',
    '大里區',
    '和平區'
  ],
  臺南市: [
    '中西區',
    '東區',
    '南區',
    '北區',
    '安平區',
    '安南區',
    '永康區',
    '歸仁區',
    '新化區',
    '左鎮區',
    '玉井區',
    '楠西區',
    '南化區',
    '仁德區',
    '關廟區',
    '龍崎區',
    '官田區',
    '麻豆區',
    '佳里區',
    '西港區',
    '七股區',
    '將軍區',
    '學甲區',
    '北門區',
    '新營區',
    '後壁區',
    '白河區',
    '東山區',
    '六甲區',
    '下營區',
    '柳營區',
    '鹽水區',
    '善化區',
    '大內區',
    '山上區',
    '新市區',
    '安定區'
  ],
  高雄市: [
    '新興區',
    '前金區',
    '苓雅區',
    '前鎮區',
    '旗津區',
    '小港區',
    '左營區',
    '楠梓區',
    '三民區',
    '鼓山區',
    '仁武區',
    '大社區',
    '岡山區',
    '路竹區',
    '阿蓮區',
    '田寮區',
    '燕巢區',
    '橋頭區',
    '梓官區',
    '彌陀區',
    '永安區',
    '湖內區',
    '鳳山區',
    '大寮區',
    '林園區',
    '鳥松區',
    '大樹區',
    '旗山區',
    '美濃區',
    '六龜區',
    '內門區',
    '杉林區',
    '甲仙區',
    '桃源區',
    '那瑪夏區',
    '茂林區',
    '茄萣區'
  ],
  基隆市: ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
  新竹市: ['東區', '北區', '香山區'],
  嘉義市: ['東區', '西區'],
  新竹縣: [
    '竹北市',
    '湖口鄉',
    '新豐鄉',
    '新埔鎮',
    '關西鎮',
    '芎林鄉',
    '寶山鄉',
    '竹東鎮',
    '五峰鄉',
    '橫山鄉',
    '尖石鄉',
    '北埔鄉',
    '峨眉鄉'
  ],
  苗栗縣: [
    '竹南鎮',
    '頭份市',
    '三灣鄉',
    '南莊鄉',
    '獅潭鄉',
    '後龍鎮',
    '通霄鎮',
    '苑裡鎮',
    '苗栗市',
    '造橋鄉',
    '頭屋鄉',
    '公館鄉',
    '大湖鄉',
    '泰安鄉',
    '銅鑼鄉',
    '三義鄉',
    '西湖鄉',
    '卓蘭鎮'
  ],
  彰化縣: [
    '彰化市',
    '芬園鄉',
    '花壇鄉',
    '秀水鄉',
    '鹿港鎮',
    '福興鄉',
    '線西鄉',
    '和美鎮',
    '伸港鄉',
    '員林市',
    '社頭鄉',
    '永靖鄉',
    '埔心鄉',
    '溪湖鎮',
    '大村鄉',
    '埔鹽鄉',
    '田中鎮',
    '北斗鎮',
    '田尾鄉',
    '埤頭鄉',
    '溪州鄉',
    '竹塘鄉',
    '二林鎮',
    '大城鄉',
    '芳苑鄉',
    '二水鄉'
  ],
  南投縣: [
    '南投市',
    '中寮鄉',
    '草屯鎮',
    '國姓鄉',
    '埔里鎮',
    '仁愛鄉',
    '名間鄉',
    '集集鎮',
    '水里鄉',
    '魚池鄉',
    '信義鄉',
    '竹山鎮',
    '鹿谷鄉'
  ],
  雲林縣: [
    '斗南鎮',
    '大埤鄉',
    '虎尾鎮',
    '土庫鎮',
    '褒忠鄉',
    '東勢鄉',
    '臺西鄉',
    '崙背鄉',
    '麥寮鄉',
    '斗六市',
    '林內鄉',
    '古坑鄉',
    '莿桐鄉',
    '西螺鎮',
    '二崙鄉',
    '北港鎮',
    '水林鄉',
    '口湖鄉',
    '四湖鄉',
    '元長鄉'
  ],
  嘉義縣: [
    '番路鄉',
    '梅山鄉',
    '竹崎鄉',
    '阿里山鄉',
    '中埔鄉',
    '大埔鄉',
    '水上鄉',
    '鹿草鄉',
    '太保市',
    '朴子市',
    '東石鄉',
    '六腳鄉',
    '新港鄉',
    '民雄鄉',
    '大林鎮',
    '溪口鄉',
    '義竹鄉',
    '布袋鎮'
  ],
  屏東縣: [
    '屏東市',
    '三地門鄉',
    '霧臺鄉',
    '瑪家鄉',
    '九如鄉',
    '里港鄉',
    '高樹鄉',
    '鹽埔鄉',
    '長治鄉',
    '麟洛鄉',
    '竹田鄉',
    '內埔鄉',
    '萬丹鄉',
    '潮州鎮',
    '泰武鄉',
    '來義鄉',
    '萬巒鄉',
    '崁頂鄉',
    '新埤鄉',
    '南州鄉',
    '林邊鄉',
    '東港鎮',
    '琉球鄉',
    '佳冬鄉',
    '新園鄉',
    '枋寮鄉',
    '枋山鄉',
    '春日鄉',
    '獅子鄉',
    '車城鄉',
    '牡丹鄉',
    '恆春鎮',
    '滿州鄉'
  ],
  宜蘭縣: ['宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉'],
  花蓮縣: [
    '花蓮市',
    '新城鄉',
    '太魯閣',
    '秀林鄉',
    '吉安鄉',
    '壽豐鄉',
    '鳳林鎮',
    '光復鄉',
    '豐濱鄉',
    '瑞穗鄉',
    '玉里鎮',
    '卓溪鄉',
    '富里鄉'
  ],
  臺東縣: [
    '臺東市',
    '綠島鄉',
    '蘭嶼鄉',
    '延平鄉',
    '卑南鄉',
    '鹿野鄉',
    '關山鎮',
    '海端鄉',
    '池上鄉',
    '東河鄉',
    '成功鎮',
    '長濱鄉',
    '太麻里鄉',
    '金峰鄉',
    '大武鄉',
    '達仁鄉'
  ],
  澎湖縣: ['馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉'],
  金門縣: ['金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉'],
  連江縣: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
} as const;

/**
 * 根據縣市名稱獲取鄉鎮市區列表
 *
 * @param cityName 縣市名稱
 * @returns 鄉鎮市區列表，如果找不到則返回空陣列
 *
 * @example
 * ```typescript
 * const districts = getDistrictsByCity('臺北市');
 * // ['中正區', '大同區', '中山區', ...]
 * ```
 */
export function getDistrictsByCity(cityName: TaiwanCity): readonly TaiwanDistrict[] {
  return CITY_DISTRICTS_MAP[cityName] || [];
}

/**
 * 根據鄉鎮市區名稱獲取所屬縣市
 *
 * @param districtName 鄉鎮市區名稱
 * @returns 縣市名稱，如果找不到則返回 undefined
 *
 * @example
 * ```typescript
 * const city = getCityByDistrict('中正區'); // '臺北市'
 * ```
 */
export function getCityByDistrict(districtName: TaiwanDistrict): TaiwanCity | undefined {
  return Object.entries(CITY_DISTRICTS_MAP).find(([, districts]) => districts.includes(districtName))?.[0] as TaiwanCity | undefined;
}

/**
 * 驗證鄉鎮市區名稱是否有效
 *
 * @param districtName 鄉鎮市區名稱
 * @returns 是否為有效的鄉鎮市區名稱
 *
 * @example
 * ```typescript
 * isValidDistrict('中正區'); // true
 * isValidDistrict('未知區'); // false
 * ```
 */
export function isValidDistrict(districtName: string): districtName is TaiwanDistrict {
  return Object.values(CITY_DISTRICTS_MAP).some(districts => districts.includes(districtName));
}

/**
 * 根據縣市獲取鄉鎮市區選項（用於下拉選單等 UI 組件）
 *
 * @param cityName 縣市名稱
 * @returns 包含 label 和 value 的選項陣列
 *
 * @example
 * ```typescript
 * const options = getDistrictOptions('臺北市');
 * // [{ label: '中正區', value: '中正區' }, ...]
 * ```
 */
export function getDistrictOptions(cityName: TaiwanCity): Array<{ label: string; value: TaiwanDistrict }> {
  const districts = getDistrictsByCity(cityName);
  return districts.map(district => ({
    label: district,
    value: district
  }));
}

/**
 * 根據關鍵字在指定縣市內搜尋鄉鎮市區
 *
 * @param keyword 搜尋關鍵字
 * @param cityName 縣市名稱（可選，若不提供則搜尋所有縣市）
 * @returns 符合的鄉鎮市區名稱陣列
 *
 * @example
 * ```typescript
 * searchDistricts('中', '臺北市'); // ['中正區', '中山區']
 * searchDistricts('區'); // 所有以「區」結尾的鄉鎮市區
 * ```
 */
export function searchDistricts(keyword: string, cityName?: TaiwanCity): TaiwanDistrict[] {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) {
    return [];
  }

  if (cityName) {
    const districts = getDistrictsByCity(cityName);
    return districts.filter(district => district.includes(normalizedKeyword));
  }

  // 搜尋所有縣市
  const results: TaiwanDistrict[] = [];
  Object.values(CITY_DISTRICTS_MAP).forEach(districts => {
    districts.forEach(district => {
      if (district.includes(normalizedKeyword) && !results.includes(district)) {
        results.push(district);
      }
    });
  });
  return results;
}

/**
 * 驗證縣市與鄉鎮市區的對應關係
 *
 * @param cityName 縣市名稱
 * @param districtName 鄉鎮市區名稱
 * @returns 是否為有效的對應關係
 *
 * @example
 * ```typescript
 * isValidCityDistrict('臺北市', '中正區'); // true
 * isValidCityDistrict('臺北市', '板橋區'); // false（板橋區屬於新北市）
 * ```
 */
export function isValidCityDistrict(cityName: TaiwanCity, districtName: TaiwanDistrict): boolean {
  const districts = getDistrictsByCity(cityName);
  return districts.includes(districtName);
}

/**
 * 獲取所有鄉鎮市區列表（跨所有縣市）
 *
 * @returns 所有鄉鎮市區名稱陣列
 *
 * @example
 * ```typescript
 * const allDistricts = getAllDistricts();
 * ```
 */
export function getAllDistricts(): TaiwanDistrict[] {
  const results: TaiwanDistrict[] = [];
  Object.values(CITY_DISTRICTS_MAP).forEach(districts => {
    districts.forEach(district => {
      if (!results.includes(district)) {
        results.push(district);
      }
    });
  });
  return results;
}
