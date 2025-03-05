<template>
	<main class="yiitap yiitap-editor" :data-theme="darkModeAlt ? 'dark' : ''">
		<!-- Main Menu -->
		<o-main-menu
			v-bind="mainMenuOptions"
			class="desktop-only"
			v-if="showMainMenu"
		>
			<template #left>
				<slot name="toolbar-left" />
			</template>
			<template #right>
				<slot name="toolbar-right" />
			</template>
		</o-main-menu>

		<!-- Bubble/Floating Menu -->
		<o-bubble-menu
			v-bind="bubbleMenuOptions"
			v-if="editor?.isEditable && showBubbleMenu"
		/>
		<o-floating-menu
			v-bind="floatingMenuOptions"
			v-if="editor?.isEditable && showFloatingMenu"
		/>
		<o-side-menu
			v-bind="sideMenuOptions"
			v-if="editor?.isEditable && showSideMenu"
		/>

		<!-- Editor Content -->
		<editor-content class="editor-content" :class="pageView" :editor="editor" />
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, provide, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'

import OMainMenu from './menus/OMainMenu.vue'
import OBubbleMenu from './menus/OBubbleMenu.vue'
import OFloatingMenu from './menus/OFloatingMenu.vue'
import OSideMenu from './menus/OSideMenu.vue'

import useI18n from '../hooks/useI18n'
import {
	DefaultExtensions,
	OPlaceholder,
	BuiltinExtensions,
} from '../extensions'
import DynamicClass, { TableExtensions } from '../extensions/dynamic'

const props = defineProps({
	content: {
		type: [String, Object],
		default: '',
	},
	editable: {
		type: Boolean,
		default: true,
	},
	locale: {
		type: String,
		default: 'en',
	},
	darkMode: {
		type: Boolean,
		default: false,
	},
	showMainMenu: {
		type: Boolean,
		default: false,
	},
	showBubbleMenu: {
		type: Boolean,
		default: false,
	},
	showFloatingMenu: {
		type: Boolean,
		default: false,
	},
	showSideMenu: {
		type: Boolean,
		default: false,
	},
	showSideNode: {
		type: Boolean,
		default: false,
	},
	showContent: {
		type: Boolean,
		default: true,
	},
	showGuide: {
		type: Boolean,
		default: false,
	},
	scrollable: {
		type: Boolean,
		default: false,
	},
	editorProps: {
		type: Object,
		default: function () {
			return {}
		},
	},
	extensions: {
		type: Array as () => string[],
		default: function () {
			return []
		},
	},
	mainMenu: {
		type: Array,
		default: function () {
			return []
		},
	},
	tableMenu: {
		type: Array,
		default: function () {
			return []
		},
	},
	bubbleMenu: {
		type: Array,
		default: function () {
			return []
		},
	},
	floatingMenu: {
		type: Array,
		default: function () {
			return []
		},
	},
	pageView: {
		type: String,
		default: 'page',
	},
	options: {
		type: Object,
		default: function () {
			return {}
		},
	},
})
const emit = defineEmits(['transaction', 'update'])

const { tr } = useI18n()
const darkModeAlt = ref(false)
const localeAlt = ref('en')
const sideNodeAlt = ref(false)
provide('darkMode', darkModeAlt)
provide('locale', localeAlt)
provide('sideNode', sideNodeAlt)

const customExtensions = computed(() => {
	return buildExtensions()
})

const editor = useEditor({
	editable: props.editable,
	content: props.content,
	extensions: customExtensions.value,
	onUpdate: () => {
		const json = editor.value?.getJSON()
		const html = editor.value?.getHTML()
		emit('update', { json, html })
	},
	onTransaction: ({ editor, transaction }) => {
		emit('transaction', { editor, transaction })
	},
})

const mainMenuOptions = computed(() => {
	return {
		editor: editor.value,
		menu: props.mainMenu,
	}
})

const bubbleMenuOptions = computed(() => {
	return {
		editor: editor.value,
		menu: props.bubbleMenu,
	}
})

const floatingMenuOptions = computed(() => {
	return {
		editor: editor.value,
		menu: props.floatingMenu,
	}
})

const sideMenuOptions = computed(() => {
	return {
		editor: editor.value,
		menu: [],
	}
})

function buildExtensions() {
	const extensions = []

	// default
	extensions.push(
		OPlaceholder.configure({
			placeholder: ({ editor, node, pos }) => {
				if (node.type.name === 'heading') {
					const level = node.attrs.level
					return pos > 0 ? `H${level}` : tr('label.untitled')
				} else if (node.type.name === 'paragraph') {
					return tr('label.typeForCommands')
				} else {
					return ''
				}
			},
		})
	)
	extensions.push(TextStyle)
	extensions.push(
		StarterKit.configure({
			blockquote: props.extensions.includes('OBlockquote') ? false : {},
			codeBlock: false,
			heading: props.extensions.includes('OHeading')
				? false
				: {
						levels: [1, 2, 3, 4, 5],
				  },
			paragraph: props.extensions.includes('OParagraph') ? false : {},
			dropcursor: {
				width: 5,
				color: 'skyblue',
				class: 'yiitap-dropcursor',
			},
			horizontalRule: false,
		})
	)

	// user custom extension
	console.log('default', DefaultExtensions)
	const list = DefaultExtensions.concat(props.extensions)
	for (const item of list) {
		if (typeof item === 'string') {
			// builtin extension
			if (!BuiltinExtensions.includes(item)) {
				continue
			}

			switch (item) {
				case 'Table':
					extensions.push(...TableExtensions)
					break
				default:
					try {
						const extension = new DynamicClass(item)
						extensions.push(extension)
						console.log('dynamic extension', item, extension)
					} catch (e) {
						console.error(e.message)
					}
					break
			}
		} else {
			// user provide extension
			extensions.push(item)
		}
	}
	return extensions
}

watch(
	() => props.darkMode,
	(newValue) => {
		darkModeAlt.value = newValue
	}
)

watch(
	() => props.locale,
	(newValue) => {
		localeAlt.value = newValue
	}
)

watch(
	() => props.editable,
	(newValue) => {
		editor.value?.setEditable(newValue)
	}
)

onBeforeMount(() => {
	darkModeAlt.value = props.darkMode
	localeAlt.value = props.locale
	sideNodeAlt.value = !props.showSideMenu && props.showSideNode
})

defineExpose({
	editor,
	darkModeAlt,
	localeAlt,
})
</script>

<style lang="scss">
@import '../style/app.scss';
@import '../style/tippy.scss';
@import '../style/tiptap.scss';
@import '../style/variables';
@import '../../../icon/dist/yiitip-icon.css';
</style>
