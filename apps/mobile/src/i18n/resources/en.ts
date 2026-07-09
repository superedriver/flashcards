import { authEn } from './en/auth'
import { decksEn } from './en/decks'
import { profileEn } from './en/profile'
import { settingsEn } from './en/settings'

export const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    retry: 'Retry',
    save: 'Save',
    error: 'Something went wrong.',
    empty: 'Nothing here yet.',
  },
  auth: authEn,
  profile: profileEn,
  settings: settingsEn,
  decks: decksEn,
} as const
