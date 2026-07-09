export const profileUk = {
  title: 'Профіль',
  loading: 'Завантаження профілю...',
  loadError: 'Не вдалося завантажити профіль.',
  signedInAs: 'Ви увійшли як',
  role: 'Роль: {{role}}',
  joined: 'Приєднався {{date}}',
  roles: {
    admin: 'Адміністратор',
    moderator: 'Модератор',
    user: 'Користувач',
  },
  accountStatus: {
    title: 'Статус облікового запису',
    emailVerified: 'Електронну пошту підтверджено',
    emailNotVerified: 'Електронну пошту не підтверджено',
    verifiedAt: 'Підтверджено {{date}}',
    verifyPrompt:
      'Підтвердьте електронну пошту, щоб захистити обліковий запис і отримати всі функції.',
    resendVerification: 'Надіслати лист підтвердження ще раз',
    blocked: 'Цей обліковий запис заблоковано. Зверніться до підтримки, якщо вважаєте це помилкою.',
  },
  myGroups: 'Мої групи',
  groupInvitations: 'Запрошення до груп',
  adminDashboard: 'Панель адміністратора',
  userManagement: 'Керування користувачами',
  moderationQueue: 'Черга модерації',
  logOut: 'Вийти',
} as const
