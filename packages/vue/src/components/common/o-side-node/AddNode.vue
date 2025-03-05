<template>
	<o-popover
		ref="popover"
		placement="left"
		trigger="mouseenter"
		arrow
		@update:show="onShow"
	>
		<template #trigger>
			<div class="o-add-node" :class="{ 'is-selected': selected }">
				<o-btn type="tertiary" class="o-node-btn">
					<o-icon name="add" small />
				</o-btn>
			</div>
		</template>

		<add-node-view v-bind="props" @action="onAction" />
	</o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import AddNodeView from './AddNodeView.vue'
import { OBtn, OIcon, OPopover } from '../../index'

const props = defineProps(nodeViewProps)
const popover = ref(null)
const selected = ref(false)

function onShow(value: boolean) {
	selected.value = value
}

function onAction() {
	popover.value?.setShow(false)
	selected.value = false
}
</script>

<style lang="scss">
.o-add-node {
	display: flex;
}
</style>
