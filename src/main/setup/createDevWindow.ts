import { join } from 'path'
import { app, BrowserWindow, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { setDevWindow } from '../windows'
import contextMenu from 'electron-context-menu'

const buildWindow = () => {
  const bounds = screen.getAllDisplays().slice(-1)[0].bounds
  return setDevWindow(
    new BrowserWindow({
      ...bounds,
      backgroundColor: '#191622',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false
      }
    })
  )
}

export const createDevWindow = () => {
  if (app.isPackaged) return
  if (!is.dev) return null
  const window = buildWindow()
  window.maximize()
  contextMenu({
    window
  })
  return window
}
