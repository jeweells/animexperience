import { getDevWindow } from '../windows'
import { eventNames } from '@shared/constants'
import { DevMessageType, ForcedAny, RawDevMessage } from '@shared/types'
import { isDevRendererReady } from '../setup/onDevRendererIsReady'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

const defferMessageUntilDevWindowIsCreated = <T extends (...args: ForcedAny) => void>(fn: T) => {
  return ((...args) => {
    if (app.isPackaged) return
    if (!is.dev) return
    if (isDevRendererReady()) {
      fn(...args)
    } else {
      const t = setInterval(() => {
        if (!isDevRendererReady()) return
        clearInterval(t)
        fn(...args)
      }, 500)
    }
  }) as T
}

export const message = defferMessageUntilDevWindowIsCreated(
  (type: DevMessageType, ...message: ForcedAny[]) => {
    const w = getDevWindow()
    if (w?.isDestroyed()) return
    return w?.webContents.send(eventNames.devMessage, {
      type,
      message
    } as RawDevMessage)
  }
)

export const warn = message.bind(null, 'warn')
export const info = message.bind(null, 'info')
export const error = message.bind(null, 'error')
export const debug = message.bind(null, 'debug')
