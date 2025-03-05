import { SideMenuPlugin } from '../../../extensions/side-menu'
import type { SideMenuPluginProps } from '../../../extensions/side-menu'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'

export const SideMenu: ReturnType<typeof defineComponent> = defineComponent({
	name: 'SideMenu',

	props: {
		pluginKey: {
			type: [String, Object] as PropType<SideMenuPluginProps['pluginKey']>,
			default: 'sideMenu',
		},

		editor: {
			type: Object as PropType<SideMenuPluginProps['editor']>,
			required: true,
		},

		updateDelay: {
			type: Number as PropType<SideMenuPluginProps['updateDelay']>,
			default: undefined,
		},

		tippyOptions: {
			type: Object as PropType<SideMenuPluginProps['tippyOptions']>,
			default: () => ({}),
		},
	},

	setup(props, { expose, slots }) {
		const root = ref<HTMLElement | null>(null)
		const plugin = ref()

		const dragstart = (e: DragEvent) => {
			plugin.value?.dragstart(e)
		}
		const dragend = (e: DragEvent) => {
			plugin.value?.dragend(e)
		}

		onMounted(() => {
			const { pluginKey, editor, updateDelay, tippyOptions } = props
			plugin.value = new SideMenuPlugin({
				updateDelay,
				editor,
				element: root.value as HTMLElement,
				pluginKey,
				tippyOptions,
			})

			editor.registerPlugin(plugin.value.plugin)
		})

		onBeforeUnmount(() => {
			const { pluginKey, editor } = props

			editor.unregisterPlugin(pluginKey)
		})

		expose({
			...props,
			dragstart,
			dragend,
		})

		return () => h('div', { ref: root }, slots.default?.())
	},
})
