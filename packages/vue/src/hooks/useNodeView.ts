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
    if (typeof pos !== 'number') return null
    const node = nodeViewProps.value.editor.state.doc.nodeAt(pos)
    if (!node) return null

    return {
      start: pos + 1,
      end: pos + node.nodeSize - 1,
    }
  })

  const checkFocus = () => {
    if (!nodeViewProps.value) return;

    const { editor } = nodeViewProps.value
    if (!editor.isFocused) {
      isFocused.value = false
      return
    }

    const { selection } = editor.state
    if (!selection) return

    isFocused.value = selection?.$from.pos >= nodeRange.value.start &&
      selection?.$to.pos <= nodeRange.value.end
  }

  return {
    isFocused,

    bind,
    unbind,
    checkFocus,
  }
}
