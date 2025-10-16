<template>
  <div class="dropdown-menu">
    <button
      :class="{ 'is-selected': index === selectedIndex }"
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(index)"
    >
      <img
        v-if="item.fallbackImage"
        :src="item.fallbackImage"
        align="absmiddle"
      />
      <template v-else>
        {{ item.emoji }}
      </template>
      :{{ item.name }}:
    </button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },

    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]

      if (item) {
        this.command({ name: item.name })
      }
    },
  },
}
</script>

<style lang="scss">
/* Dropdown menu */
.dropdown-menu {
  background: var(--yii-bg-color);
  border: 1px solid var(--yii-border-color);
  border-radius: 0.7rem;
  box-shadow: var(--yii-dropdown-shadow);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: auto;
  padding: 0.4rem;
  position: relative;

  button {
    align-items: center;
    color: var(--yii-color);
    background-color: transparent;
    display: flex;
    gap: 0.25rem;
    text-align: left;
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.375rem 0.625rem;
    font-weight: 500;
    font-size: 0.875rem;

    &:hover,
    &:hover.is-selected {
      background-color: var(--yii-hover-bg-color);
    }

    &.is-selected {
      background-color: var(--yii-hover-bg-color);
    }

    img {
      height: 1em;
      width: 1em;
    }
  }
}
</style>
