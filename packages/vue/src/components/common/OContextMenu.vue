<template>
  <o-popover
    ref="popover"
    placement="bottom-start"
    trigger="manual"
    :show="modelValue"
    :show-arrow="false"
    :event="event"
    @update:show="onShow"
    @clickoutside="onClickOutside"
  >
    <slot></slot>
  </o-popover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { OPopover } from '../../index'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  clientX: {
    type: Number,
    default: 0,
  },
  clientY: {
    type: Number,
    default: 0,
  },
  event: {
    type: Object,
    default: function () {
      return {}
    },
  },
})
const emit = defineEmits(['update:modelValue'])
const popover = ref<InstanceType<typeof OPopover>>()

const x = computed(() => {
  return props.clientX || props.event?.clientX || 0
})
const y = computed(() => {
  return props.clientY || props.event?.clientY || 0
})

function onShow(value: boolean) {
  emit('update:modelValue', value)
}

function onClickOutside() {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // make sure event has been set
      setTimeout(() => {
        popover.value?.setShow(newValue)
      }, 0)
    } else {
      popover.value?.setShow(newValue)
    }
  }
)
</script>

<style lang="scss">
.o-context-menu-popover {
}
</style>
