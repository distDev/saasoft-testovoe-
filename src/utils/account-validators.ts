import type { FormRules } from 'naive-ui'

export const getAccountRules = (isLocal: () => boolean): FormRules => ({
  labelText: {
    key: 'labelText',
    trigger: 'blur',
    validator: (_, value: string) => value?.length <= 50 || new Error('Максимальная длина — 50 символов')
  },
  type: {
    key: 'type',
    trigger: 'change',
    validator: (_, value) => ['LDAP', 'Локальная'].includes(value) || new Error('Выберите тип записи')
  },
  login: [
    { key: 'login', required: true, message: 'Логин обязателен', trigger: 'blur' },
    { key: 'login', max: 100, message: 'Максимальная длина — 100 символов', trigger: 'blur' }
  ],
  password: {
    key: 'password',
    trigger: 'blur',
    validator: (_, value: string) => {
      if (!isLocal()) return true
      if (!value) return new Error('Пароль обязателен')
      return value.length <= 100 || new Error('Максимальная длина — 100 символов')
    }
  }
})