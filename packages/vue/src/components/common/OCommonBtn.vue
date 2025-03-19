<template>
  <o-tooltip :placement="placement">
    <template #trigger>
      <div
        class="o-menubar-btn o-command-btn o-btn"
        :class="contentClass"
        :style="contentStyle"
        @click="emit('click', $event)"
      >
        <template v-if="loading">
          <div class="spinner"></div>
        </template>
        <template v-else>
          <o-icon :name="icon" :color="color" :class="iconClass" />
        </template>
        <slot></slot>
      </div>
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
  loading: {
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
.o-common-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--yii-border-color);
  border-top-color: var(--yii-brand-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-sizing: border-box;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
