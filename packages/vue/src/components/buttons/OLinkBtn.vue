<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    placement="bottom"
    trigger="click"
    arrow
    v-model:show="showPopover"
    @update:show="onShow"
  >
    <template #trigger>
      <o-command-btn
        icon="link"
        :content-class="{ 'is-active': editor?.isActive('link') }"
        :tooltip="tr('editor.hyperlink')"
      >
      </o-command-btn>
    </template>

    <o-meta-input
      :title="tr('editor.hyperlink')"
      :val="href"
      icon="link"
      @cancel="onCancel"
      @confirm="onConfirm"
      v-if="showPopover"
    >
      <template #header-right>
        <o-checkbox
          v-model="openInNewTab"
          :label="tr('link.open_in_new_tab')"
        />
      </template>
    </o-meta-input>
  </o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OCommandBtn, OCheckbox, OMetaInput, OPopover } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Editor,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()
const showPopover = ref(false)
const href = ref('')
const openInNewTab = ref(true)

function onShow() {
  href.value = ''
  openInNewTab.value = true

  const linkOptions = props.editor?.getAttributes('link')
  if (linkOptions?.href) {
    href.value = linkOptions.href
    openInNewTab.value = linkOptions.target === '_blank'
    console.log('show', showPopover.value, linkOptions, openInNewTab.value)
  }
}

function onCancel() {
  popover.value?.setShow(false)
}

function onConfirm(value: string) {
  if (value) {
    run(props.editor as Editor, 'linkSet', {
      href: value,
      target: openInNewTab.value ? '_blank' : '',
    })
  } else {
    run(props.editor, 'linkUnset')
  }
  popover.value?.setShow(false)
}
</script>

<style lang="scss">
.o-link-btn {
}
</style>
