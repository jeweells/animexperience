import { ipcMain } from 'electron'
import { eventNames } from '@shared/constants'
import { is } from '@electron-toolkit/utils'

let devRendererIsReady = false

export const isDevRendererReady = () => devRendererIsReady
export const onDevRendererIsReady = () => {
  if (!is.dev) return
  ipcMain.handle(eventNames.devMessageRendererReady, (_e, isReady) => {
    devRendererIsReady = isReady
  })
}
