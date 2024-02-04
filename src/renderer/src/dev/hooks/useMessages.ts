import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DevMessage } from '../types'
import moment from 'moment'
import { ForcedAny, RawDevMessage } from '@shared/types'
import { v4 as uuidv4 } from 'uuid'

type State = {
  messages: DevMessage[]
  focusedMessage: null | string
  indexMapByType: Record<DevMessage['type'], number[]>
}

export const useMessages = create<State>()(
  immer<State>(() => ({
    messages: [],
    focusedMessage: null,
    indexMapByType: {
      debug: [],
      error: [],
      info: [],
      warn: []
    }
  }))
)

export const set = useMessages.setState.bind(useMessages)
export const get = useMessages.getState.bind(useMessages)

const MAX_MESSAGES = 5000

useMessages.subscribe((state, prevState) => {
  if (state.messages === prevState.messages) return
  set((state) => {
    Object.keys(state.indexMapByType).forEach((key) => {
      state.indexMapByType[key] = []
    })
    state.messages.forEach((message, index) => {
      state.indexMapByType[message.type].push(index)
    })
  })
})

const delay = 250
const groupMessages = (messages: ForcedAny[]) =>
  messages.reduce((acc, curr) => {
    if (typeof curr === 'string' && typeof acc[acc.length - 1] === 'string') {
      acc[acc.length - 1] += ' ' + curr
    } else {
      acc.push(curr)
    }
    return acc
  }, [])

const _addMessage = (messages: DevMessage[]) => {
  set((state) => {
    state.messages.unshift(...messages)

    if (state.messages.length > MAX_MESSAGES)
      state.messages.splice(MAX_MESSAGES, state.messages.length - MAX_MESSAGES)
  })
}

export const addMessage = (() => {
  let queuedMessages: DevMessage[] = []
  let ready = true
  return (message: RawDevMessage) => {
    queuedMessages.push({
      ...message,
      id: uuidv4(),
      message: groupMessages(message.message),
      at: moment()
    })
    if (!ready) return
    _addMessage(queuedMessages)
    ready = false
    queuedMessages = []
    setTimeout(() => {
      if (queuedMessages.length) _addMessage(queuedMessages)
      ready = true
      queuedMessages = []
    }, delay)
  }
})()

export const focusMessage = (id: string) => {
  set((state) => {
    state.focusedMessage = id
  })
}
export const removeFocusedMessage = () => {
  set((state) => {
    state.focusedMessage = null
  })
}
