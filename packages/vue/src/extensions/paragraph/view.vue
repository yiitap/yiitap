<template>
  <o-node-view v-bind="props" class="o-paragraph-view">
    <node-view-content as="p" :style="`text-align: ${node.attrs.textAlign}`" />
  </o-node-view>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView } from '../../components'

const props = defineProps(nodeViewProps)
</script>

<style lang="scss">
.o-paragraph-view {
  position: relative;

  .o-side-node {
    top: 2px;
  }
}

.o-paragraph-view:has(.o-block-placeholder) {
  p {
    margin: 0;
  }
}
</style>
