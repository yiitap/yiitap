<template>
  <node-view-wrapper
    class="o-table-cell-view"
    as="td"
    v-bind="node.attrs"
    :style="{ background: node.attrs.background }"
  >
    <template v-if="isEditable">
      <o-block-popover
        v-model="showRowPopover"
        placement="left"
        tippy-class="o-row-popover"
        :offset="[16, 40]"
        hide-click-outside
      >
        <section
          class="row-handler"
          :class="{ active: showRowPopover }"
          @click="onClickRowHandler"
        >
          <div class="add">
            <div class="indicator">
              <svg width="3" height="3" viewBox="0 0 3 3" fill="none">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#BBBFC4"></circle>
              </svg>
            </div>
            <o-common-btn
              icon="add_circle"
              :color="Color.blue"
              :tooltip="tr('table.addRow')"
              placement="left"
              @click.stop="runCommand('tableAddRow')"
            />
          </div>
        </section>
        <template #popover-content>
          <o-command-btn
            icon="select_all"
            :tooltip="tr('table.removeColumn')"
            @click="selectRow"
          />
          <o-command-btn
            icon="delete"
            :tooltip="tr('table.removeRow')"
            @click="runCommand('tableDeleteRow')"
          />
        </template>
      </o-block-popover>
    </template>

    <node-view-content />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

import { OBlockPopover, OCommandBtn, OCommonBtn } from '../../components/index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { Color } from '../../constants/color'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { isEditable, run } = useTiptap()

const showRowPopover = ref(false)

function onClickRowHandler() {
  showRowPopover.value = true
}

function selectRow() {
  runCommand('tableSelectRow', {
    pos: props.getPos(),
  })
}

function runCommand(command: string, options: Indexable = {}) {
  if (command === 'tableDeleteRow') {
    showRowPopover.value = false
  }
  setTimeout(() => {
    run(props.editor, command, options)
  }, 0)
}
</script>

<style lang="scss">
.o-table-cell-view {
  position: relative;
}

.o-row-popover {
  min-width: unset !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
