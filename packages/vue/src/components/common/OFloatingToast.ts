import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/dom'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastInstance {
  el: HTMLElement
  cleanup: () => void
  type: ToastType
  duration: number
}

class ToastManager {
  private instances: ToastInstance[] = []

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

  show(message: string, type: ToastType = 'info', duration = 3000) {
    const toast = document.createElement('div')
    toast.className = `o-toast ${type}`
    toast.innerHTML = `
      <i class="yiitip-icon icon-${type}"></i>
      <span class="message">${message}</span>
    `
    toast.style.position = 'absolute'
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    toast.style.opacity = '0'
    toast.style.zIndex = '9999'

    document.body.appendChild(toast)

    const cleanup = autoUpdate(document.body, toast, () => {
      computePosition(document.body, toast, {
        placement: 'bottom',
        middleware: [offset(this.instances.length * 15), flip(), shift()],
      }).then(({ x, y }) => {
        Object.assign(toast.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    })

    // 动画显示
    requestAnimationFrame(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateY(0)'
    })

    const instance: ToastInstance = { el: toast, cleanup, type, duration }
    this.instances.push(instance)
    this.repositionToasts()

    if (duration > 0) {
      setTimeout(() => this.hide(instance), duration)
    }
  }

  private hide(instance: ToastInstance) {
    const { el } = instance
    el.style.opacity = '0'
    el.style.transform = 'translateY(-10px)'
    setTimeout(() => {
      instance.cleanup()
      el.remove()
      this.instances = this.instances.filter((i) => i !== instance)
      this.repositionToasts()
    }, 300)
  }

  private repositionToasts() {
    this.instances.forEach((instance, index) => {
      const { el } = instance
      computePosition(document.body, el, {
        placement: 'bottom',
        middleware: [offset(index * 55), flip(), shift()],
      }).then(({ x, y }) => {
        Object.assign(el.style, { left: `${x}px`, top: `${y}px` })
      })
    })
  }
}

export const OFloatingToast = new ToastManager()
