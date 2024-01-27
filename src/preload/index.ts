import { contextBridge, clipboard } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import invokeNames from '../main/invokeNames'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('clipboard', clipboard)
    contextBridge.exposeInMainWorld('invokeNames', invokeNames)
    contextBridge.exposeInMainWorld('currentURL', process.env['ELECTRON_RENDERER_URL'])
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.clipboard = clipboard
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.invokeNames = invokeNames
  // @ts-ignore (define in dts)
  window.currentURL = process.env['ELECTRON_RENDERER_URL']
}
