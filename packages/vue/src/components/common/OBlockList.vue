<template>
  <o-list class="o-block-list" hoverable clickable>
    <template v-if="items.length">
      <template v-for="(item, index) in items" :key="index">
        <template v-if="item.group">
          <o-divider v-if="index > 0" />
          <div class="group o-tips">{{ tr(item.group) }}</div>
        </template>
        <o-popover
          :ref="(el: InstanceType<typeof OPopover>) => setPopoverRef(el, index)"
          placement="right-start"
          :offset="[-10, 16]"
          v-if="item.children?.length"
        >
          <template #trigger>
            <o-block-list-item
              :item="item"
              class="item"
              :class="{ 'is-active': index === selectedIndex }"
              clickable
            />
          </template>
          <o-block-list
            :items="item.children"
            @select="onClick(item, index, $event)"
          />
        </o-popover>
        <o-block-list-item
          :item="item"
          class="item"
          :class="{ 'is-active': index === selectedIndex }"
          clickable
          @click="onClick(item, index)"
          v-else
        />
      </template>
    </template>
    <div class="item" v-else>No result</div>
  </o-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useI18n from '../../hooks/useI18n'
import { OBlockList, OBlockListItem, ODivider, OList, OPopover } from '../index'

const props = defineProps({
  items: {
    type: Array as () => BlockOption[],
    required: true,
  },
})
const emit = defineEmits(['select'])

const { tr } = useI18n()
const popovers = ref<InstanceType<typeof OPopover>[]>([])
const setPopoverRef = (
  el: InstanceType<typeof OPopover> | null,
  index: number
) => {
  if (el) {
    popovers.value[index] = el
  }
}

const selectedIndex = ref(0)

function onClick(item: Indexable, index: number, child?: Indexable) {
  emit('select', item, child)
  if (popovers.value[index]) {
    popovers.value[index].setShow(false)
  }
}
</script>

<style lang="scss">
.o-block-list {
  .group {
    font-size: 0.7rem;
  }
  .o-block-list-item {
    margin-top: 2px;
  }
}
</style>
