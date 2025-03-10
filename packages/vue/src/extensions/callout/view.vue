<template>
	<o-node-view
		v-bind="props"
		class="o-callout-view"
		:style="`--callout-border-color: ${borderColorTheme}; --callout-back-color: ${backColorTheme}`"
		@contextmenu.prevent="onContextMenu"
	>
		<div class="callout-container">
			<div class="callout-icon">
				{{ node.attrs.icon }}
			</div>
			<div class="callout-content">
				<node-view-content />
			</div>

			<o-context-menu v-model="showContextMenu" :event="mouseEvent">
				<o-block-menu v-bind="props" @action="onAction" />
			</o-context-menu>
		</div>
	</o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { OBlockMenu, OContextMenu, ONodeView } from '../../components/index'
import { useTheme } from '../../hooks'

const props = defineProps(nodeViewProps)
const { theme } = useTheme()
const showContextMenu = ref(false)
const showPopover = ref(false)
const mouseEvent = ref({})

const isFocused = computed(() => {
	const active = props.editor.isActive('callout')
	const { selection } = props.editor.view.state
	const pos = selection.from
	const nodeFrom = props.getPos()
	const nodeTo = nodeFrom + props.node.nodeSize
	return pos >= nodeFrom && pos <= nodeTo
})

const attrs = computed(() => {
	return props.node.attrs
})

const backColor = computed({
	get() {
		return props.node.attrs.backColor
	},
	set(value) {
		props.updateAttributes({ backColor: value })
	},
})

const backColorDark = computed({
	get() {
		return props.node.attrs.backColorDark
	},
	set(value) {
		props.updateAttributes({ backColorDark: value })
	},
})

const borderColor = computed({
	get() {
		return props.node.attrs.borderColor
	},
	set(value) {
		props.updateAttributes({ borderColor: value })
	},
})

const borderColorDark = computed({
	get() {
		return props.node.attrs.borderColorDark
	},
	set(value) {
		props.updateAttributes({ borderColorDark: value })
	},
})

const backColorTheme = computed(() => {
	return theme.value === 'dark' ? backColorDark.value : backColor.value
})

const borderColorTheme = computed(() => {
	return theme.value === 'dark' ? borderColorDark.value : borderColor.value
})

function setIcon(icon) {
	props.updateAttributes({ icon: icon })
}

function onAction(action: BlockOption) {
	showContextMenu.value = false
	switch (action.value) {
		case 'palette':
			onShowPopover(true)
			break
	}
}

function onContextMenu(e: MouseEvent) {
	showContextMenu.value = true
	mouseEvent.value = e
}

function onShowPopover(value: boolean) {
	showPopover.value = value
}

function onSelect(command: string, value: string) {
	switch (command) {
		case 'foreColor':
			borderColor.value = value
			break
		case 'backColor':
			backColor.value = value
			break
	}
}

watch(isFocused, (newValue) => {
	onShowPopover(newValue)
})
</script>

<style lang="scss">
.o-callout-view {
	position: relative;
	border-radius: 4px;
	padding: 12px;
	margin: 4px 0;
	background: var(--callout-back-color);
	border: solid 1px var(--callout-border-color);

	.callout-container {
		display: flex;
	}

	.callout-icon {
		height: 36px;
		width: 36px;
		font-size: 28px;
		text-align: center;
		line-height: 36px;
		color: black;
		z-index: 2;
		margin-right: 12px;

		&:hover {
			background: rgba(#000000, 0.1);
			//background: red;
			border-radius: 4px;
			cursor: pointer;
		}
	}

	.callout-content {
		flex: 1 1 auto;
	}
}

.o-callout-popover {
	padding: 0 !important;
	top: -14px;
	right: -12px;
	min-width: 200px;
	box-shadow: none !important;
	background: transparent !important;

	.n-popover__content {
		display: flex;
		justify-content: flex-end;
	}
}

.o-callout-action {
	border-radius: 4px;
	padding: 4px;
}
</style>
