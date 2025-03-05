<template>
	<o-node-view
		v-bind="props"
		class="o-heading-view"
		:class="`h${level}`"
		:data-id="node.attrs['data-id']"
		:style="`text-align: ${node.attrs.textAlign}`"
	>
		<node-view-content />
	</o-node-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView } from '../../components'

const props = defineProps(nodeViewProps)
const level = computed(() => {
	return props.node.attrs.level
})
</script>

<style lang="scss">
.o-heading-view {
	position: relative;

	.o-drag-node {
		top: 0;
		bottom: 0;
	}

	&.h1,
	&.h2,
	&.h3,
	&.h4,
	&.h5 {
		font-weight: 600;
		line-height: 1.3;
		padding: 3px 0;
		margin: 1rem 0 1px 0;

		&:first-child {
			margin-top: 0 !important;
		}

		&:last-child {
			margin-bottom: 0 !important;
		}
	}

	&.h1 {
		font-size: 40px;
		line-height: 1.2;

		&:first-child {
			padding-bottom: 6px;
			margin-bottom: 8px;
		}
	}

	&.h2 {
		font-size: 1.5rem;
	}

	&.h3 {
		font-size: 1.25rem;
	}

	&.h4 {
		font-size: 1.1rem;
	}

	&.h5 {
		font-size: 1rem;
	}
}
</style>
