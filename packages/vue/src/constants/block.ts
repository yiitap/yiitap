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
    icon: 'format_h1',
    color: Color.blue,
    style: true,
    options: { level: 1 },
  },
  {
    label: 'editor.heading2',
    value: 'heading',
    icon: 'format_h2',
    color: Color.blue,
    style: true,
    options: { level: 2 },
  },
  {
    label: 'editor.heading3',
    value: 'heading',
    icon: 'format_h3',
    color: Color.blue,
    style: true,
    options: { level: 3 },
  },
  {
    label: 'editor.todoList',
    value: 'taskList',
    icon: 'check_box',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.unorderedList',
    value: 'bulletList',
    icon: 'format_list_bulleted',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.orderedList',
    value: 'orderedList',
    icon: 'format_list_numbered',
    color: Color.indigo,
    style: true,
  },
  {
    label: 'editor.blockquote',
    value: 'blockquote',
    icon: 'format_quote_open',
    color: Color.brown,
    style: true,
  },
  {
    label: 'editor.codeBlock',
    value: 'codeBlock',
    icon: 'code_braces',
    color: Color.lightBlue,
    style: true,
  },
  {
    label: 'editor.horizontal',
    value: 'horizontalRule',
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
    label: 'editor.delete',
    value: 'delete',
    icon: 'delete',
    tips: 'Ctrl+D',
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
    value: 'palette',
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
    icon: 'title', // title, format_paragraph, local_parking
    color: Color.purple,
    style: true,
    group: 'label.suggested',
  },
  {
    label: 'ai.fix_spelling_grammar',
    value: 'fix_spelling_grammar',
    icon: 'format_h1',
    color: Color.purple,
    style: true,
    options: { level: 1 },
  },
  {
    label: 'ai.translate',
    value: 'translate',
    icon: 'format_h2',
    color: Color.purple,
    style: true,
    children: [
      {
        label: 'language.chinese_simplified',
        value: 'chinese_simplified',
        icon: 'language',
      },
      {
        label: 'language.chinese_traditional',
        value: 'chinese_traditional',
        icon: 'language',
      },
      {
        label: 'language.german',
        value: 'german',
        icon: 'language',
      },
      {
        label: 'language.french',
        value: 'french',
        icon: 'language',
      },
      {
        label: 'language.japanese',
        value: 'japanese',
        icon: 'language',
      },
      {
        label: 'language.korean',
        value: 'korean',
        icon: 'language',
      },
    ] as BlockOption[],
  },
  {
    label: 'ai.make_longer',
    value: 'make_longer',
    icon: 'format_h3',
    color: Color.purple,
    style: true,
    options: { level: 3 },
    group: 'label.edit',
  },
  {
    label: 'ai.make_shorter',
    value: 'make_shorter',
    icon: 'check_box',
    color: Color.purple,
    style: true,
  },
  {
    label: 'ai.change_tone',
    value: 'change_tone',
    icon: 'format_list_bulleted',
    color: Color.purple,
    style: true,
  },
  {
    label: 'ai.write',
    value: 'write',
    icon: 'format_list_numbered',
    color: Color.purple,
    style: true,
    group: 'label.write',
  },
  {
    label: 'ai.explain',
    value: 'explain',
    icon: 'format_quote_open',
    color: Color.purple,
    style: true,
    group: 'label.think',
  },
]

export const AiBlocks: BlockOption[] = [
  {
    label: 'ai.improve_writing',
    value: 'improve_writing',
    icon: 'title', // title, format_paragraph, local_parking
    color: Color.purple,
    style: true,
    group: 'label.suggested',
  },
  {
    label: 'ai.fix_spelling_grammar',
    value: 'fix_spelling_grammar',
    icon: 'format_h1',
    color: Color.purple,
    style: true,
    options: { level: 1 },
  },
  {
    label: 'ai.translate',
    value: 'translate',
    icon: 'format_h2',
    color: Color.purple,
    style: true,
    children: [
      {
        label: 'language.chinese_simplified',
        value: 'chinese_simplified',
        icon: 'language',
      },
      {
        label: 'language.chinese_traditional',
        value: 'chinese_traditional',
        icon: 'language',
      },
      {
        label: 'language.german',
        value: 'german',
        icon: 'language',
      },
      {
        label: 'language.french',
        value: 'french',
        icon: 'language',
      },
      {
        label: 'language.japanese',
        value: 'japanese',
        icon: 'language',
      },
      {
        label: 'language.korean',
        value: 'korean',
        icon: 'language',
      },
    ] as BlockOption[],
  },
  {
    label: 'ai.make_longer',
    value: 'make_longer',
    icon: 'format_h3',
    color: Color.purple,
    style: true,
    options: { level: 3 },
    group: 'label.edit',
  },
  {
    label: 'ai.make_shorter',
    value: 'make_shorter',
    icon: 'check_box',
    color: Color.purple,
    style: true,
  },
]
