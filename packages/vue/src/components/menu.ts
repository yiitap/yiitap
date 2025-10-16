import OSimpleCommandBtn from './buttons/OSimpleCommandBtn.vue'
import OAiBtn from './buttons/OAiBtn.vue'
import OAlignDropdown from './buttons/OAlignDropdown.vue'
import OAlignGroup from './buttons/OAlignGroup.vue'
import OBackColorDropdown from './buttons/OBackColorDropdown.vue'
import ODetailsBtn from './buttons/ODetailsBtn.vue'
import OEmojiBtn from './buttons/OEmojiBtn.vue'
import OFontFamilyDropdown from './buttons/OFontFamilyDropdown.vue'
import OForeColorDropdown from './buttons/OForeColorDropdown.vue'
import OHeadingDropdown from './buttons/OHeadingDropdown.vue'
import OListDropdown from './buttons/OListDropdown.vue'
import OListGroup from './buttons/OListGroup.vue'
import OLinkBtn from './buttons/OLinkBtn.vue'
import OLinkEditBtn from './buttons/OLinkEditBtn.vue'
import OLinkOpenBtn from './buttons/OLinkOpenBtn.vue'
import OMoreBubble from './buttons/OMoreBubble.vue'
import OStyleDropdown from './buttons/OStyleDropdown.vue'
import OTableBtn from './buttons/OTableBtn.vue'
import OTableGroup from './buttons/OTableGroup.vue'
import OTextColorDropdown from './buttons/OTextColorDropdown.vue'
import OTextFormatDropdown from './buttons/OTextFormatDropdown.vue'

/**
 * Command component except for simple commands
 */
const CommandComponents: Indexable = {
  ai: OAiBtn,
  'align-dropdown': OAlignDropdown,
  'align-group': OAlignGroup,
  'back-color': OBackColorDropdown,
  details: ODetailsBtn,
  'font-family': OFontFamilyDropdown,
  'fore-color': OForeColorDropdown,
  heading: OHeadingDropdown,
  // 'indent-dropdown': 'o-indent-dropdown',
  // 'line-height': 'o-line-height-dropdown',
  'list-dropdown': OListDropdown,
  'list-group': OListGroup,
  link: OLinkBtn,
  'link-edit': OLinkEditBtn,
  'link-open': OLinkOpenBtn,
  // 'image-settings': 'o-image-settings-btn',
  emoji: OEmojiBtn,
  more: OMoreBubble,
  // 'node': 'o-node-btn',
  // 'node-dropdown': 'o-node-dropdown',
  'style-dropdown': OStyleDropdown,
  table: OTableBtn,
  'table-group': OTableGroup,
  'text-color-dropdown': OTextColorDropdown,
  'text-format-dropdown': OTextFormatDropdown,
}

export const getComponent = (name: string) => {
  return CommandComponents[name] || OSimpleCommandBtn
}
