import { BrowserWindow, ipcMain } from 'electron'
import { eventNames } from '@shared/constants'
import { getMainWindow } from '../windows'

export const onFullscreen = (window: BrowserWindow) => {
  window.on('enter-full-screen', () => {
    window.webContents.executeJavaScript(
      '!document.fullscreenElement && document.body.requestFullscreen();',
      true
    )
  })
  window.on('leave-full-screen', () => {
    window.webContents.executeJavaScript(
      'document.fullscreenElement && document.exitFullscreen();',
      true
    )
  })

  ipcMain.handle(eventNames.setFullscreen, (_, value) => {
    getMainWindow()?.setFullScreen(value)
  })
}
