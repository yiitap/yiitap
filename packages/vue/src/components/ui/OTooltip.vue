<template>
  <div ref="triggerRef" data-tippy-role="tooltip">
    <slot name="trigger"></slot>
    <div ref="contentRef" class="tooltip-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import tippy, { type Instance, type Placement, type Props } from 'tippy.js'
import 'tippy.js/animations/perspective.css'

import { useTheme } from '../../hooks'

const props = defineProps({
  placement: {
    type: String,
    default: 'top',
  },
  trigger: {
    type: String,
    default: 'mouseenter focus',
    // default: 'click'
  },
  delay: {
    type: Number,
    default: 100,
  },
  duration: {
    type: Number,
    default: 100,
  },
})
const { theme } = useTheme()
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const instance = ref<Instance<Props>>()

function initTippy() {
  instance.value = tippy(triggerRef.value, {
    appendTo: () => document.body,
    animation: 'perspective', // scale, shift-away
    content: contentRef.value,
    duration: props.duration,
    delay: props.delay,
    interactive: true,
    placement: props.placement as Placement,
    trigger: props.trigger,
  })
}

function resetTippy() {
  instance.value.setProps({
    theme: theme.value,
  })
}

watch(theme, (newValue) => {
  resetTippy()
})
onMounted(() => {
  initTippy()
})
</script>

<style lang="scss"></style>
