<template>
	<o-popover
		ref="popover"
		class="o-simple-command-btn"
		placement="bottom-start"
		trigger="click"
	>
		<template #trigger>
			<o-tooltip trigger="hover">
				<template #trigger>
					<div class="o-table-cell-background o-button-group">
						<div class="o-command-btn label" @click.stop="onSelectCurrent">
							<o-icon name="crop_16_9" class="arrow" />
							<div class="indicator" :style="`background: ${color}`"></div>
						</div>
						<div class="o-command-btn">
							<o-icon name="arrow_drop_down" />
						</div>
					</div>
				</template>
				{{ tr('editor.highlightColor') }}
			</o-tooltip>
		</template>

		<o-color-board
			default-color=""
			:default-label="tr('editor.noColor')"
			@select="onSelect"
		/>
	</o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OIcon, OColorBoard, OPopover, OTooltip } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
	editor: {
		type: Object,
	},
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()
const color = ref('#ffec3d')

function onSelectCurrent() {
	onSelect(color.value)
}

function onSelect(value: string) {
	popover.value.setShow(false)
	color.value = value
	run(props.editor as Editor, 'tableCellAttribute', {
		name: 'background',
		value: color.value,
	})
}
</script>

<style lang="scss">
.o-table-cell-background {
	.o-command-btn {
		width: 26px;

		&.label {
			justify-content: center;
			flex-wrap: wrap;
			align-items: center;

			.indicator {
				width: 14px;
				height: 3px;
				margin-top: -8px;
			}
		}
	}
}
</style>
