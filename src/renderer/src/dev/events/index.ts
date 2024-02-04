import { DevMessageType } from '@shared/types'
import { addMessage } from '~/src/dev/hooks/useMessages'

export const message = (type: DevMessageType, ...args) => {
  addMessage({
    message: args,
    type
  })
}

export const info = message.bind(null, 'info')
export const debug = message.bind(null, 'debug')
export const error = message.bind(null, 'error')
export const warn = message.bind(null, 'warn')
