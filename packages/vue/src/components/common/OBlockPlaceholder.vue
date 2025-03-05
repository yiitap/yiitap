<template>
	<section class="o-block-placeholder">
		<div class="icon">
			<o-icon :name="icon" />
		</div>
		<div class="placeholder">
			{{ placeholder }}
		</div>
	</section>
</template>

<script setup lang="ts">
import { OIcon } from '../index'

const props = defineProps({
	icon: {
		type: String,
		default: 'image',
	},
	placeholder: {
		type: String,
		default: '',
	},
})
</script>

<style lang="scss">
.o-block-placeholder {
	display: flex;
	align-items: center;
	border-radius: 4px;
	background: rgba(#000, 0.05);
	padding: 12px;
	width: 100%;
	box-sizing: border-box;

	.icon {
		margin-right: 8px;
	}

	.placeholder {
		height: 0.9rem;
		font-size: 0.9rem;
		line-height: 1rem;
	}
}

.o-block-placeholder-popover {
	.meta-input {
		min-width: 500px;
		padding: 14px 4px;

		.actions {
			display: flex;
			justify-content: center;
			padding-top: 1rem;

			.n-button {
				min-width: 120px;
			}
		}
	}
}
</style>
