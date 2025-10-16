<template>
  <o-node-view v-bind="props" class="o-details-view">
    <div class="details" :class="{ 'is-open': open }">
      <button type="button" @click="toggle">
        <o-icon name="details_arrow" />
      </button>
      <node-view-content />
    </div>
  </o-node-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView, OIcon } from '../../components'

const props = defineProps(nodeViewProps)
const open = ref(!!props.node.attrs.open)

function toggle() {
  const newValue = !open.value
  open.value = newValue
  props.updateAttributes({ open: newValue })
}
</script>

<style lang="scss">
.o-details-view {
  .details {
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
    border: 1px solid var(--gray-3);
    border-radius: 0.5rem;

    summary {
      font-weight: 700;
    }

    > button {
      align-items: center;
      background: transparent;
      border-radius: 4px;
      display: flex;
      font-size: 0.5rem;
      justify-content: center;
      line-height: 1;
      margin: 3px 0;
      padding: 6px;
      border: none;

      &:hover {
        cursor: pointer;
        background-color: var(--yii-hover-bg-color);
      }

      .o-icon {
        font-size: 14px;
        transform: rotate(-90deg);
        transition: transform 0.3s ease-in-out;
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
      padding: 3px 0;

      > [data-type='detailsContent'] {
        display: none !important;
      }
      > [data-type='detailsContent'] > :last-child {
        margin-bottom: 0.5rem;
      }
    }

    &.is-open > button {
      .o-icon {
        transform: rotate(0deg);
        transition: transform 0.3s ease-in-out;
      }
    }

    &.is-open > div {
      > [data-type='detailsContent'] {
        display: block !important;
      }
    }
  }
}
</style>
