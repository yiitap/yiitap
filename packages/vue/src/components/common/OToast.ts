import tippy from 'tippy.js'
import type { Instance, Props } from 'tippy.js'

class ToastManager {
  private instances: Instance[] = []

  error(message: string, duration = 3000) {
    this.show(message, 'error', duration)
  }

  info(message: string, duration = 3000) {
    this.show(message, 'info', duration)
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration)
  }

  warning(message: string, duration = 3000) {
    this.show(message, 'warning', duration)
  }

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 3000
  ) {
    const template = `
      <div class="o-toast ${type}">
        <i class="yiitip-icon icon-${type}"></i>
        <span class="message">${message}</span>
      </div>
    `

    const instance = tippy(document.body, {
      arrow: false,
      allowHTML: true,
      placement: 'top',
      theme: 'toast-theme',
      trigger: 'manual',
      appendTo: () => document.body,
      animation: 'shift-away',
      duration: 500,
      content: template,
      onHidden: (instance) => {
        instance.destroy()
        this.instances = this.instances.filter((i) => i !== instance)
      },
    })
    instance.show()
    if (duration > 0) {
      setTimeout(() => {
        instance.hide()
      }, duration)
    }

    this.instances.push(instance)
    this.repositionToasts()
  }

  private repositionToasts() {
    this.instances.forEach((instance, index) => {
      instance.setProps({
        placement: 'bottom',
        offset: [0, index * 55],
      })
    })
  }
}

export const OToast = new ToastManager()
