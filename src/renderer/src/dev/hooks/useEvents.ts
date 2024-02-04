import { useLayoutEffect } from 'react'
import { eventNames } from '@shared/constants'
import { addMessage } from '~/src/dev/hooks/useMessages'
import { RawDevMessage } from '@shared/types'

export const useEvents = () => {
  useLayoutEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      eventNames.devMessage,
      (_info, message: RawDevMessage) => {
        addMessage(message)
      }
    )

    void window.electron.ipcRenderer.invoke(eventNames.devMessageRendererReady, true)

    return () => {
      unsubscribe()
      void window.electron.ipcRenderer.invoke(eventNames.devMessageRendererReady, false)
    }
  }, [])
}
