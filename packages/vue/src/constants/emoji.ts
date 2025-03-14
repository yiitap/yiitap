/**
 * Emoji
 */
import emojiGroups from '../data/emoji/data-by-group.json'

const emojiList = () => {
  let list = []
  emojiGroups.map((group) => {
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
    list.push({
      name: group.name,
      slug: group.slug,
      emojis: emojis,
    })
  })
  return list
}

const emojiGroupIcons: Indexable = {
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
