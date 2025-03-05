<template>
	<o-popover
		ref="popover"
		class="o-simple-command-btn"
		size="medium"
		trigger="click"
		:show-arrow="false"
	>
		<template #trigger>
			<o-tooltip trigger="hover">
				<template #trigger>
					<div class="o-back-color-dropdown o-button-group">
						<o-btn
							icon="ink_highlighter"
							class="o-command-btn label"
							@click.stop="onSelectCurrent"
						>
							<div class="indicator" :style="`background: ${color}`"></div>
						</o-btn>
						<o-btn icon="arrow_drop_down" class="o-command-btn" />
					</div>
				</template>
				{{ tr('editor.highlightColor') }}
			</o-tooltip>
		</template>

		<o-color-board
			default-color=""
			:default-label="tr('editor.noColor')"
			:active-color="editor?.getAttributes('highlight').color"
			@select="onSelect"
		/>
	</o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OBtn, OColorBoard, OPopover, OTooltip } from '../index'

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
const color = ref('#ffec3d')

function onSelectCurrent() {
	onSelect(color.value)
}

function onSelect(value: string) {
	popover.value.setShow(false)
	color.value = value
	run(props.editor as Editor, 'backColor', {
		color: value,
	})
}
</script>

<style lang="scss">
.o-back-color-dropdown {
	display: flex;

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
