<template>
	<section class="o-main-menu">
		<!-- Left -->
		<section class="left">
			<template v-for="(item, index) of dynamicMenu" :key="index">
				<o-divider vertical v-if="item === 'separator'" />
				<component
					:name="item"
					:is="getComponent(item)"
					:editor="editor"
					v-else-if="typeof item === 'string'"
				/>
				<component :is="item" :editor="editor" v-else />
			</template>

			<!-- Left slot -->
			<slot name="left" />
		</section>

		<!-- Toolbar: right -->
		<section class="right">
			<slot name="right" />
		</section>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getComponent } from '../menu'
import { DefaultMenu, TableMenu } from '../../constants/menu'
import { ODivider } from '../index'

const props = defineProps({
	editor: {
		type: Object,
	},
	menu: {
		type: Array,
		default: function () {
			return []
		},
	},
})

const dynamicMenu = computed(() => {
	let menu = props.menu
	if (props.editor?.isActive('table')) {
		menu = TableMenu
	}
	return menu.length > 0 ? menu : DefaultMenu
})
</script>

<style lang="scss">
.o-main-menu {
	color: red;

	.o-simple-command-btn:not(:first-child) {
		margin-left: 2px;
	}

	.o-button-group:not(:first-child) {
		margin-left: 2px;
	}

	.left {
		display: flex;
		align-items: center;
	}
}
</style>
