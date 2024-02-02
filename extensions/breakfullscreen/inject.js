console.log('Extension added jejej')
let rootWindow = window
while (rootWindow !== rootWindow.parent) {
  rootWindow = rootWindow.parent
}

if (window !== rootWindow) {
  console.log('Root Window', rootWindow.location.href, window.location.href)
  let lastFsElement = null
  Object.defineProperty(Document.prototype, 'fullscreenElement', {
    get() {
      return rootWindow.document.fullscreenElement ? lastFsElement : null
    }
  })
  rootWindow.document.addEventListener('fullscreenchange', (e) => {
    document.dispatchEvent(new CustomEvent(e.type))
  })
  Element.prototype.requestFullscreen = function (options) {
    lastFsElement = this
    const isFullscreen = !!rootWindow.document.fullscreenElement
    console.debug('Requesting fs', isFullscreen, lastFsElement)
    // if(isFullscreen) {
    //   return rootWindow.document.exitFullscreen();
    // }
    return rootWindow.document.body.requestFullscreen(options)
  }
  document.exitFullscreen = () => {
    lastFsElement = null
    console.debug('Exiting')
    return rootWindow.document.exitFullscreen()
  }
}
