/**
 * Blocks
 */
import { Color } from './color'

export const BasicBlocks: BlockOption[] = [
  {
    label: 'editor.paragraph',
    value: 'paragraph',
    icon: 'title', // title, format_paragraph, local_parking
    color: '',
    style: true,
    group: 'label.basic',
  },
  {
    label: 'editor.heading1',
    value: 'heading',
    keywords: 'h1',
    tips: '#',
    icon: 'format_h1',
    color: Color.blue,
    style: true,
    options: { level: 1 },
  },
  {
    label: 'editor.heading2',
    value: 'heading',
    keywords: 'h2',
    tips: '##',
    icon: 'format_h2',
    color: Color.blue,
    style: true,
    options: { level: 2 },
  },
  {
    label: 'editor.heading3',
    value: 'heading',
    keywords: 'h3',
    tips: '###',
    icon: 'format_h3',
    color: Color.blue,
    style: true,
    options: { level: 3 },
  },
  {
    label: 'editor.todoList',
    value: 'taskList',
    keywords: 'task',
    tips: '[]',
    icon: 'check_box',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.unorderedList',
    value: 'bulletList',
    keywords: 'bullet',
    tips: '-',
    icon: 'format_list_bulleted',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.orderedList',
    value: 'orderedList',
    keywords: 'ordered',
    tips: '1.',
    icon: 'format_list_numbered',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.blockquote',
    value: 'blockquote',
    keywords: 'quote',
    tips: '"',
    icon: 'format_quote_open',
    color: Color.brown,
    style: true,
  },
  {
    label: 'editor.toggleList',
    value: 'details',
    keywords: 'details, toggle',
    tips: '>',
    icon: 'toggle_list',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.codeBlock',
    value: 'codeBlock',
    keywords: 'code',
    tips: '```',
    icon: 'code_braces',
    color: Color.lightBlue,
    style: true,
  },
  {
    label: 'editor.horizontal',
    value: 'horizontalRule',
    tips: '---',
    icon: 'horizontal_rule',
    color: Color.blue,
  },
  {
    label: 'editor.callout',
    value: 'callout',
    color: Color.deepOrange,
    icon: 'card_text',
    style: false,
  },
  {
    label: 'editor.emoji',
    value: 'emoji',
    keywords: 'emoji',
    tips: ':',
    icon: 'emoji_emotions',
    color: Color.blue,
  },
]

export const StyleBlocks: BlockOption[] = BasicBlocks.filter((e) => e.style)

export const CommonBlocks: BlockOption[] = [
  {
    label: 'editor.aiBlock',
    value: 'aiBlock',
    icon: 'auto_awesome',
    color: Color.purple,
    tips: 'ai',
    group: 'label.ai',
  },
  {
    label: 'editor.callout',
    value: 'callout',
    icon: 'card_text',
    color: Color.deepOrange,
    tips: 'callout',
    group: 'label.common',
  },
  {
    label: 'editor.table',
    value: 'table',
    icon: 'window',
    tips: 'table',
    color: Color.cyan,
  },
  {
    label: 'editor.codeBlock',
    value: 'codeBlock',
    icon: 'code_braces',
    tips: 'code',
    color: Color.blue,
  },
  {
    label: 'editor.todoList',
    value: 'taskList',
    icon: 'check_box',
    tips: 'task',
    color: Color.indigo,
  },
  {
    label: 'label.image',
    value: 'image',
    icon: 'image',
    color: Color.amber,
    tips: 'image',
    group: 'label.media',
  },
  {
    label: 'label.video',
    value: 'video',
    icon: 'videocam',
    tips: 'video',
    color: Color.purple,
  },
  {
    label: 'label.model',
    value: 'modelViewer',
    icon: '3d_rotation',
    tips: 'model',
    color: Color.purple,
  },
]

export const Blocks: BlockOption[] = [...BasicBlocks, ...CommonBlocks]

export const BlockMenus: BlockOption[] = [
  {
    label: 'editor.duplicate',
    value: 'duplicate',
    icon: 'content_copy',
    color: Color.blue,
    tips: 'Ctrl+D',
    group: 'label.common',
    filter: 'common',
  },
  {
    label: 'label.copy',
    value: 'copy',
    icon: 'copy_all',
    color: Color.indigo,
    filter: 'common',
  },
  {
    label: 'editor.delete',
    value: 'delete',
    icon: 'delete',
    tips: 'Ctrl+X',
    color: Color.deepOrange,
    filter: 'common',
  },
  {
    label: 'label.replace',
    value: 'replace',
    icon: 'cached',
    tips: 'Ctrl+R',
    color: Color.blue,
    filter: 'image,video,model',
  },
  {
    label: 'label.color',
    value: 'color',
    icon: 'palette',
    color: Color.purple,
    filter: 'style',
    component: 'OTextColorBoard',
  },
  {
    label: 'label.color',
    value: 'callout_color',
    icon: 'palette',
    color: Color.purple,
    filter: 'callout',
    component: 'OCalloutColorBoard',
  },
]

export const AskAiBlocks: BlockOption[] = [
  {
    label: 'ai.improve_writing',
    value: 'improve_writing',
    icon: 'title',
    color: Color.purple,
    group: 'label.suggested',
    options: {
      prompt: 'Improve writing of the following content: [CONTENT]',
    },
    tips: 'improve',
  },
  {
    label: 'ai.fix_spelling_grammar',
    value: 'fix_spelling_grammar',
    icon: 'spellcheck',
    color: Color.purple,
    options: {
      prompt: 'Fix spelling and grammar of the following content: [CONTENT]',
    },
    tips: 'fix',
  },
  {
    label: 'ai.enrich_with_emoji',
    value: 'enrich_with_emoji',
    icon: 'emoji_emotions',
    color: Color.purple,
    options: {
      prompt: 'Enrich the following content with Emoji: [CONTENT]',
    },
    tips: 'emoji',
  },
  {
    label: 'ai.translate',
    value: 'translate',
    icon: 'translate',
    color: Color.purple,
    options: {
      prompt: 'Translate the following content to [LANGUAGE]: [CONTENT]',
    },
    children: [
      {
        label: 'language.chinese_simplified',
        value: 'Simplified Chinese',
        icon: 'language',
      },
      {
        label: 'language.chinese_traditional',
        value: 'Traditional Chinese',
        icon: 'language',
      },
      {
        label: 'language.german',
        value: 'German',
        icon: 'language',
      },
      {
        label: 'language.french',
        value: 'French',
        icon: 'language',
      },
      {
        label: 'language.japanese',
        value: 'Japanese',
        icon: 'language',
      },
      {
        label: 'language.korean',
        value: 'Korean',
        icon: 'language',
      },
    ] as BlockOption[],
  },
  {
    label: 'ai.make_longer',
    value: 'make_longer',
    icon: 'subject',
    color: Color.purple,
    options: {
      prompt: 'Make following content longer: [CONTENT]',
    },
    group: 'label.edit',
    tips: 'long',
  },
  {
    label: 'ai.make_shorter',
    value: 'make_shorter',
    icon: 'short_text',
    color: Color.purple,
    options: {
      prompt: 'Make following content shorter: [CONTENT]',
    },
    tips: 'short',
  },
  {
    label: 'ai.change_tone',
    value: 'change_tone',
    icon: 'invert_colors',
    color: Color.purple,
    options: {
      prompt: 'Change tone of the following content to [TONE]: [CONTENT]',
    },
    children: [
      {
        label: 'ai.tone.formal',
        value: 'Formal',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.casual',
        value: 'Casual',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.friendly',
        value: 'Friendly',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.enthusiastic',
        value: 'Enthusiastic',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.authoritative',
        value: 'Authoritative',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.humorous',
        value: 'Humorous',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.inspirational',
        value: 'Inspirational',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.empathetic',
        value: 'Empathetic',
        icon: 'invert_colors',
      },
      {
        label: 'ai.tone.mysterious',
        value: 'Mysterious',
        icon: 'invert_colors',
      },
    ] as BlockOption[],
  },
  // {
  //   label: 'ai.write',
  //   value: 'write',
  //   icon: 'format_list_numbered',
  //   color: Color.purple,
  //   options: {
  //     prompt: 'Improve writing of the following content: [CONTENT]',
  //   },
  //   tips: 'write',
  //   group: 'label.write',
  // },
  {
    label: 'ai.explain',
    value: 'explain',
    icon: 'format_quote_open',
    color: Color.purple,
    options: {
      prompt: 'Improve writing of the following content: [CONTENT]',
    },
    tips: 'explain',
    group: 'label.think',
  },
]

export const AiBlocks: BlockOption[] = [
  {
    label: 'ai.summarize',
    value: 'summarize',
    icon: 'notes',
    color: Color.purple,
    options: {
      prompt: 'Summarize the following content: [CONTENT]',
    },
    group: 'label.suggested',
  },
  {
    label: 'ai.continuation',
    value: 'continuation',
    icon: 'edit_note',
    color: Color.purple,
    options: {
      prompt: 'Continue writing with the content: [CONTENT]',
    },
  },
]
