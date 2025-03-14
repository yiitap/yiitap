<template>
  <section class="o-meta-input">
    <section class="header">
      <div class="title">{{ title }}</div>
      <div>
        <slot name="header-right"></slot>
      </div>
    </section>
    <section class="fields">
      <o-input ref="input" v-model="value" type="text" autofocus clearable>
        <template #prefix>
          <o-icon :name="icon" class="o-tips" />
        </template>
      </o-input>
    </section>
    <footer class="actions">
      <o-btn type="tertiary" @click="emit('cancel')">
        {{ tr('label.cancel') }}
      </o-btn>
      <o-btn type="info" @click="onConfirm">
        {{ tr('label.ok') }}
      </o-btn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { OBtn, OIcon, OInput } from '../index'
import useI18n from '../../hooks/useI18n'

const props = defineProps({
  val: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Link',
  },
  type: {
    type: String,
    default: 'link',
  },
  icon: {
    type: String,
    default: 'link',
  },
  secondIcon: {
    type: String,
    default: '',
  },
  secondLabel: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['cancel', 'confirm'])
const { tr } = useI18n()

const input = ref(null)
const value = ref('')

function onConfirm() {
  console.log('confirm', value.value)
  emit('confirm', value.value)
}

onMounted(() => {
  value.value = props.val

  setTimeout(() => {
    input.value?.focus()
  }, 0)
})
</script>

<style lang="scss">
.o-meta-input {
  min-width: 500px;
  padding: 8px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 1rem;
    }
  }

  .fields {
    padding: 14px 0;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-top: 10px;

    .o-btn {
      min-width: 100px;
    }
  }
}
</style>
