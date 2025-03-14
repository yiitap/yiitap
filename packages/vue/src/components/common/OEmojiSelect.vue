<template>
  <section class="o-emoji-select">
    <div v-if="enableSearch">
      <o-input
        ref="input"
        v-model="value"
        type="text"
        autofocus
        clearable
        @update:modelValue="onSearch"
      >
        <template #prefix>
          <o-icon name="search" class="o-tips" />
        </template>
      </o-input>
    </div>

    <section class="groups o-scroll">
      <template v-for="(group, i) in visibleGroups" :key="`group-${i}`">
        <div class="group" v-show="group.emojis?.length">
          <header ref="groupRefs">{{ group.name }}</header>
          <section class="items">
            <div v-for="(item, j) in group.emojis" :key="`item-${j}`">
              <div class="item" @click="onSelected(item)">
                {{ item.emoji }}
              </div>
            </div>
          </section>
        </div>
      </template>

      <div class="groups-empty" v-if="!isNotEmpty">没有记录</div>
    </section>

    <section class="group-icons">
      <template v-for="(group, i) in visibleGroups" :key="`target-${i}`">
        <o-tooltip :delay="300">
          <template #trigger>
            <div
              class="item"
              :class="{ active: groupIndex === i }"
              @click="onScrollTo(group, i)"
              v-show="group.emojis?.length"
            >
              <o-icon :name="emojiGroupIcons[group.slug]" />
            </div>
          </template>
          {{ group.name }}
        </o-tooltip>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { filterEmojiGroups, emojiGroupIcons } from '../../constants/emoji'
import { OIcon, OInput, OTooltip } from '../../components'

const props = defineProps({
  items: {
    type: Array as () => Indexable[],
    required: true,
  },
  enableSearch: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['select'])

const input = ref(null)
const value = ref('')
const searchResults = ref([])
const groupRefs = ref([])
const groupIndex = ref(0)

const visibleGroups = computed(() => {
  return value.value ? searchResults.value : props.items
})

const isNotEmpty = computed(() => {
  let notEmpty = false
  visibleGroups.value.map((item) => {
    notEmpty = notEmpty || item.emojis.length
  })
  return notEmpty
})

function onSearch() {
  groupIndex.value = 0
  searchResults.value = value.value ? filterEmojiGroups(value.value) : []
}

function onSelected(item: Indexable) {
  emit('select', item)
}

function onScrollTo(item: Indexable, index: number) {
  groupIndex.value = index
  const target = groupRefs.value[index]
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
}

onMounted(() => {
  // console.log('emojiGroup', emojiGroups)
  // console.log('emojiList', emojiList.value)
})
</script>

<style lang="scss">
.o-emoji-select {
  position: relative;
  width: 384px;

  .groups {
    max-height: 344px !important;
    scrollbar-width: none;
  }

  .groups-empty {
    padding: 16px 0;
    text-align: center;
    color: var(--yii-caption-color) !important;
  }

  .group {
    header {
      color: var(--yii-caption-color) !important;
    }
  }

  .group-empty {
    display: none;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    //justify-content: center;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    font-size: 26px;
    line-height: 1;
    padding: 2px;
    border-radius: 4px;
    cursor: pointer;

    &:hover,
    &.active {
      background: var(--yii-hover-bg-color) !important;
    }
  }

  .group-icons {
    display: flex;
    align-items: center;
    //justify-content: space-between;
    padding-top: 8px;

    .item {
      margin-right: 4px;
    }

    .o-icon {
      font-size: 24px;
      color: var(--yii-tips-color) !important;
    }
  }
}
</style>
