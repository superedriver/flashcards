export const studyLanguagesEn = {
  selector: {
    accessibilityLabel: 'Current study language {{name}}',
    addAccessibilityLabel: 'Add a study language',
    emptyFlag: '🌐',
    openAccessibilityLabel: 'Change study language',
  },
  studyList: {
    title: 'Your study languages',
    active: 'Active',
    empty: 'No study languages yet.',
    remove: 'Remove',
    removeConfirmTitle: 'Remove study language?',
    removeConfirmMessage:
      'This language is used by {{count}} deck(s). Decks stay unchanged; you can assign languages later.',
    removeConfirmMessageZero: 'Remove this language from your study list?',
    setActiveError: 'Could not switch study language.',
    removeError: 'Could not remove study language.',
  },
  catalog: {
    title: 'Add a language',
    searchPlaceholder: 'Search languages',
    popular: 'Popular',
    all: 'All languages',
    empty: 'No languages match your search.',
    alreadyAdded: 'Already added',
    addError: 'Could not add study language.',
  },
} as const
