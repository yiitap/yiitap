/**
 * Side menu utils
 *
 * @author YousefED@BlockNote
 * see https://github.com/TypeCellOS/BlockNote/blob/main/packages/core/src/extensions/SideMenu/SideMenuPlugin.ts
 */
import { Editor } from '@tiptap/core'
import { EditorView } from '@tiptap/pm/view'
import { Node, NodeType } from '@tiptap/pm/model'
import type { Selection } from '@tiptap/pm/state'

export function getNodeElementFromCoords(
	coords: { left: number; top: number },
	view: EditorView
) {
	const pos = view?.posAtCoords(coords)

	if (!pos) {
		return undefined
	}
	// let node = view.domAtPos(pos.pos).node as HTMLElement
	let node = getNodeElementFromPos(pos.pos, view)

	if (node === view.dom) {
		// mouse over root
		return undefined
	}

	// Top Level node
	while (node && node.parentNode && node.parentNode !== view.dom) {
		node = node.parentNode as HTMLElement
	}
	if (!node) {
		return undefined
	}

	return node
}

export function getNodeElementFromPos(pos: number, view: EditorView) {
	const node = view.nodeDOM(pos) || view.domAtPos(pos).node
	return node as HTMLElement
}

export function getNodeViewElementFromPos(pos: number, view: EditorView) {
	let node = view.domAtPos(pos).node
	if ((node as HTMLElement)?.className?.indexOf('view') >= 0) {
		return node as HTMLElement
	}
	while (node?.parentElement) {
		node = node.parentElement as HTMLElement
		if ((node as HTMLElement)?.className?.indexOf('view') >= 0) {
			break
		}
	}

	// console.log('node', node)
	return node as HTMLElement
}

export function getNodePosFromCoords(
	coords: { left: number; top: number },
	view: EditorView
) {
	const node = getNodeElementFromCoords(coords, view)

	if (node && node.nodeType === 1) {
		// TODO: this uses undocumented PM APIs? do we need this / let's add docs?
		const docView = (view as any).docView
		const desc = docView.nearestDesc(node, true)
		if (!desc || desc === docView) {
			return null
		}
		return desc.posBefore
	}
	return null
}

export function getNodePosFromSelection(selection: Selection, doc: Node) {
	// Absolute positions just before the first block spanned by the selection, and just after the last block. Having the
	// selection start and end just before and just after the target blocks ensures no whitespace/line breaks are left
	// behind after dragging & dropping them.
	let beforeFirstBlockPos: number
	let afterLastBlockPos: number

	// Even the user starts dragging blocks but drops them in the same place, the selection will still be moved just
	// before & just after the blocks spanned by the selection, and therefore doesn't need to change if they try to drag
	// the same blocks again. If this happens, the anchor & head move out of the block content node they were originally
	// in. If the anchor should update but the head shouldn't and vice versa, it means the user selection is outside a
	// block content node, which should never happen.
	const selectionStartInBlockContent =
		doc.resolve(selection.from).node().type.spec.group === 'blockContent'
	const selectionEndInBlockContent =
		doc.resolve(selection.to).node().type.spec.group === 'blockContent'

	// Ensures that entire outermost nodes are selected if the selection spans multiple nesting levels.
	const minDepth = Math.min(selection.$anchor.depth, selection.$head.depth)

	if (selectionStartInBlockContent && selectionEndInBlockContent) {
		// Absolute positions at the start of the first block in the selection and at the end of the last block. User
		// selections will always start and end in block content nodes, but we want the start and end positions of their
		// parent block nodes, which is why minDepth - 1 is used.
		const startFirstBlockPos = selection.$from.start(minDepth - 1)
		const endLastBlockPos = selection.$to.end(minDepth - 1)

		// Shifting start and end positions by one moves them just outside the first and last selected blocks.
		beforeFirstBlockPos = doc.resolve(startFirstBlockPos - 1).pos
		afterLastBlockPos = doc.resolve(endLastBlockPos + 1).pos
	} else {
		beforeFirstBlockPos = selection.from
		afterLastBlockPos = selection.to
	}

	return { from: beforeFirstBlockPos, to: afterLastBlockPos }
}

export type BlockInfoWithoutPositions = {
	id: string
	node: Node
	contentNode: Node
	contentType: NodeType
	numChildBlocks: number
}

export type BlockInfo = BlockInfoWithoutPositions & {
	startPos: number
	endPos: number
	depth: number
}

export function getNodeInfo(blockContainer: Node): BlockInfoWithoutPositions {
	const id = blockContainer.attrs['id']
	const contentNode = blockContainer.firstChild!
	const contentType = contentNode.type
	const numChildBlocks =
		blockContainer.childCount === 2 ? blockContainer.lastChild!.childCount : 0

	return {
		id,
		node: blockContainer,
		contentNode,
		contentType,
		numChildBlocks,
	}
}

export function getNodeInfoFromPos(doc: Node, pos: number): BlockInfo {
	// If the position is outside the outer block group, we need to move it to the
	// nearest block. This happens when the collaboration plugin is active, where
	// the selection is placed at the very end of the doc.
	console.log('docabc', doc)
	const outerBlockGroupStartPos = 1
	const outerBlockGroupEndPos = doc.nodeSize - 2
	if (pos <= outerBlockGroupStartPos) {
		pos = outerBlockGroupStartPos + 1

		while (
			doc.resolve(pos).parent.type.name !== 'blockContainer' &&
			pos < outerBlockGroupEndPos
		) {
			pos++
		}
	} else if (pos >= outerBlockGroupEndPos) {
		pos = outerBlockGroupEndPos - 1

		while (
			doc.resolve(pos).parent.type.name !== 'blockContainer' &&
			pos > outerBlockGroupStartPos
		) {
			pos--
		}
	}

	// This gets triggered when a node selection on a block is active, i.e. when
	// you drag and drop a block.
	if (doc.resolve(pos).parent.type.name === 'blockGroup') {
		pos++
	}

	const $pos = doc.resolve(pos)

	const maxDepth = $pos.depth
	let node = $pos.node(maxDepth)
	let depth = maxDepth

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (depth < 0) {
			throw new Error(
				'Could not find blockContainer node. This can only happen if the underlying BlockNote schema has been edited.'
			)
		}

		if (node.type.name === 'blockContainer') {
			break
		}

		depth -= 1
		node = $pos.node(depth)
	}

	const { id, contentNode, contentType, numChildBlocks } = getNodeInfo(node)

	const startPos = $pos.start(depth)
	const endPos = $pos.end(depth)

	return {
		id,
		node,
		contentNode,
		contentType,
		numChildBlocks,
		startPos,
		endPos,
		depth,
	}
}

// Todo: not working
export function getNodeInfoFromCoords(
	editor: Editor,
	view: EditorView,
	coords: { left: number; top: number }
): BlockInfo {
	const pos = getNodePosFromCoords(coords, view)
	return getNodeInfoFromPos(editor.state.doc, pos)
}

export type NodeInfo = {
	node: Node | null
	pos: number
}

export function getNodeFromCoords(
	coords: { left: number; top: number },
	editor: Editor
): NodeInfo {
	const pos = getNodePosFromCoords(coords, editor.view)
	if (pos && pos >= 0) {
		return {
			node: editor.state.doc.nodeAt(pos),
			pos: pos,
		}
	} else {
		return {
			node: null,
			pos: pos,
		}
	}
}
