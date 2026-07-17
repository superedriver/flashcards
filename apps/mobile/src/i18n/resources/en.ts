import { adminEn } from './en/admin'
import { aiExamplesEn } from './en/ai-examples'
import { authEn } from './en/auth'
import { csvImportEn } from './en/csv-import'
import { decksEn } from './en/decks'
import { groupsEn } from './en/groups'
import { lessonsEn } from './en/lessons'
import { profileEn } from './en/profile'
import { publicDecksEn } from './en/public-decks'
import { settingsEn } from './en/settings'
import { studyLanguagesEn } from './en/study-languages'

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
    tabs: {
      home: 'Home',
      decks: 'Decks',
      profile: 'Profile',
    },
    homeWelcome: 'Welcome to Flashcards.',
  },
  admin: adminEn,
  auth: authEn,
  aiExamples: aiExamplesEn,
  profile: profileEn,
  settings: settingsEn,
  decks: decksEn,
  groups: groupsEn,
  lessons: lessonsEn,
  publicDecks: publicDecksEn,
  csvImport: csvImportEn,
  studyLanguages: studyLanguagesEn,
} as const
