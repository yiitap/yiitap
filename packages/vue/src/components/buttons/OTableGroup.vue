<template>
  <section class="o-table-group">
    <o-menubar-btn
      icon="cell_merge"
      :tooltip="tr('table.merge')"
      @click="run(editor, 'tableMergeCells')"
      v-if="editor?.can().mergeCells()"
    />
    <o-menubar-btn
      icon="splitscreen_left"
      :tooltip="tr('table.split')"
      @click="run(editor, 'tableSplitCell')"
      v-if="editor?.can().splitCell()"
    />
    <o-table-cell-background :editor="editor" />
  </section>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { OMenubarBtn, OTableCellBackground } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
})

const { tr } = useI18n()
const { run } = useTiptap()
</script>

<style lang="scss">
.o-table-group {
  display: flex;
}
</style>
