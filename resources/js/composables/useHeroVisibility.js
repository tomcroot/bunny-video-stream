import { ref } from 'vue'

export function useHeroVisibility({
  hideDelay = 10000, // ms
} = {}) {
  const visible = ref(true)
  let hideTimer = null

  const show = () => {
    visible.value = true
    clearTimeout(hideTimer)
  }

  const scheduleHide = () => {
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      visible.value = false
    }, hideDelay)
  }

  const onPlay = () => {
    scheduleHide()
  }

  const onPause = () => {
    show()
  }

  const onUserIntent = () => {
    show()
    scheduleHide()
  }

  const reset = () => {
    show()
    clearTimeout(hideTimer)
  }

  return {
    visible,
    onPlay,
    onPause,
    onUserIntent,
    reset,
  }
}
