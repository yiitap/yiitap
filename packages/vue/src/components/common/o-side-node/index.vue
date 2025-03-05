<template>
	<section
		class="o-side-node"
		:class="{ 'is-active': active, 'is-empty': isEmpty }"
		v-if="editor?.isEditable"
	>
		<section class="action-container" :class="blockClass">
			<add-node v-bind="props" />
			<drag-node v-bind="props" @action="onAction" v-if="!isEmpty" />
		</section>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'

import AddNode from './AddNode.vue'
import DragNode from './DragNode.vue'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])
const active = ref(false)
const level = ref(0)
const pos = ref(0)

const isEmpty = computed(() => {
	return nodeType.value === 'paragraph' && props.node.content.size === 0
})

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

const headingLevel = computed(() => {
	return level.value || props.node.attrs?.level
})

const blockClass = computed(() => {
	return nodeType.value === 'heading'
		? `type-heading-${headingLevel.value}`
		: `type-${nodeType.value}`
})

function onAction(item) {
	emit('action', item)
}

onMounted(() => {
	level.value = 0
})
</script>

<style lang="scss">
.o-side-node {
	position: absolute;
	width: 80px;
	left: -80px;
	top: 0;
	//background: red;

	&:has(.o-drag-node.is-selected) {
		.o-add-node {
			display: none;
		}
	}

	&.is-empty {
		width: 38px;
		left: -38px;
	}

	&.is-active {
		.action-container {
			visibility: visible !important;
		}
	}

	.action-container {
		//visibility: hidden;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 12px;

		&:has(.is-selected) {
			visibility: visible !important;
		}

		&.type-heading-1 {
			height: 57px;
		}

		&.type-heading-2 {
			height: 33px;
		}

		&.type-heading-3 {
			height: 29px;
		}

		&.type-heading-3 {
			height: 26px;
		}

		&.type-table {
			height: 76px;
		}

		.o-node-btn {
			width: 26px;
			height: 26px;
			padding: 0;
		}
	}
}

body.body--dark .o-drag-node {
	.add,
	.drag-handle {
		border: solid 1px rgba(white, 0.1);
	}

	.drag-handle {
		.text-color {
			color: rgba(white, 0.3);
		}
	}
}

ul {
	.o-drag-node {
		visibility: hidden !important;
	}
}
</style>
