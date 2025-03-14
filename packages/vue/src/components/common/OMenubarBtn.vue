<template>
  <o-tooltip class="o-tooltip" :placement="placement">
    <template #trigger>
      <button
        class="o-menubar-btn o-command-btn o-btn"
        :class="contentClass"
        :style="contentStyle"
        @click="emit('click', $event)"
      >
        <o-icon :name="icon" :color="color" :class="iconClass" />
      </button>
    </template>

    {{ tooltip }}
  </o-tooltip>
</template>

<script setup lang="ts">
import OIcon from '../ui/OIcon.vue'
import OTooltip from '../ui/OTooltip.vue'

const props = defineProps({
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
.o-menubar-btn {
  display: inline-flex;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .content {
    display: none;
    padding: 100px;
  }
}

.tippy-box[data-theme='tooltip'] {
  //background: red;
}
</style>
