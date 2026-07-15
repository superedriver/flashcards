export const studyLanguagesUk = {
  selector: {
    accessibilityLabel: 'Поточна мова вивчення {{name}}',
    addAccessibilityLabel: 'Додати мову вивчення',
    emptyFlag: '🌐',
    openAccessibilityLabel: 'Змінити мову вивчення',
  },
  studyList: {
    title: 'Ваші мови вивчення',
    active: 'Активна',
    empty: 'Ще немає мов вивчення.',
    remove: 'Видалити',
    removeConfirmTitle: 'Видалити мову вивчення?',
    removeConfirmMessage:
      'Цю мову використовує {{count}} колода(и). Колоди не зміняться; мови можна призначити пізніше.',
    removeConfirmMessageZero: 'Прибрати цю мову зі списку вивчення?',
    setActiveError: 'Не вдалося змінити мову вивчення.',
    removeError: 'Не вдалося видалити мову вивчення.',
  },
  catalog: {
    title: 'Додати мову',
    searchPlaceholder: 'Пошук мов',
    popular: 'Популярні',
    all: 'Усі мови',
    empty: 'Немає мов за вашим запитом.',
    alreadyAdded: 'Вже додано',
    addError: 'Не вдалося додати мову вивчення.',
  },
} as const
