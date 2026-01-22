/**
 * Side menu plugin
 *
 * Plugin docs: https://prosemirror.net/docs/ref/#state.Plugin_System
 * Plugin state example: https://github.com/remirror/remirror/blob/main/packages/remirror__extension-code-block/src/code-block-plugin.ts
 */

import type { Editor } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import tippy from 'tippy.js'
import type { Instance, Props } from 'tippy.js'

import {
  getNodeElementFromCoords,
  getNodeElementFromPos,
  getNodePosFromCoords,
  getNodePosFromSelection,
} from './utils'

export const SideMenuPluginKey = new PluginKey('sideMenu')

export class SideMenuState {
  public hovered = false
  public coords: { left: number; top: number } = { left: 0, top: 0 }
  public className = ''

  constructor() {}

  public init(state: EditorState) {
    return this
  }

  public apply({ tr, oldState, newState }): this {
    if (!tr.docChanged) {
      return this
    }

    return this
  }

  public setHover(
    hover: boolean,
    coords: { left: number; top: number },
    className = ''
  ) {
    this.hovered = hover
    this.coords = coords
    this.className = className
  }
}

export interface SideMenuPluginProps {
  pluginKey: PluginKey | string
  editor: Editor
  element: HTMLElement
  tippyOptions?: Partial<Props>
  updateDelay?: number
}

export type SideMenuViewProps = SideMenuPluginProps & {
  view: EditorView
}

export class SideMenuView {
  public editor: Editor
  public element: HTMLElement
  public view: EditorView
  public preventHide = false
  public tippy: Instance | undefined
  public tippyOptions?: Partial<Props>
  public updateDelay: number
  private updateDebounceTimer: number | undefined

  constructor({
    editor,
    element,
    view,
    tippyOptions = {},
    updateDelay = 250,
  }: SideMenuViewProps) {
    this.editor = editor
    this.element = element
    this.view = view
    this.updateDelay = updateDelay

    this.view.dom.addEventListener('dragstart', this.onDragStart)
    this.tippyOptions = tippyOptions
    // Detaches menu content from its current parent
    this.element.remove()
    this.element.style.visibility = 'visible'
  }

  mousedownHandler = () => {
    this.preventHide = true
  }

  onDragStart = (e: MouseEvent) => {
    this.hide()
  }

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (
      event?.relatedTarget &&
      this.element.parentNode?.contains(event.relatedTarget as Node)
    ) {
      return
    }

    this.hide()
  }

  tippyBlurHandler = (event: FocusEvent) => {
    this.blurHandler({ event })
  }

  createTooltip() {
    // console.log('createTooltip')
    const { element: editorElement } = this.editor.options
    const el =
      editorElement instanceof Element
        ? editorElement
        : 'mount' in (editorElement as any)
          ? (editorElement as { mount: HTMLElement }).mount
          : null

    const editorIsAttached = !!el?.parentElement

    if (this.tippy || !editorIsAttached) {
      return
    }

    this.tippy = tippy(el!, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: 'manual',
      placement: 'left',
      hideOnClick: 'toggle',
      ...this.tippyOptions,
    })

    // maybe we have to hide tippy on its own blur event as well
    if (this.tippy.popper.firstChild) {
      ;(this.tippy.popper.firstChild as HTMLElement).addEventListener(
        'blur',
        this.tippyBlurHandler
      )
    }
  }

  update(view: EditorView, oldState?: EditorState) {
    const { state } = view
    const selectionChanged = !oldState?.selection.eq(view.state.selection)
    const docChanged = !oldState?.doc.eq(view.state.doc)

    this.updateHandler(view, selectionChanged, docChanged, oldState)
  }

  handleDebouncedUpdate = (view: EditorView, oldState?: EditorState) => {
    const selectionChanged = !oldState?.selection.eq(view.state.selection)
    const docChanged = !oldState?.doc.eq(view.state.doc)

    if (!selectionChanged && !docChanged) {
      return
    }

    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer)
    }

    this.updateDebounceTimer = window.setTimeout(() => {
      this.updateHandler(view, selectionChanged, docChanged, oldState)
    }, this.updateDelay)
  }

  updateHandler = (
    view: EditorView,
    selectionChanged: boolean,
    docChanged: boolean,
    oldState?: EditorState
  ) => {
    const { state, composing } = view
    const { coords } = SideMenuPluginKey.getState(state)
    const nodeElement = getNodeElementFromCoords(coords, view)
    const pos = getNodePosFromCoords(coords, view)
    // console.log('update', coords, pos)
    // console.log('update', nodeElement)

    if (!nodeElement || pos <= 0) {
      return
    }

    this.createTooltip()

    this.tippy?.setProps({
      getReferenceClientRect:
        this.tippyOptions?.getReferenceClientRect ||
        (() => {
          return nodeElement.getBoundingClientRect()
        }),
    })

    this.show()
  }

  show() {
    this.tippy?.show()
  }

  hide() {
    this.tippy?.hide()
  }

  destroy() {
    if (this.tippy?.popper.firstChild) {
      ;(this.tippy.popper.firstChild as HTMLElement).removeEventListener(
        'blur',
        this.tippyBlurHandler
      )
    }
    this.tippy?.destroy()
    this.view.dom.removeEventListener('dragstart', this.onDragStart)
  }
}

const onDragStart = (e: DragEvent, editor: Editor) => {
  if (!e.dataTransfer) return

  const view = editor.view
  const viewBox = view.dom.getBoundingClientRect()
  const coords = {
    left: viewBox.left + viewBox.width / 2, // take middle of editor
    top: e.clientY,
  }

  const pos = getNodePosFromCoords(coords, view)
  if (pos === null) return

  const selection = view.state.selection
  const doc = view.state.doc
  const { from, to } = getNodePosFromSelection(selection, doc)
  const draggedBlockInSelection = from <= pos && pos < to
  // TODO: multiple node selection

  view.dispatch(
    view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
  )
  setDragImage(view, pos)
  const selectedSlice = view.state.selection.content()
  const { dom, text } = view.serializeForClipboard(selectedSlice)

  // console.log('imageElement', pos, dragImageElement)
  e.dataTransfer.clearData()
  e.dataTransfer.setData('text/html', dom.innerHTML)
  e.dataTransfer.setData('text/plain', text) // TODO: markdown
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setDragImage(dragImageElement!, 0, 0)
  view.dragging = { slice: selectedSlice, move: true }
}

const onDragEnd = (e: DragEvent, editor: Editor) => {
  unsetDragImage()
}

let dragImageElement: Element | undefined

function setDragImage(view: EditorView, from: number, to = from) {
  // Parent element is cloned to remove all unselected children without affecting the editor content.
  const parentClone = view.domAtPos(from).node.cloneNode(true) as Element
  const parent = view.domAtPos(from).node as Element

  const getElementIndex = (parentElement: Element, targetElement: Element) =>
    Array.prototype.indexOf.call(parentElement.children, targetElement)
  const getRootElement = (element: Element) => {
    let e = element
    let parent = e.parentElement
    while (parent) {
      if (parent === view.dom) {
        return e
      } else {
        e = parent
        parent = e.parentElement
      }
    }
    return e
  }

  // Selected block
  let firstIndex = -1
  let lastIndex = -1
  if (from === to) {
    firstIndex = getElementIndex(
      parent,
      getRootElement(getNodeElementFromPos(from, view))
    )
    lastIndex = firstIndex
  } else {
    firstIndex = getElementIndex(
      parent,
      // Expects from position to be just before the first selected block.
      getRootElement(getNodeElementFromPos(from + 1, view))
    )
    lastIndex = getElementIndex(
      parent,
      // Expects to position to be just after the last selected block.
      getRootElement(getNodeElementFromPos(to - 1, view))
    )
  }

  // console.log('index', firstIndex, lastIndex)
  for (let i = parent.childElementCount - 1; i >= 0; i--) {
    if (i > firstIndex || i < lastIndex) {
      parentClone.removeChild(parentClone.children[i])
    }
  }

  // dataTransfer.setDragImage(element) only works if element is attached to the DOM.
  unsetDragImage()
  dragImageElement = parentClone

  // TODO: This is hacky, need a better way of assigning classes to the editor so that they can also be applied to the
  //  drag preview.
  const classes = view.dom.className.split(' ')
  const inheritedClasses = classes
    .filter(
      (className) =>
        className !== 'ProseMirror' &&
        className !== 'yiitap-root' &&
        className !== 'yiitap-editor'
    )
    .join(' ')

  dragImageElement.className += ' yiitap-dragging-preview ' + inheritedClasses

  document.body.appendChild(dragImageElement)
}

function unsetDragImage() {
  if (dragImageElement !== undefined) {
    document.body.removeChild(dragImageElement)
    dragImageElement = undefined
  }
}

export class SideMenuPlugin {
  public options: SideMenuPluginProps
  public readonly plugin: Plugin
  public sideMenuView: SideMenuView | undefined

  constructor(options: SideMenuPluginProps) {
    const menuState = new SideMenuState()
    this.options = options
    this.plugin = new Plugin<SideMenuState>({
      key: SideMenuPluginKey,
      props: {
        handleDOMEvents: {
          mouseover(view, event) {
            const coords = {
              left: event.clientX,
              top: event.clientY,
            }
            // console.log('over', coords)

            // This is used for avoiding table events conflict
            // TODO: Find a better way
            const element = getNodeElementFromCoords(coords, view)
            const className = element?.className || ''
            const oldClassName = menuState.className
            if (
              className.indexOf('o-table-wrapper-view') >= 0 &&
              oldClassName.indexOf('o-table-wrapper-view') >= 0
            ) {
              return
            }
            menuState.setHover(true, coords, className)
            view.dispatch(view.state.tr.setMeta(SideMenuPluginKey, menuState))
          },
        },
      },
      state: {
        init(_, state) {
          return menuState.init(state)
        },
        apply(tr, _, oldState, newState) {
          return menuState.apply({ tr, oldState, newState })
        },
      },
      view: (view) => {
        this.sideMenuView = new SideMenuView({ view, ...options })
        return this.sideMenuView
      },
    })
  }

  public dragstart(e: DragEvent) {
    onDragStart(e, this.options.editor)
  }

  public dragend(e: DragEvent) {
    onDragEnd(e, this.options.editor)
  }
}
