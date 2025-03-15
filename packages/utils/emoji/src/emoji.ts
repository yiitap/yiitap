/**
 * Emoji utility
 */
// @ts-ignore
import emojiGroups from './data/data-by-group.json'

const emojiList = () => {
  let list = []
  emojiGroups.map((group) => {
    // @ts-ignore
    list = list.concat(group.emojis)
  })
  return list
}

const filterEmojiGroups = (query: string) => {
  const list = []
  emojiGroups.map((group) => {
    const emojis = group.emojis.filter(
      (item) => item.name.indexOf(query.toLowerCase()) >= 0
    )
    // @ts-ignore
    list.push({
      name: group.name,
      slug: group.slug,
      emojis: emojis,
    })
  })
  return list
}

const emojiGroupIcons = {
  smileys_emotion: 'emotion',
  people_body: 'face',
  animals_nature: 'psychiatry',
  food_drink: 'carrot',
  travel_places: 'airplane',
  activities: 'sports_soccer',
  objects: 'objects',
  symbols: 'yin_yang',
  flags: 'flag',
}

export { emojiGroups, emojiList, filterEmojiGroups, emojiGroupIcons }
