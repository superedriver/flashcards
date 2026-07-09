import { adminUk } from './uk/admin'
import { aiExamplesUk } from './uk/ai-examples'
import { authUk } from './uk/auth'
import { csvImportUk } from './uk/csv-import'
import { decksUk } from './uk/decks'
import { groupsUk } from './uk/groups'
import { lessonsUk } from './uk/lessons'
import { profileUk } from './uk/profile'
import { publicDecksUk } from './uk/public-decks'
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
  admin: adminUk,
  auth: authUk,
  aiExamples: aiExamplesUk,
  profile: profileUk,
  settings: settingsUk,
  decks: decksUk,
  groups: groupsUk,
  lessons: lessonsUk,
  publicDecks: publicDecksUk,
  csvImport: csvImportUk,
} as const
