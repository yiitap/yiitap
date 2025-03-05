<template>
	<div class="o-block-toolbar">
		<section class="button-group">
			<slot></slot>
			<o-popover
				ref="popover"
				placement="bottom-end"
				size="medium"
				trigger="click"
				:show-arrow="false"
			>
				<template #trigger>
					<o-command-btn icon="more_horiz" :tooltip="tr('label.more')">
					</o-command-btn>
				</template>
				<o-block-menu v-bind="props" @action="onAction" />
			</o-popover>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import useI18n from '../../hooks/useI18n'
import { OBlockMenu, OCommandBtn, OPopover } from '../../components/index'

const props = defineProps({
	...nodeViewProps,
	type: {
		type: String,
		default: 'link',
	},
})
const emit = defineEmits(['action'])
const { locale, tr } = useI18n()
const popover = ref<InstanceType<typeof OPopover>>()

function onSettings() {
	console.log('hoho')
}

function onAction(item: Indexable) {
	emit('action', item)
	popover.value?.setShow(false)
}
</script>

<style lang="scss">
.o-block-toolbar {
	background: rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	visibility: hidden;

	.button-group {
		display: flex;

		.o-popover:first-child,
		.o-tooltip:first-child {
			.o-command-btn {
				border-radius: 3px 0 0 3px;
			}
		}

		.o-popover:last-child {
			.o-command-btn {
				border-radius: 0 3px 3px 0;
			}
		}
	}

	.o-command-btn {
		&:hover {
			background: rgba(255, 255, 255, 0.2);
		}

		.o-icon {
			color: #ffffff;
		}
	}
}
</style>
