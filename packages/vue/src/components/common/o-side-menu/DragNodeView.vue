<template>
	<section class="o-drag-node-view">
		<section class="view-main" v-if="view === 'main'">
			<section v-if="isStyleType">
				<div class="group o-tips">Turn into</div>
				<section class="panel">
					<o-menubar-btn
						v-for="(item, index) in StyleBlocks"
						:key="index"
						:icon="item.icon"
						:tooltip="tr(item.label)"
						:content-class="{ 'is-active': isActive(item) }"
						quaternary
						@click="onAction(item)"
					/>
				</section>
			</section>

			<o-block-menu v-bind="props" colorful show-group @action="onAction" />
		</section>
	</section>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import { OBlockMenu, OMenubarBtn } from '../../../components/index'
import { StyleBlocks } from '../../../constants/block'
import { Color } from '../../../constants/color'
import type { NodeViewProps } from '@tiptap/core'

const props = defineProps({
	editor: {
		type: Object as PropType<NodeViewProps['editor']>,
		required: true as const,
	},
	node: {
		type: Object as PropType<NodeViewProps['node']>,
		required: true as const,
	},
	getPos: {
		type: Function as PropType<NodeViewProps['getPos']>,
		required: true as const,
	},
	updateAttributes: {
		type: Function as PropType<NodeViewProps['updateAttributes']>,
		required: true as const,
	},
	deleteNode: {
		type: Function as PropType<NodeViewProps['deleteNode']>,
		required: true as const,
	},
})
const emit = defineEmits(['action'])

const { locale, tr } = useI18n()
const { run, onCommand } = useTiptap()
const view = ref('main')
const unliftBlocks = ref(['heading', 'codeBlock', 'paragraph'])

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

const isStyleType = computed(() => {
	return StyleBlocks.find((e) => e.value === nodeType.value)
})

function isActive(item: Indexable) {
	return (
		item.value === nodeType.value &&
		props.editor?.isActive(nodeType.value, item.options)
	)
}

function onAction(item: Indexable) {
	switch (item.value) {
		case 'delete':
			break
		case 'duplicate':
			break
		default:
			runCommand(item)
			break
	}
	emit('action', item)
}

function runCommand(item: Indexable) {
	const pos = props.getPos()
	if (
		item.value === nodeType.value &&
		unliftBlocks.value.indexOf(nodeType.value) < 0
	) {
		const isActive = props.editor?.isActive(nodeType.value)
		const res = props.editor?.commands.lift(nodeType.value)
		console.log('lift', nodeType.value, isActive, res)
		return
	}

	const commands = props.editor?.commands
	const focus = props.editor?.chain().focus(pos + 1)
	console.log('runCommand', item)
	onCommand(commands, focus, item.value, item.options)
	props.editor?.commands.focus()
	// props.editor?.commands.setNodeSelection(pos)
}
</script>

<style lang="scss">
.o-drag-node-view {
	border-radius: 4px;
	width: 232px;
	font-size: 0.9rem;

	.panel {
		padding: 0 8px;

		.o-tooltip {
			display: inline-block;
			width: 36px;
			height: 36px;
			padding: 0;

			.o-menubar-btn {
				width: 36px;
				height: 36px;
			}
		}
	}

	.group {
		font-size: 12px;
		padding: 4px 10px;
	}

	.item {
		min-height: 40px !important;
		text-align: left;
		background: transparent;
		border-radius: 3px;
		padding: 4px 8px;
		text-transform: unset;

		&.is-selected {
			border-color: #000;
		}

		.suffix {
			font-size: 10px;
		}
	}

}
</style>
