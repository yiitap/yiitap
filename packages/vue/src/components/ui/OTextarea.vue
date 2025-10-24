<template>
  <div class="o-textarea" :class="`type-${type}`">
    <div class="o-textarea__prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="o-textarea__main">
      <textarea
        ref="input"
        v-model="value"
        :placeholder="placeholder"
        :rows="rows"
        @focus="emit('focus')"
        @blur="emit('blur')"
      />
    </div>
    <div class="o-textarea__suffix">
      <slot name="suffix"></slot>
      <o-icon
        name="close"
        class="clear o-tips"
        @click="clear"
        v-if="clearable && value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OIcon from './OIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 3,
  },
})
const emit = defineEmits(['blur', 'focus', 'update:modelValue'])
const input = ref<HTMLInputElement | null>(null)

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

function focus() {
  input.value?.focus()
}

function clear() {
  value.value = ''
  focus()
}

defineExpose({
  clear,
  focus,
})
</script>

<style lang="scss">
.o-textarea {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  width: 100%;
  border-radius: 3px;
  box-sizing: border-box;
  outline: solid 1px rgba(0, 0, 0, 0.05);

  &:has(textarea:focus) {
    background: var(--yii-active-bg-color);
    outline: solid 1px #2080f0;
  }

  &__prefix {
    flex: 0;
    margin-right: 10px;
  }

  &__main {
    flex: 1;

    textarea {
      width: 100%;
      height: 30px;
      border: none;
      color: var(--yii-color);
      background: transparent;

      &:focus {
        outline: none !important;
      }
    }
  }

  &__suffix {
    flex: 0;
    display: flex;

    .o-icon.clear {
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin-left: 4px;
      text-align: center;
      justify-content: center;

      &:hover {
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
