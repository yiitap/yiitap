<template>
  <o-node-view
    v-bind="props"
    class="o-table-wrapper-view"
    :class="{ 'side-node-enabled': enableSideNode }"
  >
    <node-view-content as="table" />
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ONodeView } from '../../components/index'

const props = defineProps(nodeViewProps)
const enableSideNode = inject('sideNode', { value: false })
const showPopover = ref(false)

const isFocused = computed(() => {
  const { selection } = props.editor.view.state
  const pos = selection.from
  const nodeFrom = props.getPos()
  const nodeTo = nodeFrom + props.node.nodeSize
  return pos >= nodeFrom && pos <= nodeTo
})

function onShowPopover(value: boolean) {
  showPopover.value = value
}

watch(isFocused, (newValue) => {
  console.log('isFocused', props.node.attrs)
  onShowPopover(newValue)
})
</script>

<style lang="scss">
.o-table-wrapper-view {
  position: relative;
}

.o-table-wrapper-popover {
  //top: -30px;
  min-width: 200px;
}
</style>
