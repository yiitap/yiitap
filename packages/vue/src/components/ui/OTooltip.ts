import { defineComponent, h, onMounted, ref } from 'vue'
import 'tippy.js/animations/perspective.css'

export const OTooltip = defineComponent({
  name: 'OTooltip',

  props: {
    placement: {
      type: String,
      default: 'top',
    },
  },

  setup(props, { expose, slots }) {
    const root = ref<HTMLElement | null>(null)

    let contentSlot = slots.content
    if (!contentSlot) {
      contentSlot = slots.default
    }

    onMounted(() => {
      const defaultSlot = slots?.default()
      const trigger = slots?.trigger()
      console.log('trigger', trigger[0])
      console.log('defaultSlot', defaultSlot[0])

      // tippy(trigger[0] as HTMLElement, {
      // 	animation: 'perspective', // scale, shift-away
      // 	content: defaultSlot[0] as HTMLElement,
      // 	duration: 100,
      // 	interactive: true,
      // 	placement: props.placement,
      // 	trigger: 'click',
      // })
    })

    expose({
      ...props,
    })

    return () => h('div', { ref: root }, slots?.trigger())
  },
})
