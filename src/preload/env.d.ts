import { ElectronAPI } from '@electron-toolkit/preload'
import { clipboard } from 'electron'
import invokeNames from '../main/invokeNames'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    invokeNames: typeof invokeNames
    currentURL: string
    clipboard: typeof clipboard
    setFullscreen: (value: boolean) => void
  }
}
