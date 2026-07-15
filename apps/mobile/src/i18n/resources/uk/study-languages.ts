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
  onboarding: {
    title: 'Оберіть мови',
    description:
      'Оберіть мову, яку хочете вивчати, і мову перекладу. Пізніше можна додати більше мов вивчення.',
    targetLabel: 'Мова вивчення',
    targetPlaceholder: 'Оберіть мову вивчення',
    targetPickerTitle: 'Оберіть мову вивчення',
    nativeLabel: 'Моя мова',
    nativePlaceholder: 'Оберіть рідну мову',
    nativePickerTitle: 'Оберіть рідну мову',
    submit: 'Продовжити',
    submitting: 'Збереження...',
    submitError: 'Не вдалося зберегти мови.',
    validationRequired: 'Оберіть обидві мови, щоб продовжити.',
    legacyHintTitle: 'Колоди без мов',
    legacyHintMessage:
      'Колоди без мов з’являються в розділі «Без мови» на екрані колод. Призначте мови, коли будете готові.',
  },
} as const
