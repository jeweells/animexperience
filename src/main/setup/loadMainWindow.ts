import { BrowserWindow } from 'electron'
import { PUBLIC_PATH, PUBLIC_PATH_IS_FILE } from '../constants'

export const loadMainWindow = async (window: BrowserWindow) => {
  if (PUBLIC_PATH_IS_FILE) return await window.loadFile(PUBLIC_PATH)
  return await window.loadURL(PUBLIC_PATH)
}
