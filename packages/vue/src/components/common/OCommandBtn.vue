<template>
  <o-tooltip :placement="placement">
    <template #trigger>
      <button
        class="o-menubar-btn o-command-btn o-btn"
        :class="contentClass"
        :style="contentStyle"
        @click="emit('click', $event)"
      >
        <o-icon :name="icon" :color="color" :class="iconClass" v-if="icon" />
        <slot></slot>
      </button>
    </template>
    {{ tooltip }}
  </o-tooltip>
</template>

<script setup lang="ts">
import { OIcon, OTooltip } from '../index'

defineProps({
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  background: {
    type: String,
    default: '',
  },
  tooltip: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  contentClass: {
    type: [String, Object],
    default: '',
  },
  contentStyle: {
    type: [String, Object],
    default: '',
  },
  iconClass: {
    type: [String, Object],
    default: '',
  },
})
const emit = defineEmits(['click'])
</script>

<style lang="scss">
.o-command-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

  .dropdown {
    width: unset;
  }
}
</style>
