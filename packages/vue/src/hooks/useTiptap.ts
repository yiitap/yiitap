import { computed, ref, inject } from 'vue'
import type { ChainedCommands, Editor, SingleCommands } from '@tiptap/core'
import type { Level } from '@/extensions/heading'
import { InlinePlaceholderKey } from '@yiitap/extension-inline-placeholder'

export default function () {
  const isEditable = inject('isEditable', { value: true })

  function run(editor: Editor, command: string, options: Indexable = {}) {
    if (!editor.isEditable) return
    const focus = editor?.chain().focus()
    const commands = editor?.commands

    switch (command) {
      case 'inlineMath':
        newInlineMath(editor)
        break
      default:
        onCommand(commands, focus, command, options)
        break
    }
  }

  function onCommand(
    commands: SingleCommands,
    focus: ChainedCommands,
    command: string,
    options: Indexable = {}
  ) {
    console.log('command', command, options)
    switch (command) {
      case 'aiBlock':
        focus.toggleAiBlock().run()
        break
      case 'highlight':
        if (options.color) {
          commands.setHighlight({ color: options.color })
        } else {
          commands.unsetHighlight()
        }
        break
      case 'backgroundColor':
        if (options.color) {
          commands.setBackgroundColor(options.color)
        } else {
          commands.unsetBackgroundColor()
        }
        break
      case 'blockquote':
        focus.toggleBlockquote().run()
        break
      case 'bold':
        focus.toggleBold().run()
        break
      case 'bulletList':
        focus.toggleBulletList().run()
        break
      case 'callout':
        focus.toggleCallout().run()
        // commands.toggleCallout()
        break
      case 'clearFormat':
        focus.unsetAllMarks().run()
        // focus.clearNodes().run()
        break
      case 'code':
        focus.toggleCode().run()
        break
      case 'codeBlock':
        // commands.setCodeBlock({language: 'bash'})
        commands.toggleCodeBlock({ language: 'bash' })
        break
      // case 'columns':
      // 	commands.setColumns(2)
      // 	break
      case 'color':
        focus.setColor(options.color).run()
        break
      case 'copySelected':
        commands.copySelected()
        break
      case 'content':
        commands.insertContent(options.content)
        break
      case 'deleteSelected':
        commands.deleteSelected()
        break
      case 'details':
        if (options.type === 'detailsSummary') {
          commands.unsetDetails()
        } else {
          commands.setDetails()
        }
        break
      case 'duplicateSelected':
        commands.duplicateSelected()
        break
      case 'fontFamily':
        commands.setFontFamily(options.fontFamily)
        break
      case 'heading':
        focus.toggleHeading(options as { level: Level }).run()
        // commands.toggleHeading(options)
        break
      case 'horizontalRule':
        focus.setHorizontalRule().run()
        break
      case 'image':
        focus
          .setImage({
            src: 'init',
          })
          .run()
        break
      case 'imageUpdate':
        focus
          .setImage(
            options as {
              src: string
              alt?: string
              title?: string
            }
          )
          .run()
        break
      case 'inlineMathDelete':
        commands.deleteInlineMath(options)
        break
      case 'inlineMathInsert':
        commands.insertInlineMath(options as any)
        break
      case 'inlineMathUpdate':
        commands.updateInlineMath(options)
        break
      case 'italic':
        focus.toggleItalic().run()
        break
      case 'linkSet':
        focus
          .extendMarkRange('link')
          .setLink(
            options as {
              href: string
              target?: string | null
              rel?: string | null
              class?: string | null
            }
          )
          .run()
        break
      case 'linkUnset':
        focus.extendMarkRange('link').unsetLink().run()
        break
      // case 'modelViewer':
      // 	focus.setModelViewer({
      // 		src: 'init',
      // 	}).run()
      // 	break
      // case 'modelViewerUpdate':
      // 	focus.setModelViewer(options).run()
      // 	break
      case 'orderedList':
        focus.toggleOrderedList().run()
        break
      case 'paragraph':
        focus.setParagraph().run()
        break
      case 'strike':
        focus.toggleStrike().run()
        break
      case 'subscript':
        commands.toggleSubscript()
        break
      case 'superscript':
        commands.toggleSuperscript()
        break
      case 'table':
        focus
          .insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true,
          })
          .run()
        break
      case 'tableAddColumn':
        focus.addColumnAfter().run()
        break
      case 'tableAddRow':
        focus.addRowAfter().run()
        break
      case 'tableCellAttribute':
        focus.setCellAttribute(options.name, options.value).run()
        // commands.setCellAttribute(options)
        break
      case 'tableDeleteColumn':
        focus.deleteColumn().run()
        break
      case 'tableDeleteRow':
        focus.deleteRow().run()
        break
      case 'tableDelete':
        focus.deleteTable().run()
        break
      case 'tableInsert':
        focus.insertTable(options).run()
        break
      case 'tableMergeCells':
        focus.mergeCells().run()
        break
      case 'tableSelectColumn':
        focus.selectColumn(options.pos).run()
        break
      case 'tableSelectRow':
        focus.selectRow(options.pos).run()
        break
      case 'tableSplitCell':
        focus.splitCell().run()
        break
      case 'taskList':
        commands.toggleTaskList()
        break
      case 'textAlign':
        focus.setTextAlign(options.textAlign).run()
        break
      case 'underline':
        focus.toggleUnderline().run()
        break
      case 'video':
        focus
          .setVideo({
            src: 'init',
          })
          .run()
      // 	break
      // case 'videoUpdate':
      // 	focus.setVideo(options).run()
      // 	break
    }
  }

  function newInlineMath(editor: Editor) {
    const { state, view } = editor
    const { from } = state.selection
    const dom = view.domAtPos(from).node as HTMLElement
    const rect = dom.getBoundingClientRect()

    const tr = state.tr
      .setMeta(InlinePlaceholderKey, {
        type: 'show',
        payload: { type: 'math', label: 'New equation', pos: from, rect },
      })
      .setSelection(state.selection)
    view.dispatch(tr)
  }

  return {
    isEditable,

    run,
    onCommand,
  }
}
