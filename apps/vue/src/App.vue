<template>
  <n-config-provider :theme="theme">
    <Demo @mode="onMode"></Demo>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import Demo from './components/Demo.vue'

const darkMode = ref(false)
const theme = computed(() => {
  return darkMode.value ? darkTheme : null
})

function onMode(value: boolean) {
  darkMode.value = value
}
</script>
