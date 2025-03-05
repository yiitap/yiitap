<template>
	<o-popover
		ref="popover"
		placement="left"
		size="medium"
		trigger="click"
		arrow
		@update:show="onShow"
	>
		<template #trigger>
			<div
				class="o-drag-node"
				:class="{ 'is-selected': selected, 'is-dragging': dragging }"
				contenteditable="false"
				draggable="true"
				data-drag-handle
				@dragstart="onDragStart"
				@dragend="onDragEnd"
			>
				<o-btn type="tertiary" class="o-node-btn">
					<o-icon :name="block.icon" :color="block.color" small />
					<o-icon name="drag_indicator" small />
				</o-btn>
			</div>
		</template>

		<drag-node-view v-bind="props" @action="onAction" />
	</o-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import useTiptap from '../../../hooks/useTiptap'
import { Blocks } from '../../../constants/block'
import { Color } from '../../../constants/color'
import DragNodeView from './DragNodeView.vue'
import { OBtn, OIcon, OPopover } from '../../index'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])
const { run } = useTiptap()
const popover = ref(null)
const currentPos = ref(0)
const selected = ref(false)
const unliftBlocks = ref(['heading', 'codeBlock', 'paragraph'])
const dragging = ref(false)

const nodeType = computed(() => {
	const content = props.node?.content.content
	if (content.length > 0) {
		const first = content[0]
		if (first.type.name === 'image') {
			return first.type.name
		}
	}
	return props.node?.type.name
})

const block = computed(() => {
	let type = nodeType.value
	if (type === 'heading') {
		return {
			icon: `format_h${props.node.attrs?.level || 1}`,
			color: Color.blue,
		}
	} else if (type === 'table-wrapper') {
		type = 'table'
	}
	return Blocks.find((e) => e.value === type) || { icon: 'title' }
})

function onAction(item) {
	popover.value?.setShow(false)
	emit('action', item)
}

function onShow(value: boolean) {
	selected.value = value
	console.log('show', value)

	if (value) {
		selectNode()
	}
}

function selectNode() {
	let pos = props.getPos()
	if (!unliftBlocks.value.includes(nodeType.value)) {
		pos += 1
	}
	props.editor?.commands.setNodeSelection(pos)
	currentPos.value = pos
}

function onDragStart(event: DragEvent) {
	dragging.value = true
	setTimeout(() => {
		dragging.value = false
	}, 10)
}

function onDragEnd(event: DragEvent) {
	dragging.value = false
}
</script>

<style lang="scss">
.o-drag-node {
	display: flex;
	width: 40px;
	margin-left: 2px;
	cursor: grab !important;

	.o-node-btn {
		width: unset !important;
		padding: 5px 4px !important;
		cursor: grab !important;
	}
}
</style>
