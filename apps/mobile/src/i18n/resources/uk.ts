import { authUk } from './uk/auth'
import { decksUk } from './uk/decks'
import { profileUk } from './uk/profile'
import { settingsUk } from './uk/settings'

export const uk = {
  common: {
    ok: 'Гаразд',
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    loading: 'Завантаження...',
    retry: 'Повторити',
    save: 'Зберегти',
    error: 'Щось пішло не так.',
    empty: 'Тут поки нічого немає.',
  },
  auth: authUk,
  profile: profileUk,
  settings: settingsUk,
  decks: decksUk,
} as const
