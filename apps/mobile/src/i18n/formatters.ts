import { getCurrentLocale } from './init'
import { type AppLocale } from './types'

function toIntlLocale(locale: AppLocale): string {
  return locale === 'uk' ? 'uk-UA' : 'en-US'
}

function formatWithLocale(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions,
  locale?: AppLocale,
): string {
  const date = value instanceof Date ? value : new Date(value)
  const intlLocale = toIntlLocale(locale ?? getCurrentLocale())

  return new Intl.DateTimeFormat(intlLocale, options).format(date)
}

export function formatDateTime(value: Date | string | number, locale?: AppLocale): string {
  return formatWithLocale(
    value,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    locale,
  )
}

export function formatDateTimeCompact(value: Date | string | number, locale?: AppLocale): string {
  const datePart = formatDate(value, locale)
  const timePart = formatWithLocale(value, { hour: 'numeric', minute: '2-digit' }, locale)

  return `${datePart} · ${timePart}`
}

export function formatDate(value: Date | string | number, locale?: AppLocale): string {
  return formatWithLocale(
    value,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    locale,
  )
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale?: AppLocale,
): string {
  const intlLocale = toIntlLocale(locale ?? getCurrentLocale())

  return new Intl.NumberFormat(intlLocale, options).format(value)
}
