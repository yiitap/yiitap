<script setup lang="ts">
defineProps<{
  package: string
}>()
</script>

<template>
  <a
    :href="`https://www.npmjs.com/package/${package}`"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      :src="`https://img.shields.io/npm/v/${package}.svg`"
      alt="NPM version"
    />
  </a>
</template>

<style scoped>
a {
  display: inline-block;
  height: 20px;
}
</style>
