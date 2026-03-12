import { isAxiosError } from 'axios'
import type { FormErrors } from '~/types/auth.types'

const INVALID_CREDENTIALS = 'Неверный email или пароль'
const NETWORK_ERROR = 'Ошибка сети. Проверьте подключение'

export function mapAuthApiError(error: unknown): FormErrors {
  if (!isAxiosError(error)) {
    return { email: NETWORK_ERROR }
  }

  const status = error.response?.status
  const detail = error.response?.data?.detail as unknown

  if (typeof detail === 'string') {
    if (detail === 'Invalid email or password') {
      return {
        email: INVALID_CREDENTIALS,
        password: INVALID_CREDENTIALS,
      }
    }

    if (detail === 'Email already registered') {
      return { email: 'Email уже зарегистрирован' }
    }
  }

  if (status === 422) {
    return { email: 'Проверьте данные формы' }
  }

  if (status === 429) {
    return { email: 'Слишком много попыток. Попробуйте позже' }
  }

  if (status && status >= 500) {
    return { email: 'Ошибка сервера. Попробуйте позже' }
  }

  if (!error.response) {
    return { email: NETWORK_ERROR }
  }

  return {
    email: typeof detail === 'string' && detail ? detail : 'Не удалось выполнить запрос. Попробуйте позже',
  }
}

export function logAuthError(prefix: string, error: unknown) {
  const message = isAxiosError(error)
    ? error.response?.data?.detail || error.message
    : error instanceof Error
      ? error.message
      : String(error)

  console.error(prefix, message)
}
