<template>
	<o-node-view v-bind="props" class="o-code-block-view">
		<div class="code-block-toolbar">
			<div class="wrap editable">
				<o-language-dropdown :language="language" @select="onSelectLanguage" />
			</div>
			<div class="wrap">
				<div class="language readonly">{{ language }}</div>
				<o-menubar-btn
					:icon="wrapIcon"
					:icon-class="{ 'rotate-270': wrap }"
					tooltip="Wrap"
					class="editable"
					@click="onWrap"
				/>
				<o-menubar-btn :icon="copyIcon" tooltip="Copy" @click="onCopy" />
			</div>
		</div>

		<pre><node-view-content as="code" :class="{'wrap': wrap}" /></pre>
	</o-node-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import {
	OLanguageDropdown,
	OMenubarBtn,
	ONodeView,
} from '../../components/index'
import { copyToClipboard } from '@yiitap/core'

const props = defineProps(nodeViewProps)
const copyIcon = ref('content_copy')

const language = computed({
	get() {
		return props.node.attrs.language
	},
	set(language) {
		props.updateAttributes({ language })
	},
})

const wrap = computed({
	get() {
		return props.node.attrs.wrap
	},
	set(wrap) {
		props.updateAttributes({ wrap })
	},
})

const wrapIcon = computed(() => {
	return wrap.value ? 'text_select_move_down' : 'format_text_wrap'
})

function onSelectLanguage(value: string) {
	language.value = value
}

function onCopy() {
	const text = props.node.content.content[0].text
	copyToClipboard(text).then(() => {
		copyIcon.value = 'done'
		setTimeout(() => {
			copyIcon.value = 'content_copy'
		}, 2000)
	})
}

function onWrap() {
	wrap.value = !wrap.value
}
</script>

<style lang="scss">
.o-code-block-view {
	position: relative;
	z-index: 1000;
	margin: 4px 0;

	.code-block-toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40px;
		padding: 0;
		border-radius: 5px 5px 0 0 !important;
		background: var(--yii-pre-tool-bg-color);
		z-index: 1;

		.wrap {
			display: flex;
			align-items: center;
		}

		.readonly {
			display: none;
		}

		.o-btn {
			border-radius: 0;
			height: 40px;
			width: 40px;
			padding: 0 10px;

			&.o-dropdown-btn {
				width: unset;
				border-radius: 5px 0 0 0 !important;
			}
		}

		.o-tooltip {
			&:last-child {
				.o-btn {
					border-radius: 0 5px 0 0 !important;
				}
			}
		}
	}
}

.tiptap[contenteditable='false'] {
	.o-code-block-view {
		margin-top: 0;

		&:hover {
			.code-block-toolbar {
				visibility: visible;
			}
		}

		pre {
			padding: 1rem;
			border-radius: 5px;
		}

		.code-block-toolbar {
			left: unset;
			top: 0;
			height: unset;
			padding: 0 !important;
			margin: 12px;
			border-radius: 3px !important;
			background: #dfdfdf;
			//visibility: hidden;

			.editable {
				display: none;
			}
			.readonly {
				display: block;
			}

			.language {
				padding: 0 8px;
				height: 30px;
				min-width: 40px;
				text-align: center;
				background: #eeeeee;
				border-radius: 3px 0 0 3px;
			}

			.o-tooltip {
				.o-menubar-btn {
					height: 30px !important;
					width: 36px !important;
					border-radius: 0;

					.icon {
						font-size: 16px !important;
					}
				}

				&:last-child {
					.o-menubar-btn {
						border-radius: 0 3px 3px 0;
					}
				}
			}
		}
	}
}
</style>
