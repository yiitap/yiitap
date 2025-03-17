<template>
  <node-view-wrapper
    class="o-table-header-view"
    as="th"
    v-bind="node.attrs"
    :style="{ background: node.attrs.background }"
  >
    <template v-if="isEditable">
      <o-block-popover
        v-model="showColPopover"
        placement="top"
        tippy-class="o-column-popover"
        :offset="[0, 20]"
        hide-click-outside
      >
        <section
          class="col-handler"
          :class="{ active: showColPopover }"
          @click="onClickColHandler"
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
              :tooltip="tr('table.addColumn')"
              @click.stop="runCommand('tableAddColumn')"
            />
          </div>
        </section>
        <template #popover-content>
          <o-command-btn
            icon="select_all"
            :tooltip="tr('table.selectColumn')"
            @click="selectColumn"
          />
          <o-command-btn
            icon="delete"
            :tooltip="tr('table.removeColumn')"
            @click="runCommand('tableDeleteColumn')"
          />
        </template>
      </o-block-popover>

      <o-block-popover
        v-model="showRowPopover"
        placement="left-start"
        tippy-class="o-row-popover"
        :offset="[-6, 26]"
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
            placement="left"
            :tooltip="tr('table.selectRow')"
            @click="selectRow"
          />
          <o-command-btn
            icon="delete"
            placement="left"
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

const showColPopover = ref(false)
const showRowPopover = ref(false)

function onClickColHandler() {
  setTimeout(() => {
    showColPopover.value = true
  }, 0)
}

function onClickRowHandler() {
  showRowPopover.value = true
}

function selectColumn() {
  showColPopover.value = false
  runCommand('tableSelectColumn', {
    pos: props.getPos(),
  })
}

function selectRow() {
  runCommand('tableSelectRow', {
    pos: props.getPos(),
  })
}

function runCommand(command: string, options: Indexable = {}) {
  if (command === 'tableDeleteRow') {
    showRowPopover.value = false
  } else if (command === 'tableDeleteColumn') {
    showColPopover.value = false
  }
  setTimeout(() => {
    run(props.editor, command, options)
  }, 0)
}
</script>

<style lang="scss">
.o-table-header-view {
  position: relative;
  padding-top: 20px;
  z-index: 0;
}

.o-column-popover {
  .popover-content {
    min-width: unset !important;
    display: flex;
    justify-content: center;
  }
}

.o-row-popover {
  min-width: unset !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
