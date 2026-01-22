<template>
  <node-view-wrapper class="o-node-view" :data-id="node.attrs['id']">
    <o-side-node
      v-bind="props"
      @action="emit('action')"
      v-if="enableSideNode && editor?.isEditable"
    />
    <slot></slot>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import OSideNode from './o-side-node/index.vue'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])
const enableSideNode = inject('sideNode', { value: false })

const renderAttrs = computed(() => {
  const attrs: Indexable = {}
  if (props.node.attrs['data-id']) {
    attrs['data-id'] = props.node.attrs['data-id']
  }
  return attrs
})
</script>

<style lang="scss">
.o-node-view {
  position: relative;

  //  hover
  // --------------------------------------------------
  &:hover {
    .action-container {
      visibility: visible;
    }

    .o-block-toolbar {
      visibility: visible;
    }
  }

  //  side node
  // --------------------------------------------------
  &:first-child,
  .o-node-view {
    .o-side-node {
      display: none;
    }
  }

  // Hide first child
  .o-node-view {
    &:not(:first-child):hover {
      //background: yellowgreen;
      .o-side-node {
        display: block;
      }
    }

    &:first-child {
      //background: aliceblue;
      .o-side-node {
        display: none !important;
      }
    }

    // Hide add node
    .o-add-node {
      display: none;
    }

    .o-side-node {
      top: 0 !important;
      left: -80px !important;
    }
  }

  &:has(.is-dragging) {
    .o-side-node {
      color: transparent;
      background: transparent;

      .action-container {
        .o-add-node {
          display: none;
        }
      }

      .n-button {
        color: transparent !important;
        border-color: transparent !important;

        .o-icon,
        .n-button__border,
        .n-button__state-border {
          color: transparent !important;
          border: none !important;
        }
      }
    }

    .o-block-toolbar,
    .caption,
    .col-handler,
    .row-handler {
      display: none !important;
    }

    .tableWrapper {
      padding: 10px;
      margin: 0;
    }
  }

  &.o-table-wrapper-view {
    .o-side-node {
      top: 40px !important;
      left: -64px;
    }

    .o-node-view {
      .o-side-node {
        top: 0 !important;
        display: none !important;
      }
    }
  }
}
</style>
