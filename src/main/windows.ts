let mainWindow: Electron.BrowserWindow | null
let devWindow: Electron.BrowserWindow | null

export const setMainWindow = <T extends Electron.BrowserWindow | null>(window: T): T => {
  mainWindow = window
  return window
}
export const setDevWindow = <T extends Electron.BrowserWindow | null>(window: T): T => {
  devWindow = window
  return window
}

export const getMainWindow = (): Electron.BrowserWindow | null => mainWindow

export const getDevWindow = (): Electron.BrowserWindow | null => devWindow
