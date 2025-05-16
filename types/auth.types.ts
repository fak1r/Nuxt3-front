export type User = {
  email: string
  name: string
  is_admin: boolean
}

export type FormType = 'login' | 'register'

export type FormVariants = Record<
  FormType,
  {
    title: string
    text: string
    link: string
  }
>

export type FormErrors = {
  email?: string
  password?: string
  name?: string
  phone?: string
}
