/**
 * TaskItem
 */
import TiptapTaskItem from '@tiptap/extension-task-item'

export const TaskItem = TiptapTaskItem.extend({
  // Schema: allow paragraph + block + optional taskList (subtasks)
  content: 'paragraph block* taskList?',

  // Keyboard shortcuts for Tab / Shift+Tab / Enter
  addKeyboardShortcuts() {
    return {
      // Tab → indent current task
      Tab: () => {
        if (!this.editor.can().sinkListItem(this.type)) return false
        return this.editor.commands.sinkListItem(this.type)
      },

      // Shift+Tab → outdent current task
      'Shift-Tab': () => {
        if (!this.editor.can().liftListItem(this.type)) return false
        return this.editor.commands.liftListItem(this.type)
      },

      // Enter → split task or outdent empty line
      Enter: () => {
        const { $from } = this.editor.state.selection
        const paragraph = $from.parent

        // 空段落 → 反缩进
        if (paragraph.textContent.length === 0) {
          if (this.editor.can().liftListItem(this.type)) {
            return this.editor.commands.liftListItem(this.type)
          }
          return false
        }

        // 有内容 → 拆分 taskItem
        if (this.editor.can().splitListItem(this.type)) {
          return this.editor.commands.splitListItem(this.type)
        }

        return false
      },
    }
  },
})
