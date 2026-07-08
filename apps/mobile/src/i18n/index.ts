export { default as i18n } from './init'
export { applyLocaleFromBackend, bootstrapLocale } from './bootstrap-locale'
export { getCurrentLocale, normalizeAppLocale, resolveDeviceLocale, setAppLocale } from './init'
export { syncLocaleFromBackend } from './sync-locale-from-backend'
export { useTranslation } from 'react-i18next'
export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
  type TranslationResources,
} from './types'
