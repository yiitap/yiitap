<template>
	<section class="o-colon-view">
		<o-emoji-select :items="items" @select="onSelect" />
	</section>
</template>

<script lang="ts">
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import { OEmojiSelect } from '../../../components'
import { Editor } from '@tiptap/core'

export default {
	props: {
		items: {
			type: Array as () => Indexable[],
			required: true,
		},
		command: {
			type: Function,
			required: true,
		},
		editor: {
			type: Object,
		},
		range: {
			type: Object,
		},
	},
	setup() {
		const { locale, tr } = useI18n()
		const { run } = useTiptap()

		return {
			locale,
			tr,
			run,
		}
	},
	data() {
		return {
			view: 'main',
		}
	},
	components: {
		OEmojiSelect,
	},
	methods: {
		onSelect(options: Indexable) {
			const commands = this.editor.commands
			commands.deleteRange(this.range)
			this.editor.commands.insertContent(options.emoji)
			this.editor.chain().focus()
		},
    onKeyDown({ event }) {
      return false
    },
	},
}
</script>

<style lang="scss">
.o-colon-view {
	//width: 420px;
}

.emoji-tippy {
	background: #fff;
	border-radius: 8px;
	box-shadow:
		0 1px 8px rgba(0, 0, 0, 0.2),
		0 3px 4px rgba(0, 0, 0, 0.14),
		0 3px 3px -2px rgba(0, 0, 0, 0.12);

	.tippy-box {
		max-width: 500px !important;
	}

	.tippy-content {
		padding: 8px;
	}
}
</style>
