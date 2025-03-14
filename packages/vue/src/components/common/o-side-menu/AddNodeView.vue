<template>
	<section class="o-add-node-view">
		<section class="view-main" v-if="view === 'main'">
			<section>
				<div class="group o-tips">{{ tr('label.basic') }}</div>
				<section class="panel">
					<o-menubar-btn
						v-for="(item, index) in BasicBlocks"
						:key="index"
						:icon="item.icon"
						:tooltip="tr(item.label)"
						quaternary
						@click="onClick(item)"
					/>
				</section>
			</section>
			<o-list hoverable clickable>
				<template v-if="CommonBlocks.length">
					<template v-for="(item, index) in CommonBlocks" :key="index">
						<template v-if="item.group">
							<o-divider v-if="index > 0" />
							<div class="group o-tips">{{ tr(item.group) }}</div>
						</template>
						<o-list-item class="item" clickable @click="onClick(item)">
							<template #prefix>
								<o-icon :name="item.icon" :color="item.color" />
							</template>

							{{ tr(item.label) }}
						</o-list-item>
					</template>
				</template>
				<div class="item" v-else>No result</div>
			</o-list>
		</section>
	</section>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import {
	ODivider,
	OIcon,
	OList,
	OListItem,
	OMenubarBtn,
} from '../../../components/index'
import { BasicBlocks, CommonBlocks } from '../../../constants/block'
import {
	EmptyParagraph,
	EmptyListItem,
	EmptyTaskItem,
} from '../../../constants/empty-block'
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
const { run } = useTiptap()
const view = ref('main')

function onClick(item) {
	const chain = props.editor.chain()
	let content = null
	switch (item.value) {
		case 'blockquote':
			content = {
				content: EmptyParagraph,
			}
			break
		case 'callout':
			content = {
				content: EmptyParagraph,
				attrs: { icon: '💡' },
			}
			break
		case 'codeBlock':
			content = {
				content: [],
				attrs: { language: 'shell' },
			}
			break
		case 'emoji':
			content = {
				type: 'paragraph',
				content: [{ type: 'text', text: ':' }],
			}
			break
		case 'heading':
			content = {
				attrs: item.options,
			}
			break
		case 'horizontalRule':
			content = {}
			break
		case 'paragraph':
			content = {
				content: [],
			}
			break
		case 'bulletList':
		case 'orderedList':
			content = {
				content: EmptyListItem,
			}
			break
		case 'taskList':
			content = {
				content: EmptyTaskItem,
			}
			break
		case 'table':
			setTimeout(() => {
				chain
					.insertContentAt(newPos.value, {
						type: 'paragraph',
						content: [],
					})
					.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
					.focus()
					.run()
			}, 1)
      emit('action', item)
			return
		case 'image':
			content = {
				type: 'paragraph',
				content: [{ type: item.value, attrs: { src: 'init' } }],
			}
			break
		case 'model-viewer':
			content = { attrs: { src: 'init' } }
			break
		default:
			break
	}

	// add new node
	if (content) {
    const insertPos = newPos.value;
    // console.log('add', props.getPos(), newPos.value, insertPos)
		content.type = content.type || item.value
		setTimeout(() => {
      // console.log('add2', props.getPos(), newPos.value, insertPos)
			if (isEmpty.value) {
				chain.insertContent(content).focus().run()
			} else {
				chain.insertContentAt(insertPos, content).focus().run()
			}
		}, 1)
	}
	emit('action', item)
}

const isEmpty = computed(() => {
	return props.node?.content.size === 0
})

const newPos = computed(() => {
  // console.log('node', props.getPos(), props.node)
	return isEmpty.value ? props.getPos() : props.getPos() + props.node.nodeSize
})
</script>

<style lang="scss">
.o-add-node-view {
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

	.items {
		padding: 0 8px !important;
		margin: 0;
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
	}

}
</style>
