<template>
  <section class="o-simple-color-board">
    <section class="fore-colors">
      <header>
        <div class="label o-tips">
          {{ tr('editor.textColor') }}
        </div>
        <o-popover
          ref="popover"
          class="o-simple-command-btn"
          size="medium"
          placement="right-start"
          trigger="mouseenter"
          :offset="[-9, 14]"
          :show-arrow="false"
        >
          <template #trigger>
            <o-tooltip>
              <template #trigger>
                <o-btn icon="more_horiz" class="o-command-btn" />
              </template>
              {{ tr('label.more') }}
            </o-tooltip>
          </template>

          <o-color-board
            default-color=""
            default-disabled
            @select="onSelect('color', { value: $event })"
          />
        </o-popover>
      </header>
      <div class="color-row">
        <o-menubar-btn
          icon="format_text"
          tooltip="Default color"
          content-class="border"
          @click="onSelect('color', { value: '' })"
        />
        <o-menubar-btn
          icon="format_text"
          :color="foreColor"
          tooltip="Last used"
          content-class="border"
          @click="onSelect('color', { value: foreColor })"
          v-if="foreColor"
        />
      </div>
      <div class="color-row">
        <template v-for="(col, j) in foreColors" :key="`col-${j}`">
          <o-menubar-btn
            icon="format_text"
            :color="col.value"
            :tooltip="col.label"
            @click="onSelect('color', col)"
          />
        </template>
      </div>
    </section>
    <section class="back-colors">
      <header>
        <div class="label o-tips">
          {{ tr('editor.backgroundColor') }}
        </div>
        <o-popover
          ref="popover"
          class="o-simple-command-btn"
          size="medium"
          placement="right-start"
          trigger="mouseenter"
          :offset="[-9, 14]"
          :show-arrow="false"
        >
          <template #trigger>
            <o-tooltip>
              <template #trigger>
                <o-btn icon="more_horiz" class="o-command-btn" />
              </template>
              {{ tr('label.more') }}
            </o-tooltip>
          </template>

          <o-color-board
            default-color=""
            default-disabled
            @select="onSelect('backgroundColor', { value: $event })"
          />
        </o-popover>
      </header>
      <div class="color-row">
        <o-menubar-btn
          icon="slash_forward"
          tooltip="No Color"
          content-class="border"
          @click="onSelect('backgroundColor', { value: '' })"
        />
        <o-menubar-btn
          icon="format_text"
          tooltip="Last used"
          content-class="border"
          :content-style="{ backgroundColor: backColor }"
          @click="onSelect('backgroundColor', { value: backColor })"
          v-if="backColor"
        />
      </div>
      <div class="color-row">
        <template v-for="(col, j) in backColors" :key="`col-${j}`">
          <o-menubar-btn
            icon="format_text"
            :tooltip="col.label"
            :content-style="{ backgroundColor: col.value }"
            @click="onSelect('backgroundColor', col)"
          />
        </template>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OMenubarBtn, OColorBoard, OPopover, OTooltip, OBtn } from '../index'

import useI18n from '../../hooks/useI18n'

const props = defineProps({
  foreColor: {
    type: String,
    default: '',
  },
  backColor: {
    type: String,
    default: '',
  },
  activeColor: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['select'])

const { tr } = useI18n()

function onSelect(command: string, color: Indexable) {
  emit('select', command, color.value)
}

const foreColors = computed(() => {
  return [
    { label: 'Grey', value: '#787774' },
    { label: 'Brown', value: '#9F6B53' },
    { label: 'Orange', value: '#D9730D' },
    { label: 'Yellow', value: '#CB912F' },
    { label: 'Green', value: '#448361' },
    { label: 'Blue', value: '#337EA9' },
    { label: 'Purple', value: '#9065B0' },
    { label: 'Pink', value: '#C14C8A' },
    { label: 'Red', value: '#D44C47' },
  ]
})

const backColors = computed(() => {
  return [
    { label: 'Grey', value: '#F1F1EF' },
    { label: 'Brown', value: '#F4EEEE' },
    { label: 'Orange', value: '#FAEBDD' },
    { label: 'Yellow', value: '#FBF3DB' },
    { label: 'Green', value: '#EDF3EC' },
    { label: 'Blue', value: '#E7F3F8' },
    { label: 'Purple', value: '#F6F3F9' },
    { label: 'Pink', value: '#FAF1F5' },
    { label: 'Red', value: '#FDEBEC' },
  ]
})
</script>

<style lang="scss">
.o-simple-color-board {
  //padding: 0 10px;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .color-row {
    display: flex;
    justify-content: flex-start;

    &:nth-child(2) {
      margin: 8px 0 8px 0;
    }

    .o-tooltip {
      margin-left: 4px;
      border-radius: 2px;

      &:first-child {
        margin: 0;
      }

      .border {
        border: solid 1px rgba(0, 0, 0, 0.05);
      }

      .o-command-btn {
        width: 26px;
        height: 26px;
      }
    }
  }

  header,
  .fore-colors {
    .o-command-btn {
      border: solid 1px rgba(0, 0, 0, 0.05);
    }
  }

  .back-colors {
    margin-top: 10px;

    .color-row .o-icon {
      visibility: hidden;
    }
  }
}
</style>
