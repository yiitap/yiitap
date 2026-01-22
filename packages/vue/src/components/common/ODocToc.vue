<template>
  <section class="o-doc-toc toc" v-if="headings.length">
    <o-popover
      ref="popover"
      tippy-class="o-toc-popover"
      placement="left-start"
      :offset="[0, -50]"
      :delay="0"
      :duration="100"
    >
      <template #trigger>
        <div class="mini-view">
          <ul class="toc__list">
            <template v-for="(heading, index) in headings" :key="index">
              <li
                class="toc__item"
                :class="[
                  selectedHeading === heading.id ? 'selected' : '',
                  `toc__item--${heading.level}`,
                ]"
                v-if="heading.level <= Math.max(Math.min(maxLevel, 3), 2)"
              ></li>
            </template>
          </ul>
        </div>
      </template>

      <div class="main-view o-scroll" style="max-width: 480px">
        <div class="toc__title">{{ tr('label.toc') }}</div>
        <ul class="toc__list">
          <li
            class="toc__item"
            :class="`toc__item--${heading.level}`"
            v-for="(heading, index) in headings"
            :key="index"
          >
            <span
              class="heading"
              :class="{ selected: selectedHeading === heading.id }"
              @click="onClick(heading)"
            >
              {{ heading.text }}
            </span>
          </li>
        </ul>
      </div>
    </o-popover>
  </section>
</template>

<script setup lang="ts">
/**
 * TOC of Yiitap document
 */
defineOptions({ name: 'ODocToc' })

import { ref, watch, type PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { OPopover } from '../../components'
import useI18n from '../../hooks/useI18n'

interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps({
  /**
   * Editor instance
   */
  editor: {
    type: Editor,
  },
  /**
   * The max level of heading should be shown
   */
  maxLevel: {
    type: Number as PropType<2 | 3>,
    default: 3,
  },
})

const emit = defineEmits<{
  /**
   * Emit when content scrolling
   */
  (e: 'docScroll', event: Event): void
}>()

const { tr } = useI18n()
const headings = ref<Heading[]>([])
const selectedHeading = ref('')

function init() {
  selectedHeading.value = window.location.hash
  props.editor?.on('update', onUpdate)

  setTimeout(() => {
    initEditorContainerScroll()
    onUpdate()
  }, 0)
}

/**
 * Listen to the scroll event of editor's container
 *
 * If scroll on editorContainer doesn't work, use exposed onScroll directly.
 * e.g: tocRef.value?.onScroll(event)
 */
function initEditorContainerScroll() {
  const editorElement = document.querySelector('.yiitap')
  const editorContainer = editorElement?.parentElement
  editorContainer?.addEventListener('scroll', onScroll)
}

/**
 * Build heading list
 *
 * It depends on heading block's data-id attribute, which is supported by unique-id extension.
 */
function onUpdate() {
  const list = []
  props.editor?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      const id = node.attrs['id']
      list.push({
        level: node.attrs.level,
        text: node.textContent,
        id,
      })
    }
  })
  headings.value = list
}

/**
 * Find the closest heading when scrolls.
 *
 * @param event
 */
function onScroll(event: Event) {
  for (const heading of headings.value) {
    const element = document.querySelector(`[data-id="${heading.id}"]`)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      selectedHeading.value = heading.id
      break
    }
  }
  emit('docScroll', event)
}

/**
 * Scroll to specific heading.
 * @param heading
 */
function onClick(heading: Indexable) {
  selectedHeading.value = heading.id
  const element = document.querySelector(`[data-id="${heading.id}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(
  () => props.editor,
  (newValue) => {
    init()
  }
)

defineExpose({
  /**
   * Find the closest heading when scrolls.
   *
   * @param event
   */
  onScroll,
  /**
   * Heading list
   */
  headings,
})
</script>

<style lang="scss">
.toc {
  .mini-view {
    border-radius: 4px;
    padding: 15px;
  }

  &__title {
    font-weight: bold;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-inline-start: 0 !important;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
    header {
      display: block;
      font-weight: 700;
      letter-spacing: 0.025rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.5;
      padding-bottom: 4px;
    }
  }
  &__item {
    font-size: 0.8rem;
    padding: 2px 0;
    .heading {
      color: #646a73 !important;

      &:hover {
        color: #1976d2 !important;
        text-decoration: none !important;
        cursor: pointer;
      }

      &.selected {
        color: #1976d2 !important;
      }
    }
    &--2 {
      padding-left: 1rem;
    }
    &--3 {
      padding-left: 2rem;
    }
    &--4 {
      padding-left: 3rem;
    }
    &--5 {
      padding-left: 4rem;
    }
    &--6 {
      padding-left: 5rem;
    }
  }

  .mini-view {
    .toc__item {
      background: var(--yii-caption-color);
      opacity: 0.5;
      display: block;
      height: 3px;
      width: 20px;
      padding: 0;
      margin-bottom: 8px;
      border-radius: 1px;

      &--1 {
        height: 6px;
      }

      &--3 {
        height: 2px;
        width: 14px;
        margin-left: 6px;
      }

      &.selected {
        opacity: 1;
        background: var(--yii-color-accent);
      }
    }
  }
}

.o-toc-popover {
  .popover-content {
    padding: 2px !important;
  }
  .main-view {
    min-width: 240px;
    max-height: 600px;
    padding: 10px;
  }
}
</style>
