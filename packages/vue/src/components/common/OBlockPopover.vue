<template>
  <o-popover
    ref="popover"
    :placement="placement"
    :tippy-class="tippyClass"
    trigger="manual"
    :arrow="showArrow"
    :offset="offset"
    :show="modelValue"
    @update:show="onShow"
    @clickoutside="onClickOutside"
  >
    <template #trigger>
      <slot></slot>
    </template>

    <slot name="popover-content"> </slot>
  </o-popover>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { OPopover } from '../index'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: 'bottom-center',
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
  hideClickOutside: {
    type: Boolean,
    default: false,
  },
  tippyClass: {
    type: String,
    default: '',
  },
  offset: {
    type: Array as () => number[],
    default: function () {
      return [0, 10]
    },
  },
})
const emit = defineEmits(['update:modelValue', 'show', 'hide'])

const popover = ref<InstanceType<typeof OPopover>>()

function onShow(value: boolean) {
  emit('update:modelValue', value)
}

function onClickOutside() {
  if (props.hideClickOutside) {
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    console.log('modelValue', newValue)
    if (newValue) {
      popover.value?.setShow(true)
    } else {
      popover.value?.setShow(false)
    }
  }
)

onMounted(() => {
  if (props.modelValue) {
    popover.value?.setShow(true)
  }
})
</script>

<style lang="scss">
.o-block-popover {
}
</style>
