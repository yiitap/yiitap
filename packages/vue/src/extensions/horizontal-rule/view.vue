<template>
  <o-node-view v-bind="props" class="o-horizontal-view">
    <div class="horizontal">
      <node-view-content as="div" class="divider" />
    </div>
  </o-node-view>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView } from '../../components'

const props = defineProps(nodeViewProps)
</script>

<style lang="scss">
.o-horizontal-view {
  position: relative;

  .horizontal {
    padding: 12px 0;

    hr {
      margin: 0;
      border-width: 0.5px;
    }

    .divider {
      height: 1px;
      background: var(--yii-divider-bg-color);
    }
  }
}
</style>
