<template>
  <o-menubar-btn
    icon="open_in_new"
    :tooltip="tr('link.open')"
    content-class="o-link-open-btn"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import OMenubarBtn from '../common/OMenubarBtn.vue'
import useI18n from '../../hooks/useI18n'

const props = defineProps({
  editor: {
    type: Object,
  },
})
const { tr } = useI18n()

function onClick() {
  const link = props.editor?.getAttributes('link')
  if (link?.href) {
    window.open(link.href, 'target')
  }
}
</script>

<style lang="scss">
.o-link-open-btn {
}
</style>
