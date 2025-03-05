<template>
	<div class="o-checkbox">
		<div class="o-checkbox__main">
			<input v-model="value" type="checkbox" />
		</div>
		<div class="o-checkbox__suffix">
			{{ label }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: '',
	},
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	},
})
</script>

<style lang="scss">
.o-checkbox {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	box-sizing: border-box;

	&__main {
		display: flex;
		flex: 0;
		align-items: center;

		input {
			width: 16px;
			height: 16px;

			&:focus {
				outline: none !important;
			}
		}
	}

	&__suffix {
		flex: 1;
		padding: 0 4px;
	}
}
</style>
