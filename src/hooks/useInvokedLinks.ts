import { ipcRenderer } from 'electron'
import eventNames from '../../electron/eventNames'
import { InvokedLink } from '../../electron/sdk/openUrl'
import React from 'react'
import { invokedLink } from '../../redux/reducers/invokedLink'
import { rendererInvoke } from '../utils'
import { useAppDispatch } from '../../redux/utils'

export const useInvokedLinks = () => {
    const dispatch = useAppDispatch()
    React.useLayoutEffect(() => {
        const handleInvokedLink = (data: InvokedLink) => {
            console.debug('Link Invoked with', data)
            switch (data.action) {
                case 'watch':
                    dispatch(invokedLink.show('watch'))
                    dispatch(invokedLink.watchInvokeLink(data))
                    break
            }
        }

        const fn = (e: Electron.IpcRendererEvent, data: InvokedLink) =>
            handleInvokedLink(data)
        rendererInvoke('getInvokedLink', true).then((invokedLink) => {
            if (!invokedLink) return
            handleInvokedLink(invokedLink)
        })
        ipcRenderer.on(eventNames.linkInvoked, fn)
        return () => {
            ipcRenderer.removeListener(eventNames.linkInvoked, fn)
        }
    }, [])
}
