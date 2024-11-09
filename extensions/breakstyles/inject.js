{
  let rootWindow = window
  while (rootWindow !== rootWindow.parent) {
    rootWindow = rootWindow.parent
  }

  if (window !== rootWindow) {
    const style = document.createElement('style')
    // language=css
    style.innerHTML = `
      * {
        pointer-events: none !important;
        transition: none !important;
        user-select: none !important;
      }

     *:not(:has(video)):not(video) {
        position: fixed !important;
        z-index: -10000 !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        border: 0 !important;
        outline: none !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        clip-path: inset(100%) !important;
        clip: rect(0 0 0 0) !important;
        top: -10000px;
        left: -10000px;
        pointer-events: none !important;
        user-select: none !important;
     }
     video {
        pointer-events: none !important;
        position: fixed !important;
        z-index: 10000000000 !important;
        width: 100vw !important;
        height: 100vh !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        overflow: visible !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        inset: 0 !important;
        outline: none !important;
        border-radius: 0 !important;
        transition: none !important;
        user-select: none !important;
     }
  `
    document.body.appendChild(style)
    document.head.appendChild(style)
  }
}
