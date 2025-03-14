<template>
  <o-node-view v-bind="props" class="o-blockquote-view">
    <blockquote>
      <node-view-content />
    </blockquote>
  </o-node-view>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView } from '../../components'

const props = defineProps(nodeViewProps)
</script>

<style lang="scss">
.o-blockquote-view {
}
</style>
