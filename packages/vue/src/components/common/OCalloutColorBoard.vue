<template>
  <section class="o-callout-color-board">
    <section class="fore-colors">
      <div class="label o-tips">Border color</div>
      <div class="color-row">
        <o-menubar-btn
          icon="slash_forward"
          tooltip="No color"
          content-class="border"
          @click="onSelect('foreColor', { value: '' })"
        />
        <o-menubar-btn
          tooltip="Last used"
          :content-style="{ borderColor: foreColor }"
          @click="onSelect('foreColor', { value: foreColor })"
          v-if="foreColor"
        />
      </div>
      <div class="color-row">
        <template v-for="(col, j) in foreColors" :key="`col-${j}`">
          <o-menubar-btn
            :tooltip="col.label"
            :content-style="{ borderColor: col.value }"
            @click="onSelect('foreColor', col)"
          />
        </template>
      </div>
    </section>
    <section class="back-colors">
      <div class="label o-tips">Background</div>
      <div class="color-row">
        <o-menubar-btn
          icon="slash_forward"
          tooltip="Default Color"
          content-class="border"
          @click="onSelect('backColor', { value: '#F5F5F5' })"
        />
        <o-menubar-btn
          :content-style="{ backgroundColor: backColor }"
          tooltip="Last used"
          content-class="border"
          @click="onSelect('backColor', { value: backColor })"
          v-if="backColor"
        />
      </div>
      <div class="color-row">
        <template v-for="(col, j) in backColors" :key="`col-${j}`">
          <o-menubar-btn
            :tooltip="col.label"
            :content-style="{ backgroundColor: col.value }"
            @click="onSelect('backColor', col)"
          />
        </template>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OMenubarBtn } from '../index'

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

function onSelect(name: string, color: Indexable) {
  emit('select', {
    name: name,
    value: color.value,
  })
}

const foreColors = computed(() => {
  return [
    { label: 'Grey', value: '#e9e9e9' },
    { label: 'Brown', value: '#ffd591' },
    { label: 'Orange', value: '#ffbb96' },
    { label: 'Yellow', value: '#fff08f' },
    { label: 'Green', value: '#b7eb8f' },
    { label: 'Blue', value: '#91d5ff' },
    { label: 'Purple', value: '#d3adf7' },
    { label: 'Pink', value: '#ffadd2' },
    { label: 'Red', value: '#ffa39e' },
  ]
})

const backColors = computed(() => {
  return [
    { label: 'Grey', value: '#F5F5F5' },
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
.o-callout-color-board {
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
        width: 24px;
        height: 24px;
      }
    }
  }

  .fore-colors {
    .o-command-btn {
      border: solid 1px rgba(0, 0, 0, 0.05);
    }
  }

  .back-colors {
    margin-top: 10px;
  }
}
</style>
