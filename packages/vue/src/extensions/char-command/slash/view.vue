<template>
  <section
    class="o-slash-view o-shadow-3 o-menu o-scroll"
    :class="`view-${view}`"
  >
    <section class="view-main" v-if="view === 'main'">
      <o-list hoverable clickable>
        <template v-if="items.length">
          <template v-for="(item, index) in items" :key="index">
            <template v-if="item.group">
              <o-divider v-if="index > 0" />
              <div class="group o-tips">{{ tr(item.group) }}</div>
            </template>
            <o-list-item
              class="item"
              :class="{ 'is-active': index === selectedIndex }"
              clickable
              @click="onClick(item)"
            >
              <template #prefix>
                <o-icon :name="item.icon" :color="item.color" />
              </template>
              <template #suffix>
                <span class="o-tips">
                  {{ item.tips }}
                </span>
              </template>

              {{ tr(item.label) }}
            </o-list-item>
          </template>
        </template>
        <div class="item" v-else>No result</div>
      </o-list>
    </section>
    <section class="view-emoji" v-else-if="view === 'emoji'">
      <!--      <o-emoji-select @set="setEmoji" />-->
    </section>
    <section class="view-emoji" v-else-if="view === 'ai'">
      <!--      <o-ai-generator :editor="editor" :range="range" />-->
    </section>
  </section>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { Editor, type Range } from '@tiptap/core'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import { ODivider, OIcon, OList, OListItem } from '../../../components/index'
import { BasicBlocks } from '../../../constants/block'

export default {
  props: {
    items: {
      type: Array as () => Indexable[],
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
    editor: {
      type: Editor,
    },
    range: {
      type: Object as PropType<Range>,
    },
  },
  setup() {
    const { locale, tr } = useI18n()
    const { onCommand, run } = useTiptap()

    return {
      locale,
      tr,
      onCommand,
      run,
    }
  },
  data() {
    return {
      view: 'main',
      selectedIndex: 0,
    }
  },
  components: {
    ODivider,
    OIcon,
    OList,
    OListItem,
  },
  watch: {
    items() {
      this.selectedIndex = 0
    },
  },
  methods: {
    onClick(item: Indexable) {
      switch (item.value) {
        default:
          this.runCommand(item)
          break
      }
      return true
    },
    runCommand(item: Indexable) {
      const focus = this.editor.chain().focus().deleteRange(this.range)
      const commands = this.editor.commands
      switch (item.value) {
        case 'blockMath':
          commands.deleteRange(this.range)
          this.editor.commands.insertBlockMath({ latex: '' })
          break
        case 'codeBlock':
          commands.deleteRange(this.range)
          this.editor.commands.setCodeBlock({ language: 'bash' })
          break
        case 'content':
          commands.deleteRange(this.range)
          this.editor.commands.insertContent(item.options.content)
          break
        case 'emoji':
          commands.deleteRange(this.range)
          this.editor.commands.insertContent(':')
          break
        case 'inlineMath':
          commands.deleteRange(this.range)
          this.run(this.editor, 'inlineMath')
          // this.onInlineMath()
          break
        case 'taskList':
          commands.deleteRange(this.range)
          this.editor.commands.toggleTaskList()
          break
        default:
          this.onCommand(commands, focus, item.value, item.options)
          break
      }
    },
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }
      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
      return false
    },
    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },
    enterHandler() {
      this.selectItem(this.selectedIndex)
    },
    selectItem(index: number) {
      const item = this.items[index]
      if (item) {
        this.onClick(item)
      }
    },
    setEmoji(emoji: string) {
      this.onClick({ value: 'content', options: { content: emoji } })
    },
  },
  computed: {
    basicBlocks() {
      return BasicBlocks.slice(1)
    },
  },
  mounted() {
    this.selectedIndex = 0
  },
}
</script>

<style lang="scss">
.o-slash-view {
  border-radius: 8px;
  width: 256px;
  background: var(--yii-bg-color);
  color: var(--yii-color);
  font-size: 0.9rem;

  .panel {
    .o-tooltip {
      display: inline-block;
      width: 40px;
      height: 40px;
      padding: 0;

      .o-menubar-btn {
        width: 40px;
        height: 40px;
      }
    }
  }

  .group {
    font-size: 12px;
    padding: 4px 0;
  }

  .item {
    //display: block;
    min-height: 40px !important;
    text-align: left;
    background: transparent;
    border-radius: 3px;
    padding: 4px 8px;

    &.is-selected {
      border-color: #000;
    }
  }

  .view-emoji {
    header {
      padding: 4px 12px;
      height: unset;
    }
  }
}

.slash-tippy {
  .tippy-content {
    border-radius: 8px;
    background: red;
  }
}
</style>
