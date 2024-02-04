import { ipcMain } from 'electron'
import { eventNames } from '@shared/constants'
import { is } from '@electron-toolkit/utils'
import { message } from '@dev'
import { RawDevMessage } from '@shared/types'

let devRendererIsReady = false

export const isDevRendererReady = () => devRendererIsReady
export const onDevRendererIsReady = () => {
  if (!is.dev) return
  ipcMain.handle(eventNames.devMessageRendererReady, (_e, isReady) => {
    devRendererIsReady = isReady
  })
  ipcMain.handle(eventNames.bridgeDevMessage, (_e, args: RawDevMessage) => {
    message(args.type, ...args.message)
  })
}
