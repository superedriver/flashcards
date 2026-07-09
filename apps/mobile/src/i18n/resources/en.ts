import { authEn } from './en/auth'
import { decksEn } from './en/decks'
import { lessonsEn } from './en/lessons'
import { profileEn } from './en/profile'
import { settingsEn } from './en/settings'

export const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    saving: 'Saving...',
    retry: 'Retry',
    save: 'Save',
    error: 'Something went wrong.',
    empty: 'Nothing here yet.',
  },
  auth: authEn,
  profile: profileEn,
  settings: settingsEn,
  decks: decksEn,
  lessons: lessonsEn,
} as const
