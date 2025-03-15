import { describe, it, expect } from 'vitest'
import { emojiGroups } from '../index'

describe('EmojiUtil Test Suite', () => {
  it('emojiGroups', () => {
    // console.log('emojiGroups', emojiGroups)
    expect(emojiGroups.length).toBe(9)
  })
})
