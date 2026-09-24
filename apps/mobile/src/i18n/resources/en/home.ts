export const homeEn = {
  title: 'Home',
  loading: 'Loading learning progress...',
  loadError: 'Could not load learning progress.',
  startError: 'Could not start review. Please try again.',
  starting: 'Starting review...',
  todayReview: "Today's review",
  noActiveTarget: 'Choose an active study language to start learning.',
  setLanguages: 'Set study languages',
  counters: {
    toLearn: 'To learn',
    practiced: 'Practiced',
    learned: 'Learned',
    due: 'Due now: {{count}}',
    dueNowLabel: 'Due now',
  },
  start: 'Start review',
  addCards: {
    title: 'No cards to study yet',
    message: 'Create a deck or add cards to get started.',
    action: 'Go to decks',
  },
  noReviewNow: {
    message: 'No cards to review right now.',
    action: 'Go to decks',
  },
  emptyLesson: 'No cards are due for review right now.',
} as const
