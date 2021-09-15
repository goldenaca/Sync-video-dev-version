let listeners = []

export const addListener = listener => listeners.push(listener)

export const removeListener = listenerToRemove => {
  listeners = listeners.filter(listener => listener !== listenerToRemove)
}

window.onYouTubeIframeAPIReady = () => {
  listeners.forEach(listener => {
    listener(true)
  })
}
