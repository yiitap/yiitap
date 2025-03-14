import { describe, it, expect, vi } from 'vitest'
import { copyToClipboard } from '@/utils'

describe('copyToClipboard', () => {
  it('should use Clipboard API when available', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
    })

    const text = 'Hello, world!'
    await copyToClipboard(text)

    expect(mockWriteText).toHaveBeenCalledWith(text)
  })

  it('should reject when fallback execCommand fails', async () => {
    // Mock Clipboard API unavailable
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    })

    // Mock execCommand
    const mockExecCommand = vi.fn().mockReturnValue(false)
    document.execCommand = mockExecCommand

    const text = 'Hello, world!'

    // Expect rejection due to failure of execCommand
    await expect(copyToClipboard(text)).rejects.toBe(false)
  })
})
