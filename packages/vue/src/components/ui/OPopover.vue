<template>
	<div ref="triggerRef" data-tippy-role="popover" class="o-popover">
		<slot name="trigger"></slot>
		<div ref="contentRef" class="popover-content" :class="tippyClass">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import tippy from 'tippy.js'
import type { Instance, Props, Placement } from 'tippy.js'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/perspective.css'

import { useTheme } from '../../hooks'

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	arrow: {
		type: Boolean,
		default: false,
	},
	offset: {
		type: Array as () => number[],
		default: function () {
			return [0, 10]
		},
	},
	placement: {
		type: String,
		default: 'bottom-start',
	},
	trigger: {
		type: String,
		default: 'mouseenter focus',
	},
	tippyClass: {
		type: String,
		default: 'tippy',
	},
	event: {
		type: Object,
		default: function () {
			return {}
		},
	},
})
const emit = defineEmits(['update:show'])
const { theme } = useTheme()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement>()
const instance = ref<Instance<Props>>()

function setShow(show: boolean) {
	if (show) {
		instance.value?.setProps({
			getReferenceClientRect: props.event?.clientX
				? getReferenceClientRect
				: null,
		})
		instance.value?.show()
	} else {
		instance.value?.hide()
	}
}

function getReferenceClientRect() {
	return {
		width: 0,
		height: 0,
		left: props.event.clientX,
		right: props.event.clientX,
		top: props.event.clientY,
		bottom: props.event.clientY,
		x: props.event?.clientX || 0, // add missing x
		y: props.event?.clientY || 0,
		toJSON: () => ({
			// add toJSON method to satisfy DOMRect
			width: 100,
			height: 100,
			left: props.event?.clientX || 0,
			top: props.event?.clientY || 0,
		}),
	}
}

function initTippy() {
	instance.value = tippy(triggerRef.value, {
		appendTo: () => document.body,
		animation: 'shift-away', // perspective, scale, shift-away
		arrow: props.arrow,
		content: contentRef.value,
		delay: 100,
		duration: 200,
		interactive: true,
		// offset: props.offset, // todo
		placement: props.placement as Placement,
		trigger: props.trigger,
		theme: theme.value,
		onShow: (instance) => {
			instance.popper.classList.add(props.tippyClass)
			emit('update:show', true)
		},
		onHide: (instance) => {
			emit('update:show', false)
		},
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

defineExpose({
	setShow,
})
</script>

<style lang="scss"></style>
