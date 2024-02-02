import { BrowserWindow } from 'electron'

export const setWindowOpenHanlder = (window: BrowserWindow) => {
  window.webContents.setWindowOpenHandler((d) => {
    console.debug('Denied popup', d.url)
    return {
      action: 'deny'
    }
  })
}
