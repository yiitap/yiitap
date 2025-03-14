import { getMarkRange } from '@tiptap/core'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'

export function clickSelectHandler(options: any) {
  return new Plugin({
    key: new PluginKey('handleClickSelectLink'),
    props: {
      handleClick: (view, pos, event) => {
        const { schema, doc, tr } = view.state
        const range = getMarkRange(doc.resolve(pos), schema.marks.link)

        if (!range) return false

        const $start = doc.resolve(range.from)
        const $end = doc.resolve(range.to)
        const transaction = tr.setSelection(new TextSelection($start, $end))
        view.dispatch(transaction)

        return true
      },
    },
  })
}
