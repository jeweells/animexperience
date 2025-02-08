import { eventNames } from '@shared/constants'
import { InvokedLink } from '@shared/types'
import * as React from 'react'
import { invokedLink } from '@reducers/invokedLink'
import { rendererInvoke } from '../utils'
import { useAppDispatch } from '~/redux/utils'
import { debug } from '@dev/events'

const ipcRenderer = window.electron.ipcRenderer

export const useInvokedLinks = () => {
  const dispatch = useAppDispatch()
  React.useLayoutEffect(() => {
    const handleInvokedLink = (data: InvokedLink) => {
      debug('Link Invoked with', data)
      switch (data.action) {
        case 'watch':
          dispatch(invokedLink.show('watch'))
          dispatch(invokedLink.watchInvokeLink(data))
          break
      }
    }

    const fn = (_: Electron.IpcRendererEvent, data: InvokedLink) => handleInvokedLink(data)
    rendererInvoke('getInvokedLink', true).then((invokedLink) => {
      if (!invokedLink) return
      handleInvokedLink(invokedLink)
    })
    return ipcRenderer.on(eventNames.linkInvoked, fn)
  }, [])
}
