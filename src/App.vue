<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, NGlobalStyle } from 'naive-ui'
</script>

<template>
  <n-config-provider>
    <n-global-style />
    <RouterView />
  </n-config-provider>
</template>

<style scoped>
:global(body) {
  margin: 0;
}
</style>
