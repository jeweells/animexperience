import { BrowserWindow } from 'electron'
import { setMainWindow } from '../windows'

export const onClosed = (window: BrowserWindow) => {
  window.on('closed', () => {
    setMainWindow(null)
  })
}
