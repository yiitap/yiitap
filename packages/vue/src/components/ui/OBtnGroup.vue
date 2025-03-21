<template>
  <div class="o-btn-group">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { OIcon } from '../index'

defineProps({
  icon: {
    type: String,
    default: '',
  },
  iconClass: {
    type: [String, Object],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['click'])
</script>

<style lang="scss">
.o-btn-group {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  .o-btn {
    width: unset;
    height: 36px;
    padding: 8px;
    background: var(--yii-active-bg-color);
  }

  div[data-tippy-role='tooltip'] {
    &:not(:first-child):not(:last-child) .o-btn {
      border-radius: 0;
    }

    &:not(:first-child) .o-btn {
      border-left: solid 1px var(--yii-hover-bg-color);
    }

    &:first-child .o-btn {
      border-radius: 6px 0 0 6px;
    }

    &:last-child .o-btn {
      border-radius: 0 6px 6px 0;
    }
  }
}
</style>
