let mainWindow: Electron.BrowserWindow | null

export const setMainWindow = <T extends Electron.BrowserWindow | null>(window: T): T => {
  mainWindow = window
  return window
}

export const getMainWindow = (): Electron.BrowserWindow | null => mainWindow
