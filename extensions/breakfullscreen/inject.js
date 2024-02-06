let rootWindow = window
while (rootWindow !== rootWindow.parent) {
  rootWindow = rootWindow.parent
}

if (window !== rootWindow) {
  let lastFsElement = null
  Object.defineProperty(Document.prototype, 'fullscreenElement', {
    get() {
      return rootWindow.document.fullscreenElement ? lastFsElement ?? document.body : null
    }
  })

  rootWindow.document.addEventListener('fullscreenchange', (e) => {
    document.dispatchEvent(new CustomEvent(e.type))
  })

  Element.prototype.requestFullscreen = function (options) {
    lastFsElement = this
    const isFullscreen = !!rootWindow.document.fullscreenElement
    if (isFullscreen) return Promise.resolve()
    // if(isFullscreen) {
    //   return rootWindow.document.exitFullscreen();
    // }
    return rootWindow.document.body.requestFullscreen(options)
  }
  document.exitFullscreen = () => {
    lastFsElement = null
    return rootWindow.document.exitFullscreen()
  }
}
