import { describe, it } from 'vitest'
import { all, common, createLowlight } from 'lowlight'

describe('Code Block', () => {
  it('All Languages', () => {
    const lowlight = createLowlight(all)
    const list = lowlight.listLanguages()
    console.log('All languages', list.length, JSON.stringify(list))
  })

  it('Common Languages', () => {
    const lowlight = createLowlight(common)
    const list = lowlight.listLanguages()
    console.log('Common languages', list.length, JSON.stringify(list))
  })
})
