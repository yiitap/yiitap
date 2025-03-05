<template>
	<div class="o-align-group">
		<o-menubar-btn
			v-for="(item, index) in alignments"
			:key="index"
			:icon="item.icon"
			:tooltip="item.label"
			:content-class="{
				'is-active': editor?.isActive({ textAlign: item.value }),
			}"
			@click="onClick(item)"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OMenubarBtn from '../common/OMenubarBtn.vue'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { Editor } from '@tiptap/core'

const props = defineProps({
	editor: {
		type: Editor,
	},
})

const { tr } = useI18n()
const { run } = useTiptap()

const alignments = computed(() => {
	return [
		{ label: tr('editor.left'), value: 'left', icon: 'format_align_left' },
		{
			label: tr('editor.center'),
			value: 'center',
			icon: 'format_align_center',
		},
		{ label: tr('editor.right'), value: 'right', icon: 'format_align_right' },
	]
})

function onClick(item: Indexable) {
	run(props.editor, 'textAlign', {
		textAlign: item.value,
	})
}
</script>

<style lang="scss">
.o-align-group {
	display: flex;
}
</style>
