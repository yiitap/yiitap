<template>
	<section class="page-demo" :class="{ dark: darkMode }">
		<section class="layout-toolbar">
			<header>
				<section class="info">
					<img src="/logo.png" alt="Logo" />
					<div class="title">Yiitap Editor</div>
				</section>
				<section class="actions">
					<n-button quaternary @click="onGithub">
						<o-icon name="github" />
					</n-button>
					<n-button quaternary @click="onToggleDrawer">
						<o-icon name="menu" />
					</n-button>
				</section>
			</header>
			<div class="toolbar">
				<o-main-menu
					:editor="yiiEditor?.editor"
					:menu="options.mainMenu"
					:data-theme="darkMode ? 'dark' : ''"
				/>
			</div>
		</section>
		<section class="layout-content">
			<YiiEditor ref="yiiEditor" v-bind="options" @update="onUpdate" />
		</section>

		<n-drawer
			v-model:show="showDrawer"
			:default-width="400"
			placement="right"
			resizable
		>
			<n-drawer-content title="Yii Editor" closable>
				<n-form ref="form" label-placement="left" label-width="auto">
					<n-form-item label="Language">
						<n-radio-group v-model:value="locale" name="radiogroup1">
							<n-space>
								<n-radio value="en"> English </n-radio>
								<n-radio value="zh"> 中文 </n-radio>
							</n-space>
						</n-radio-group>
					</n-form-item>
					<n-form-item label="Mode">
						<n-switch v-model:value="darkMode" @update:value="onMode">
							<template #checked> Dark </template>
							<template #unchecked> Light </template>
						</n-switch>
					</n-form-item>
					<n-form-item label="Edit">
						<n-switch v-model:value="editable">
							<template #checked> Editable </template>
							<template #unchecked> Readonly </template>
						</n-switch>
					</n-form-item>
				</n-form>
			</n-drawer-content>
		</n-drawer>
	</section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, provide, watch } from 'vue'
import {
	NButton,
	NDrawer,
	NDrawerContent,
	NForm,
	NFormItem,
	NRadio,
	NRadioGroup,
	NSpace,
	NSwitch,
} from 'naive-ui'
import { YiiEditor, OMainMenu, OIcon } from '@yiitap/vue'
import { BasicFeaturesArticle, BasicFeaturesArticleZh } from '@/data/article'

const emit = defineEmits(['mode'])

const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const locale = ref('en')
const darkMode = ref(false)
const editable = ref(true)
const showDrawer = ref(false)

provide('locale', locale)
provide('darkMode', darkMode)

const options = computed(() => {
	return {
		locale: locale.value,
		darkMode: darkMode.value,
		editable: editable.value,
		content: content.value,
		showMainMenu: false,
		showBubbleMenu: true,
		showFloatingMenu: true,
		showSideMenu: true,
		// showSideNode: true,
		pageView: 'page',
		mainMenu: [
			'bold',
			'italic',
			'text-format-dropdown',
			'separator',
			'heading',
			'font-family',
			'text-color-dropdown',
			'fore-color',
			'back-color',
			'clearFormat',
			'separator',
			'align-dropdown',
			'separator',
			'horizontalRule',
			'blockquote',
			'list-dropdown',
			'codeBlock',
			'link',
			'image',
			'video',
			'table',
			'callout',
			'emoji',
		],
		extensions: [
			'OBlockquote',
			'OCallout',
			'OCodeBlock',
			'OColorHighlighter',
			'OHeading',
			'OImage',
			'OParagraph',
			'OSlash',
			'OSlashZh',
			'OLink',
			'OTrailingNode',
			'OVideo',
		],
	}
})

const content = computed(() => {
	return locale.value === 'zh' ? BasicFeaturesArticleZh : BasicFeaturesArticle
	// return ''
})

function onToggleDrawer() {
	showDrawer.value = !showDrawer.value
}

function onGithub() {
	window.open('https://github.com/yiitap/yiitap', '_blank')
}

function onMode() {
	emit('mode', darkMode.value)
}

function onUpdate({ json, html }: { json: any; html: string }) {
	// console.log('update', json)
	// console.log('update', html)
}

watch(locale, (newValue) => {
	yiiEditor.value?.editor.commands.setContent(content.value)
})

onMounted(() => {
	// console.debug('ref', yiiEditor.value)
	// console.debug('ref', import.meta.env.PROD)
})
</script>

<style lang="scss">
.page-demo {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow: hidden;
	color: var(--yii-color-accent);
	background: var(--yii-bg-color);

	.layout-toolbar {
		height: 108px;
		header {
			height: 60px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 1rem;

			.info {
				display: inline-flex;
				align-items: center;
				img {
					width: 32px;
					height: 32px;
				}

				.title {
					padding: 0 4px;
					font-size: 20px;
				}
			}

			.actions {
				display: flex;
				align-items: center;

				.n-button {
					padding: 0 8px;
					margin-left: 4px;
				}
			}
		}

		.toolbar {
			width: 100%;
			height: 48px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: solid 1px rgba(0, 0, 0, 0.05);
			border-bottom: solid 1px rgba(0, 0, 0, 0.05);
			box-sizing: border-box;
		}
	}

	.layout-content {
		position: absolute;
		left: 0;
		right: 0;
		top: 108px;
		bottom: 0;
		overflow: auto;
	}
}

.n-drawer {
	.action {
		margin-bottom: 14px;
	}
}

*:has(.is-dragging) {
	background: transparent !important;
}
</style>
