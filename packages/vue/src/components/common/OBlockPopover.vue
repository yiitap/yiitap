<template>
  <o-popover
    ref="popover"
    :placement="placement"
    :tippy-class="tippyClass"
    :content-class="contentClass"
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
import { ref, watch, onMounted, onUnmounted, type PropType } from 'vue'
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
  contentClass: {
    type: String,
    default: '',
  },
  offset: {
    type: Object as PropType<[number, number]>,
    default: function () {
      return [0, 10] as [number, number]
    },
  },
})
const emit = defineEmits(['update:modelValue', 'show', 'hide'])

const popover = ref<InstanceType<typeof OPopover>>()

function onShow(value: boolean) {
  emit('update:modelValue', value)
}

function onClickOutside() {
  console.log('click outside')
  if (props.hideClickOutside) {
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
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

onUnmounted(() => {
  popover.value?.setShow(false)
})
</script>

<style lang="scss">
.o-block-popover {
}
</style>
