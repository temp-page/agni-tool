import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import BigNumber from 'bignumber.js'

dayjs.extend(UTC)

type FormatType =
  | 'DD/MM/YYYY'
  | 'DD/MM/YYYY HH:mm:ss'
  | 'HH:mm:ss'
  | 'MM/DD'
  | 'MM/DD HH:mm'
  | 'MMM D'

/**
 * Vite导入静态资源 @/ -> /src
 * @param value
 * @returns
 */
export function getAssetsUri(value: string) {
  const normalizedPath = value.slice(2)
  return new URL(`/src/${normalizedPath}`, import.meta.url).href
}

/**
 * UTC时间格式化
 * @param value
 * @param format
 * @returns
 */
export const filterTime = (value: string | number, format: FormatType = 'DD/MM/YYYY') => {
  const stamp = typeof value === 'number' ? value : Number(value)
  return dayjs.utc(stamp).local().format(format)
}

/**
 * 首字母大写
 * @param value
 * @returns
 */
export const filterTitleCase = (value: string) => {
  return value.toLowerCase().replace(/^\S/, (s) => s.toUpperCase())
}

/**
 * 数字精度 -> decimalPlaces[does not retain trailing zeros]
 * @param value
 * @param decimal
 * @returns
 */
export const filterPrecision = (value: string | number, decimal = 4) => {
  const result = new BigNumber(value).toFixed(decimal, BigNumber.ROUND_DOWN).toString()
  return result
}

/**
 * 数字千位分割
 * @param value
 * @param decimal
 * @param isCutZero
 * @returns
 */
export const filterThousands = (value: string | number, decimal = 4, isCutZero?: boolean) => {
  if (new BigNumber(value).isNaN()) return `${value}`
  if (isCutZero) return new BigNumber(value).decimalPlaces(decimal, BigNumber.ROUND_DOWN).toFormat()
  const result = new BigNumber(filterPrecision(value, decimal)).toFormat(
    decimal,
    BigNumber.ROUND_DOWN,
  )
  return result
}

/**
 * 数字千位分割（自定义分隔符）
 * @param value 数值
 * @param decimal 精度
 * @param separator 千分位分割符号
 * @param mark 小数点符号
 * @returns
 */
export const filterThousandsWithSign = (
  value: string | number,
  decimal = 4,
  separator = ',',
  mark = '.',
) => {
  if (new BigNumber(value).isNaN()) return `${value}`
  const option = {
    groupSize: 3,
    decimalSeparator: mark,
    groupSeparator: separator,
  }
  const result = new BigNumber(filterPrecision(value, decimal)).toFormat(
    decimal,
    BigNumber.ROUND_DOWN,
    option,
  )
  return result
}

/**
 * 隐藏文本信息
 * @param value
 * @param before
 * @param after
 * @param fuzz
 * @returns
 */
export const filterHideText = (value: string, before = 4, after = 4, fuzz = '****') => {
  if (!value || value.length <= before + after) return value
  return `${value.slice(0, before)}${fuzz}${value.slice(-after)}`
}

/**
 * 最大值过滤
 * @param value
 * @param max
 * @param decimal
 * @returns
 */
export const filterMaxNumber = (value: string, max = '0', decimal = 4) => {
  if (new BigNumber(value).isNaN() || /^[0-9]\d*\.$/.test(value)) return value
  const result = BigNumber.minimum(value, filterPrecision(max, decimal)).toString()
  return result
}

/**
 * 最小精度显示优化
 * @param value
 * @param decimal
 * @param prefix
 * @returns
 */
export const filterMinimumPrecision = (value: string, decimal = 4, prefix = '<') => {
  if (Number(value) === 0) return '0'
  const minimum = `0.${'1'.padStart(decimal, '0')}`
  const compare = new BigNumber(value).isGreaterThan(minimum)
  const result = compare ? filterThousands(value, decimal) : `${prefix}${minimum}`
  return result
}

/**
 * 大数缩写 -> K M B
 * @param value
 * @param decimal
 * @returns
 */
export const filterAbbreviation = (value: string, decimal = 2) => {
  const numValue = new BigNumber(value)
  if (numValue.isGreaterThanOrEqualTo(1e9)) {
    return `${filterThousands(numValue.dividedBy(1e9).toString(), decimal)}B`
  }
  if (numValue.isGreaterThanOrEqualTo(1e6)) {
    return `${filterThousands(numValue.dividedBy(1e6).toString(), decimal)}M`
  }
  if (numValue.isGreaterThanOrEqualTo(1e3)) {
    return `${filterThousands(numValue.dividedBy(1e3).toString(), decimal)}K`
  }
  return filterThousands(value, decimal)
}

/**
 * 邮箱校验
 * @param value
 * @returns
 */
export const verifyEmail = (value: string) => {
  const regexp = /^[^@\s]+@[^@\s]+\.[^@\s]+$/g
  // const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z]{2,10})$/;
  return !regexp.test(value)
}

/**
 * 密码校验
 * @param value
 * @returns
 */
export const verifyPassword = (value: string) => {
  if (value.length < 8) return true
  if (value.length > 20) return true
  const regexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/
  // const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
  return !regexp.test(value)
}

/**
 * IP校验
 * @param value
 * @returns
 */
export const verifyIP = (value: string) => {
  const regexp =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  // const regexp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
  return !regexp.test(value)
}

/**
 * 非负数校验
 * @param value
 * @param decimal
 * @returns
 */
export const verifyValidNumber = (value: string, decimal = 4) => {
  const regexp = decimal === 0 ? '(^(0|[1-9]\\d*)$)' : `(^(0|([1-9]\\d*))(\\.\\d{0,${decimal}})?$)`
  // const regexp = new RegExp(`(^[1-9]\\d*(\\.\\d{0,${decimal}})?$)|(^0(\\.\\d{0,${decimal}})?$)`);
  return !new RegExp(regexp).test(value)
}

/**
 * 非负数校验（可设置小数点符号）
 * @param value
 * @param decimal
 * @param decimalSeparator
 * @returns
 */
export const verifyValidNumberWithSeparator = (
  value: string,
  decimal = 4,
  decimalSeparator = '.',
) => {
  const regexp =
    decimal === 0
      ? '(^(0|[1-9]\\d*)$)'
      : `(^(0|([1-9]\\d*))(\\${decimalSeparator}\\d{0,${decimal}})?$)`
  return !new RegExp(regexp).test(value)
}

/**
 * UUID(RFC4122) -> https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
 * @returns
 */
export const uuidv4 = () => {
  const UINT36 = '10000000-1000-4000-8000-100000000000'

  const random = (x: string) =>
    ((Number(x) ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> (Number(x) / 4)
  return UINT36.replace(/[018]/g, (x) => random(x)?.toString(16))
}

/**
 * 外链跳转
 * @param address
 * @param target
 */
export const jumpLink = (address: string, target: '_self' | '_blank' = '_self') => {
  window.open(address, target)
}

/**
 * 搜索时排除正则符号
 * @param value
 * @returns
 */
export const filterSearch = (value: string) => {
  return value.replace(/([.?*+^$[\]\\(){}|-])/g, '')
}

/**
 * Blob下载
 * @param fileName
 * @param content
 * @returns
 */
export const download = (fileName: string, content: Blob, type = 'image/png') => {
  const link = window.document.createElement('a')
  if (typeof link.download === 'undefined') return
  try {
    const blob = new Blob([content], { type })
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.style.display = 'none'
    window.document.body.appendChild(link)
    link.click()
  } finally {
    URL.revokeObjectURL(link.href)
    window.document.body.removeChild(link)
  }
}

/**
 * @name 发送谷歌统计
 * @param event
 * @returns
 */
export const sendGoogleAnalytics = (eventName: string, eventConfig: any = {}) => {
  const isProduction = process.env.NODE_ENV === 'production'
  if (!window.gtag || !isProduction) return
  const params = {
    ...eventConfig,
    timestamp: Date.now(),
    referer: window.document.referrer,
  }
  window.gtag('event', eventName, params)
}

/** 发送Facebook统计 */
export const sendFacebookAnalytics = (track: string) => {
  if (!window.fbq || process.env.NODE_ENV !== 'production') return
  window.fbq('track', track)
}

/** 异步延迟一定时间的方法 */
export const waitTime = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/**
 * 获取当前网址一级域名
 * @returns {string}
 */
export const getDomain = () => {
  const { hostname } = new URL(window.location.href)
  const domain = hostname.match(/[^.]+\.[^.]+$/)?.[0]
  return domain
}

/**
 * 用于替换字符串中的 {domain} 标记为实际的一级域名 --> LocalHost | SSR
 * @param event
 * @returns
 */
export const replaceDomainPlaceholder = (address: string) => {
  const domain = getDomain() ?? 'trubit.com'
  return address.replace(/{domain}/g, domain)
}
