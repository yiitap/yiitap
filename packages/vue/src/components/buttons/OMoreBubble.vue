<template>
  <o-popover
    ref="popover"
    :offset="[4, 10]"
    class="o-simple-command-btn"
    content-class="o-more-bubble-popover"
    placement="top-end"
    size="medium"
    trigger="mouseenter"
  >
    <template #trigger>
      <div class="o-command-btn">
        <o-icon name="more_horiz" />
      </div>
    </template>

    <section class="o-more-bubble">
      <template v-for="(item, index) of MoreBubble" :key="index">
        <o-divider vertical v-if="item === 'separator'" />
        <component
          :name="item"
          :is="getComponent(item)"
          :editor="editor"
          v-else-if="typeof item === 'string'"
        />
      </template>
    </section>
  </o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ODivider, OIcon, OPopover } from '../index'
import { getComponent } from '../menu'
import { MoreBubble } from '../../constants/menu'
import { Editor } from '@tiptap/core'

defineProps({
  editor: {
    type: Editor,
    required: true,
  },
})
const popover = ref<InstanceType<typeof OPopover>>()

function onSelect(value: string) {
  popover.value?.setShow(false)
}
</script>

<style lang="scss">
.o-more-bubble {
  display: flex;
  align-items: center;
  padding: 4px;

  .n-button:not(:first-child) {
    margin-left: 2px;
  }
}

.o-more-bubble-popover {
  padding: 0 !important;
}
</style>
