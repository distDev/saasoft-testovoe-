import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AccountRecord, AccountType } from '@/types/accounts'
import { inputValueToLabels } from '@/types/accounts'

const STORAGE_KEY = 'accounts-v1'

function createUniqueId(): string {
  return `acc_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function isLabelObject(x: unknown): x is { text: string } {
  if (!x || typeof x !== 'object') return false
  return typeof (x as Record<string, unknown>).text === 'string'
}

function safeParseAccounts(raw: string | null): AccountRecord[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const result: AccountRecord[] = []
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue
      const rec = item as Partial<AccountRecord>

      const id = typeof rec.id === 'string' && rec.id.length ? rec.id : createUniqueId()
      const type: AccountType = rec.type === 'LDAP' || rec.type === 'Локальная' ? rec.type : 'Локальная'
      const login = typeof rec.login === 'string' ? rec.login : ''
      const password = type === 'LDAP' ? null : typeof rec.password === 'string' ? rec.password : ''

      const labelRaw = Array.isArray(rec.label) ? rec.label : []
      const label = labelRaw.filter(isLabelObject).map((x) => ({ text: x.text }))

      result.push({ id, type, login, password, label })
    }
    return result
  } catch {
    return []
  }
}

function saveAccounts(value: AccountRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<AccountRecord[]>([])
  const hydrated = ref(false)

  function init() {
    accounts.value = safeParseAccounts(localStorage.getItem(STORAGE_KEY))
    hydrated.value = true
  }

  function addAccount(defaultType: AccountType = 'Локальная') {
    const type = defaultType
    const password = type === 'LDAP' ? null : ''
    accounts.value.push({
      id: createUniqueId(),
      label: [],
      type,
      login: '',
      password,
    })
  }

  function removeAccount(id: string) {
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  function updateAccount(
    id: string,
    patch: Partial<Pick<AccountRecord, 'label' | 'type' | 'login' | 'password'>>
  ) {
    const idx = accounts.value.findIndex((a) => a.id === id)
    if (idx === -1) return

    const current = accounts.value[idx]
    if (!current) return
    const next: AccountRecord = { ...current, ...patch }

    if (next.type === 'LDAP') {
      next.password = null
    } else if (typeof next.password !== 'string') {
      next.password = ''
    }

    accounts.value[idx] = next
  }

  function setLabelsFromInputValue(id: string, value: string) {
    updateAccount(id, { label: inputValueToLabels(value) })
  }

  watch(
    accounts,
    (value) => {
      if (!hydrated.value) return
      saveAccounts(value)
    },
    { deep: true }
  )

  return {
    accounts,
    init,
    addAccount,
    removeAccount,
    updateAccount,
    setLabelsFromInputValue,
  }
})

