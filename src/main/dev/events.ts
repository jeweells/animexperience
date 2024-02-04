import { getDevWindow } from '../windows'
import { eventNames } from '@shared/constants'
import { DevMessageType, ForcedAny, RawDevMessage } from '@shared/types'
import { isDevRendererReady } from '../setup/onDevRendererIsReady'

const defferMessageUntilDevWindowIsCreated = <T extends (...args: ForcedAny) => void>(fn: T) => {
  return ((...args) => {
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

const message = defferMessageUntilDevWindowIsCreated(
  (type: DevMessageType, ...message: ForcedAny[]) => {
    return getDevWindow()?.webContents.send(eventNames.devMessage, {
      type,
      message
    } as RawDevMessage)
  }
)

export const warn = message.bind(null, 'warn')
export const info = message.bind(null, 'info')
export const error = message.bind(null, 'error')
export const debug = message.bind(null, 'debug')
