<template>
	<o-popover
		ref="popover"
		class="o-simple-command-btn"
		placement="bottom"
		trigger="click"
		arrow
	>
		<template #trigger>
			<o-command-btn
				icon="window"
				content-class="o-table-btn"
				:tooltip="tr('table.insert')"
			>
			</o-command-btn>
		</template>

		<o-table-grid @select="onSelect" />
	</o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OCommandBtn, OPopover, OTableGrid } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
	editor: {
		type: Object,
	},
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref(null)

function onSelect(options: Indexable) {
	popover.value?.setShow(false)
	run(props.editor as Editor, 'tableInsert', options)
}
</script>

<style lang="scss">
.o-table-btn {
}
</style>
