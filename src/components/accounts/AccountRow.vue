<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  NButton, NForm, NFormItem, NInput, NSelect,
  type FormInst,
} from 'naive-ui'
import type { AccountRecord, AccountType, AccountModel } from '@/types/accounts'
import { ACCOUNT_TYPE_OPTIONS, labelsToInputValue } from '@/types/accounts'
import { useAccountsStore } from '@/stores/accounts'
import { getAccountRules } from '@/utils/account-validators'

const props = defineProps<{
  account: AccountRecord
}>()

const store = useAccountsStore()
const formRef = ref<FormInst | null>(null)

const model = reactive<AccountModel>({
  labelText: labelsToInputValue(props.account.label),
  type: props.account.type,
  login: props.account.login,
  password: props.account.password ?? '',
})

const isLocal = computed(() => model.type === 'Локальная')
const rules = computed(() => getAccountRules(() => isLocal.value))

async function commitField(path: keyof AccountModel, updateFn: () => void) {
  try {
    await formRef.value?.validate(undefined, (rule) => (rule as { key?: string }).key === path)
    updateFn()
  } catch (error) {
    console.debug('Validation failed for:', path, error)
  }
}

const onLabelBlur = () => commitField('labelText', () => {
  store.setLabelsFromInputValue(props.account.id, model.labelText)
})

const onLoginBlur = () => commitField('login', () => {
  store.updateAccount(props.account.id, { login: model.login })
})

const onPasswordBlur = () => commitField('password', () => {
  if (isLocal.value) {
    store.updateAccount(props.account.id, { password: model.password })
  }
})

async function onTypeChange(next: AccountType) {
  model.type = next

  await commitField('type', () => {
    if (next === 'LDAP') {
      model.password = ''
      formRef.value?.restoreValidation()
    }
    store.updateAccount(props.account.id, { type: next })
  })
}

watch(
  () => props.account,
  (newAcc) => {
    Object.assign(model, {
      ...newAcc,
      labelText: labelsToInputValue(newAcc.label),
      password: newAcc.password ?? ''
    })
  },
  { deep: true }
)
</script>

<template>
  <n-form ref="formRef" :model="model" :rules="rules" :show-feedback="false" :show-label="false">
    <div class="account-row">
      <n-form-item path="labelText" class="cell label">
        <n-input v-model:value="model.labelText" maxlength="50" placeholder="dev; admin" size="small"
          @blur="onLabelBlur" />
      </n-form-item>

      <n-form-item path="type" class="cell type">
        <n-select v-model:value="model.type" :options="ACCOUNT_TYPE_OPTIONS" size="small"
          @update:value="onTypeChange" />
      </n-form-item>

      <n-form-item path="login" class="cell login" :class="{ 'span-2': !isLocal }">
        <n-input v-model:value="model.login" maxlength="100" placeholder="Логин" size="small" @blur="onLoginBlur" />
      </n-form-item>

      <div v-if="isLocal" class="cell password">
        <n-form-item path="password">
          <n-input v-model:value="model.password" type="password" show-password-on="click" maxlength="100"
            placeholder="Пароль" size="small" @blur="onPasswordBlur" />
        </n-form-item>
      </div>

      <div class="cell actions">
        <n-button quaternary circle type="error" size="small" @click="store.removeAccount(props.account.id)">
          🗑
        </n-button>
      </div>
    </div>
  </n-form>
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) minmax(160px, 0.8fr) minmax(220px, 1fr) minmax(220px, 1fr) 44px;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
}

.cell {
  min-width: 0;
}

.span-2 {
  grid-column: 3 / 5;
}

.actions {
  display: flex;
  justify-content: center;
}

:deep(.n-form-item) {
  margin-bottom: 0;
}

:deep(.n-form-item-blank) {
  min-height: auto;
}
</style>