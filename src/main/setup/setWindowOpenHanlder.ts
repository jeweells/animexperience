import { info } from '@dev'
import { BrowserWindow } from 'electron'

export const setWindowOpenHanlder = (window: BrowserWindow) => {
  window.webContents.setWindowOpenHandler((d) => {
    info('Denied popup', d.url)
    return {
      action: 'deny'
    }
  })
}
