import { BrowserWindow } from 'electron'

export const setUserAgent = (window: BrowserWindow) => {
  window.webContents.setUserAgent(
    window.webContents
      .getUserAgent()
      .split(' ')
      .filter((x) => !x.includes('animexperience') && !x.includes('Electron'))
      .join(' ')
  )
}
