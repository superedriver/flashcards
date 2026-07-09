import { authUk } from './uk/auth'

export const uk = {
  common: {
    ok: 'Гаразд',
    cancel: 'Скасувати',
    loading: 'Завантаження...',
    retry: 'Повторити',
    save: 'Зберегти',
    error: 'Щось пішло не так.',
  },
  auth: authUk,
} as const
