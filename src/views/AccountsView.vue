<script setup lang="ts">
import { NButton, NH2, NText, NSpace } from 'naive-ui'
import { useAccountsStore } from '@/stores/accounts'
import AccountRow from '@/components/accounts/AccountRow.vue'

const store = useAccountsStore()

const handleAddAccount = () => {
  store.addAccount('Локальная')
}
</script>

<template>
  <main class="page-container">
    <header class="page-header">
      <n-space align="center" justify="space-between">
        <n-space align="center" size="medium">
          <n-h2 class="title">Учетные записи</n-h2>
          <n-button type="primary" secondary size="small" @click="handleAddAccount">
            <template #icon>+</template>
            Добавить
          </n-button>
        </n-space>
      </n-space>

      <n-text depth="3" class="hint">
        💡 Для указания нескольких меток используйте разделитель <code>;</code>
      </n-text>
    </header>

    <section v-if="store.accounts.length" class="accounts-table">
      <div class="table-header">
        <div class="col">Метка</div>
        <div class="col">Тип записи</div>
        <div class="col">Логин</div>
        <div class="col">Пароль</div>
        <div class="col actions"></div>
      </div>

      <div class="table-body">
        <AccountRow v-for="acc in store.accounts" :key="acc.id" :account="acc" class="table-row" />
      </div>
    </section>

    <section v-else class="empty-state">
      <n-text depth="3">
        Список пуст
      </n-text>
    </section>
  </main>
</template>

<style scoped>
.page-container {
  --row-grid: minmax(240px, 1.4fr) minmax(160px, 0.8fr) minmax(220px, 1fr) minmax(220px, 1fr) 44px;
  --table-min-width: 900px;

  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  margin-bottom: 20px;
}

.title {
  margin: 0 !important;
}

.hint {
  display: block;
  margin-top: 8px;
  font-size: 13px;
}

.accounts-table {
  border: 1px solid var(--n-border-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow-x: auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.table-header {
  display: grid;
  grid-template-columns: var(--row-grid);
  gap: 12px;
  align-items: center;
  padding: 12px;
  min-width: var(--table-min-width);
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-weight: 600;
  color: var(--n-text-color-2);
}

.table-body {
  min-width: var(--table-min-width);
}


.table-row :deep(.row) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  grid-template-columns: var(--row-grid) !important;
}

.table-row:last-child :deep(.row) {
  border-bottom: none;
}

.empty-state {
  margin-top: 40px;
  text-align: center;
  padding: 48px;
  border: 2px dashed rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.col.actions {
  display: flex;
  justify-content: center;
}
</style>
