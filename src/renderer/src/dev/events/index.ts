import { DevMessageType, RawDevMessage } from '@shared/types'
import { eventNames } from '@shared/constants'

export const message = (type: DevMessageType, ...args) => {
  void window.electron.ipcRenderer.invoke(eventNames.bridgeDevMessage, {
    message: [...args, { $stack: new Error().stack }],
    type
  } as RawDevMessage)
}

export const info = message.bind(null, 'info')
export const debug = message.bind(null, 'debug')
export const error = message.bind(null, 'error')
export const warn = message.bind(null, 'warn')
