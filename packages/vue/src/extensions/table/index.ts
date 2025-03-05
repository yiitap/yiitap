/**
 * Table
 *
 * example: https://github.com/ueberdosis/tiptap/blob/main/demos/src/Examples/Tables/Vue/index.vue
 * select column/row: https://github.com/ueberdosis/tiptap/discussions/2065
 */
import { default as TiptapTable, createTable } from '@tiptap/extension-table'
import type { TableOptions } from '@tiptap/extension-table'
import { TextSelection } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import { TableView } from './TableView.js'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		extendTable: {
			selectRow: (pos: number) => ReturnType
			selectColumn: (pos: number) => ReturnType
		}
	}
}

const Table = TiptapTable.extend<TableOptions>({
	addOptions() {
		return {
			HTMLAttributes: {},
			resizable: true,
			handleWidth: 5,
			cellMinWidth: 25,
			View: TableView,
			lastColumnResizable: true,
			allowTableNodeSelection: false,
		}
	},

	addCommands() {
		return {
			...this.parent?.(),
			insertTable:
				({ rows, cols, withHeaderRow }) =>
				({ editor, commands, tr, dispatch }) => {
					const node = createTable(editor.schema, rows, cols, withHeaderRow)

					if (dispatch) {
						const offset = tr.selection.anchor + 1
						commands.insertContent({
							type: 'table-wrapper',
							content: [node.toJSON()],
						})

						tr.scrollIntoView().setSelection(
							TextSelection.near(tr.doc.resolve(offset))
						)
					}

					return true
				},
			deleteTable:
				() =>
				({ state, dispatch }) => {
					const $pos = state.selection.$anchor
					for (let d = $pos.depth; d > 0; d--) {
						const node = $pos.node(d)
						if (node.type.name === 'table-wrapper') {
							if (dispatch) {
								dispatch(
									state.tr
										.delete($pos.before(d), $pos.after(d))
										.scrollIntoView()
								)
							}
							return true
						}
					}
					return false
				},
			selectRow:
				(cell) =>
				({ tr: transaction, dispatch }) => {
					if (dispatch) {
						const position = transaction.doc.resolve(cell)
						const rowSelection = CellSelection.rowSelection(position)
						transaction.setSelection(rowSelection)
					}
					return true
				},
			selectColumn:
				(cell) =>
				({ tr: transaction, dispatch }) => {
					if (dispatch) {
						const position = transaction.doc.resolve(cell)
						const colSelection = CellSelection.colSelection(position)
						transaction.setSelection(colSelection)
					}
					return true
				},
		}
	},
})

export default Table
