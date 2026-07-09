import { authUk } from './uk/auth'
import { decksUk } from './uk/decks'
import { lessonsUk } from './uk/lessons'
import { profileUk } from './uk/profile'
import { settingsUk } from './uk/settings'

export const uk = {
  common: {
    ok: 'Гаразд',
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    loading: 'Завантаження...',
    saving: 'Збереження...',
    retry: 'Повторити',
    save: 'Зберегти',
    error: 'Щось пішло не так.',
    empty: 'Тут поки нічого немає.',
  },
  auth: authUk,
  profile: profileUk,
  settings: settingsUk,
  decks: decksUk,
  lessons: lessonsUk,
} as const
