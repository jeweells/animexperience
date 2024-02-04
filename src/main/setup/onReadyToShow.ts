import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'

export const onReadyToShow = (window: BrowserWindow) => {
  window.on('ready-to-show', () => {
    window.maximize()
    window.show()
    if (is.dev) {
      window.webContents.openDevTools({
        mode: 'right'
      })
    }
  })
}
