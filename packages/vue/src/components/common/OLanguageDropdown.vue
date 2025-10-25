<template>
  <o-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    tippy-class="o-language-popover"
    conten-class="dropdown"
    @update:show="onShow"
  >
    <template #trigger>
      <o-btn class="o-dropdown-btn">
        <span class="selected-language">
          {{ selectedOption?.label }}
        </span>
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-btn>
    </template>

    <header class="header">
      <o-input
        ref="input"
        v-model="term"
        type="text"
        placeholder="Search"
        autofocus
        clearable
      >
        <template #prefix>
          <o-icon name="search" class="o-tips" />
        </template>
      </o-input>
    </header>
    <section class="o-scroll">
      <o-list hoverable clickable>
        <template v-for="(item, index) in filterOptions" :key="index">
          <o-list-item
            @click="onSelect(item)"
            :class="{
              'is-active': item.value === selectedLanguage,
              'is-select': index === selectedIndex,
            }"
          >
            {{ item.label }}
            <template #prefix>
              <o-icon :name="item.icon" />
            </template>
          </o-list-item>
        </template>
      </o-list>
    </section>
  </o-popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OBtn, OIcon, OInput, OList, OListItem, OPopover } from '../index'

import useI18n from '../../hooks/useI18n'
import { Languages } from '../../constants/language'

const props = defineProps({
  language: {
    type: String,
    default: 'shell',
  },
})
const emit = defineEmits(['select'])

const { tr } = useI18n()
const popover = ref<InstanceType<typeof OPopover>>()
const input = ref<InstanceType<typeof OInput>>()
const term = ref('')
const selectedIndex = ref(0)
const selectedLanguage = ref('')

const filterOptions = computed(() => {
  return term.value
    ? Languages.filter(
        (e) => e.value.toLowerCase().indexOf(term.value.toLowerCase()) >= 0
      )
    : Languages
})

const selectedOption = computed(() => {
  return Languages.find((e) => e.value === selectedLanguage.value)
})

function onShow(show: boolean) {
  if (show) {
    setTimeout(() => {
      input.value?.focus()
      selectedIndex.value = 0
      window.addEventListener('keyup', onKeyup)
    }, 0)
  }
}

function onHide() {
  window.removeEventListener('keyup', onKeyup)
  popover.value?.setShow(false)
}

function onSelect(item: Indexable) {
  onHide()

  selectedLanguage.value = item.value
  emit('select', item.value)
}

function onSelected() {
  onSelect(filterOptions.value[selectedIndex.value])
}

function onKeyup(e: KeyboardEvent) {
  if (filterOptions.value.length > 0) {
    switch (e.code) {
      case 'ArrowDown':
        selectedIndex.value = selectedIndex.value + 1
        break
      case 'ArrowUp':
        selectedIndex.value = selectedIndex.value - 1
        break
      case 'Enter':
        onSelected()
        break
      default:
    }
    if (selectedIndex.value >= filterOptions.value.length) {
      selectedIndex.value = 0
    }
    if (selectedIndex.value < 0) {
      selectedIndex.value = filterOptions.value.length - 1
    }
  } else {
    selectedIndex.value = 0
  }
}

onMounted(() => {
  selectedLanguage.value = props.language
})
</script>

<style lang="scss">
.o-language-popover {
  .header {
    padding: 8px 8px 0 8px;
  }

  input {
    height: 20px !important;
  }
}
</style>
