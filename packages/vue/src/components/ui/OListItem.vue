<template>
  <li class="o-list-item">
    <div class="o-list-item__prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="o-list-item__main">
      <slot></slot>
    </div>
    <div class="o-list-item__suffix">
      <slot name="suffix"></slot>
    </div>
  </li>
</template>

<script setup lang="ts">
const props = defineProps({
  hoverable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-list-item {
  position: relative;
  padding: 8px;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__prefix {
    flex: 0;
    margin-right: 10px;
  }

  &__main {
    flex: 1;
  }

  &__suffix {
    flex: 0;
    white-space: nowrap;
  }

  &.is-active,
  &.is-selected {
    background: var(--yii-active-bg-color);
  }
}
</style>
