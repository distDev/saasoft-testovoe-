export type AccountType = 'LDAP' | 'Локальная'

export interface AccountLabel {
  text: string
}

export interface AccountRecord {
  id: string
  label: AccountLabel[]
  type: AccountType
  login: string
  password: string | null
}

export type AccountModel = Pick<AccountRecord, 'type' | 'login' | 'password'> & { labelText: string }

export const ACCOUNT_TYPE_OPTIONS: Array<{ label: AccountType; value: AccountType }> = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Локальная' },
]

export function labelsToInputValue(labels: AccountLabel[]): string {
  return labels.map((l) => l.text).join('; ')
}

export function inputValueToLabels(value: string): AccountLabel[] {
  return value
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
}

