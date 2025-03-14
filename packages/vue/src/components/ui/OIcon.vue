<template>
  <span class="o-icon" :class="{ small: small }" :style="{ color: color }">
    <i class="yiitip-icon" :class="`icon-${name}`" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  small: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-icon {
  display: flex;
  align-items: center;
  font-size: 20px;

  &.small {
    font-size: 16px !important;
  }

  &.rotate-90 {
    transform: rotate(90deg);
  }

  &.rotate-180 {
    transform: rotate(180deg);
  }

  &.rotate-270 {
    transform: rotate(270deg);
  }

  span {
    font-size: unset !important;
  }
}
</style>
