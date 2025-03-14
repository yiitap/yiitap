<template>
  <o-popover ref="popover" placement="bottom-center" trigger="hover" arrow>
    <template #trigger>
      <o-command-btn icon="palette" :tooltip="tr('editor.textColor')">
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-callout-color-board
      :fore-color="foreColor"
      :back-color="backColor"
      :default-label="tr('editor.defaultColor')"
      :active-color="editor?.getAttributes('textStyle').color"
      @select="onSelect"
    />
  </o-popover>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { OCalloutColorBoard, OCommandBtn, OIcon, OPopover } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Object,
  },
})
const emit = defineEmits(['select'])
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref(null)
const foreColor = ref('')
const backColor = ref('')

function onSelect(command: string, value: string) {
  if (command === 'foreColor') {
    foreColor.value = value
    localStorage.setItem('yiitap.text-color.fore', value)
  } else if (command === 'backColor') {
    backColor.value = value
    localStorage.setItem('yiitap.text-color.back', value)
  }

  // popover.value.setShow(false)
  emit('select', command, value)
}

onMounted(() => {
  foreColor.value = localStorage.getItem('yiitap.text-color.fore') || ''
  backColor.value = localStorage.getItem('yiitap.text-color.back') || ''
})
</script>

<style lang="scss">
.o-text-color-dropdown {
  &:hover {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.05);
  }

  .o-command-btn {
    width: 26px;

    &.label {
      .n-button__content {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
