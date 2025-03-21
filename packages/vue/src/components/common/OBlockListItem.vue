<template>
  <o-list-item class="o-block-list-item" clickable>
    <template #prefix>
      <o-icon :name="item.icon" :color="item.color" />
    </template>
    <template #suffix>
      <span class="o-tips" v-if="item.tips">
        {{ item.tips }}
      </span>
      <o-icon
        name="navigate_next"
        class="o-tips"
        v-if="item.children?.length"
      />
    </template>
    {{ tr(item.label) }}
  </o-list-item>
</template>

<script setup lang="ts">
import useI18n from '../../hooks/useI18n'
import { OIcon, OListItem } from '../index'

const props = defineProps({
  item: {
    type: Object as () => BlockOption,
    required: true,
  },
})
const emit = defineEmits(['select'])

const { tr } = useI18n()
</script>

<style lang="scss">
.o-block-list-item {
}
</style>
