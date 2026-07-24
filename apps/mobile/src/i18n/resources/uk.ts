import { adminUk } from './uk/admin'
import { aiExamplesUk } from './uk/ai-examples'
import { authUk } from './uk/auth'
import { csvImportUk } from './uk/csv-import'
import { decksUk } from './uk/decks'
import { groupsUk } from './uk/groups'
import { homeUk } from './uk/home'
import { lessonsUk } from './uk/lessons'
import { profileUk } from './uk/profile'
import { publicDecksUk } from './uk/public-decks'
import { settingsUk } from './uk/settings'
import { studyLanguagesUk } from './uk/study-languages'

export const uk = {
  common: {
    ok: 'Гаразд',
    cancel: 'Скасувати',
    close: 'Закрити',
    confirm: 'Підтвердити',
    loading: 'Завантаження...',
    saving: 'Збереження...',
    retry: 'Повторити',
    save: 'Зберегти',
    error: 'Щось пішло не так.',
    empty: 'Тут поки нічого немає.',
    tabs: {
      home: 'Головна',
      decks: 'Колоди',
      profile: 'Профіль',
    },
    homeWelcome: 'Ласкаво просимо до Flashcards.',
  },
  admin: adminUk,
  auth: authUk,
  aiExamples: aiExamplesUk,
  profile: profileUk,
  settings: settingsUk,
  decks: decksUk,
  groups: groupsUk,
  home: homeUk,
  lessons: lessonsUk,
  publicDecks: publicDecksUk,
  csvImport: csvImportUk,
  studyLanguages: studyLanguagesUk,
} as const
