<template>
  <o-common-btn
    content-class="o-ai-btn"
    icon="auto_awesome"
    :color="Color.purple"
    :tooltip="tr('ai.askAi')"
  >
  </o-common-btn>
</template>

<script setup lang="ts">
import OCommonBtn from '../common/OCommonBtn.vue'
import { Color } from '../../constants'
import useI18n from '../../hooks/useI18n'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  editor: {
    type: Object,
  },
})
const { tr } = useI18n()
</script>

<style lang="scss">
.o-ai-btn {
  width: unset !important;
  padding: 0 8px !important;

  span.label {
    margin-left: 4px;
    //white-space: nowrap;
  }
}
</style>
