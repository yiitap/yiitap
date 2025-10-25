import { computed, inject } from 'vue'

export default function () {
  const commonDownload = (type: string, fileName: string, text: string) => {
    const options = {
      type: 'text/plain',
    }
    switch (type) {
      case 'svg':
        options.type = 'image/svg+xml;charset=utf-8'
        break
      default:
        break
    }
    const blob = new Blob([text], options)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    commonDownload,
  }
}
