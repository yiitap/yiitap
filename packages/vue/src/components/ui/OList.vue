<template>
  <ul class="o-list" :class="{ clickable: clickable, hoverable: hoverable }">
    <slot></slot>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  clickable: {
    type: Boolean,
    default: false,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-list {
  margin: 0 !important;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;

  &.clickable {
    .o-list-item {
      cursor: pointer;
    }
  }

  &.hoverable {
    .o-list-item:hover {
      background: var(--yii-hover-bg-color);
    }
  }
}
</style>
