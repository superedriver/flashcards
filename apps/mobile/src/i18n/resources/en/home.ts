export const homeEn = {
  title: 'Home',
  loading: 'Loading learning progress...',
  loadError: 'Could not load learning progress.',
  startError: 'Could not start lesson. Please try again.',
  starting: 'Starting lesson...',
  activeTarget: 'Active language: {{language}}',
  noActiveTarget: 'Choose an active study language to start learning.',
  setLanguages: 'Set study languages',
  counters: {
    toLearn: 'To learn',
    practiced: 'Practiced',
    learned: 'Learned',
    due: 'Due now: {{count}}',
  },
  start: 'START',
  addCards: {
    message: 'Add cards to start learning.',
    action: 'Go to decks',
  },
  noReviewNow: {
    message: 'No cards to review right now.',
    action: 'Go to decks',
  },
  emptyLesson: 'No cards are due for review right now.',
} as const
