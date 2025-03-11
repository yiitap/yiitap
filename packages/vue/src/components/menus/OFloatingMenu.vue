<template>
	<section class="o-floating-menu" v-if="editor">
		<floating-menu
			class="floating-menu"
			:class="menuClass"
			:editor="editor"
			:tippy-options="options"
		>
			<section class="container">
				<template v-if="showBack">
					<o-menubar-btn icon="arrow_back" @click="onBackToMain" />
				</template>

				<template v-for="(item, index) of dynamicMenu" :key="index">
					<o-divider vertical v-if="item === 'separator'" />
					<component
						:name="item"
						:is="getComponent(item)"
						:editor="editor"
						v-else-if="typeof item === 'string'"
					/>
					<component :is="item" :editor="editor" v-else />
				</template>
			</section>
		</floating-menu>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMarkRange, isTextSelection } from '@tiptap/core'
import { Editor, FloatingMenu } from '@tiptap/vue-3'
import { getComponent } from '../menu'
import { DefaultFloating } from '../../constants/menu'
import { ODivider, OMenubarBtn } from '../index'

const props = defineProps({
	editor: {
		type: Editor,
	},
	menu: {
		type: Array,
		default: function () {
			return []
		},
	},
	tableToolbar: {
		type: Array,
		default: function () {
			return []
		},
	},
	menuClass: {
		type: String,
		default: ``,
	},
})

const backToMain = ref(false)

// @ts-ignore
const options = ref({
	arrow: false,
	duration: 100,
	role: 'popover',
	placement: 'right' as 'left' | 'right',
	offset: [0, 168] as [number, number],
}) // mobile

function onBackToMain() {
	backToMain.value = true
}

function isLinkSelection(selection) {
	const { schema } = props.editor
	const linkType = schema.marks.link
	if (!linkType) return false
	if (!selection) return false

	const { $from, $to } = selection
	const range = getMarkRange($from, linkType)
	if (!range) return false
	return true
	// return range.to === $to.pos
}

function shouldShow({ editor, view, state, oldState, from, to }) {
	const { doc, selection } = state
	const { empty } = selection
	const isEmptyTextBlock =
		!doc.textBetween(from, to).length && isTextSelection(state.selection)

	if (!view.hasFocus() || empty) {
		return false
	}

	return true
}

const isLinkSelected = computed(() => {
	if (props.editor) {
		const { state } = props.editor
		const { tr } = state
		const { selection } = tr

		return isLinkSelection(selection)
	} else {
		return false
	}
})

const showBack = computed(() => {
	return !backToMain.value && isLinkSelected.value
})

const dynamicMenu = computed(() => {
	let menu = props.menu
	return menu.length > 0 ? menu : DefaultFloating
})
</script>

<style lang="scss">
.o-floating-menu {
}
</style>
