<template>
  <div class="o-divider" :class="{ 'o-divider-vertical': vertical }"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-divider {
  //display: flex;
  height: 1px;
  width: 100%;
  margin: 8px 0;
  box-sizing: border-box;
  font-size: 16px;
  background: var(--yii-divider-bg-color);

  &-vertical {
    width: 1px;
    height: 1rem;
    margin: 0 8px;
  }
}
</style>
