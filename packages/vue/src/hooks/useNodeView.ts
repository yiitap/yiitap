import { computed, ref, inject } from 'vue'
import type { NodeViewProps } from '@tiptap/vue-3'

export default function () {
  const nodeViewProps = ref<NodeViewProps>()
  const isFocused = ref(false)

  function bind(props: any) {
    nodeViewProps.value = props
    props.editor.on('selectionUpdate', checkFocus)
    // props.editor.on('focus', checkFocus)
    // props.editor.on('blur', checkFocus)
  }

  function unbind() {
    nodeViewProps.value?.editor.off('selectionUpdate', checkFocus)
    // nodeViewProps.value?.editor.off('focus', checkFocus)
    // nodeViewProps.value?.editor.off('blur', checkFocus)
  }

  const nodeRange = computed(() => {
    const pos = nodeViewProps.value?.getPos()
    return {
      start: pos,
      end: pos + nodeViewProps.value?.node.nodeSize,
    }
  })

  const checkFocus = () => {
    const selection = nodeViewProps.value?.editor.state.selection
    const inNode =
      selection?.$from.pos >= nodeRange.value.start &&
      selection?.$to.pos <= nodeRange.value.end

    isFocused.value = inNode && nodeViewProps.value?.editor.isFocused
  }

  return {
    isFocused,

    bind,
    unbind,
  }
}
