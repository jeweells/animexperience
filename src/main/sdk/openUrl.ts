import { getMainWindow } from '../windows'
import { APP_PROTOCOL } from '../constants'
import { app } from 'electron'
import * as path from 'path'
import { InvokedLink } from '@shared/types'

interface RawQuery {
  ep: number
  u: string
}

const isAction = (s: unknown): s is InvokedLink['action'] =>
  (['watch'] as Array<InvokedLink['action']>).includes(s as InvokedLink['action'])

const isQuery = (query: unknown): query is RawQuery => {
  if (!query) return false
  if (!(typeof query === 'object')) return false
  const queryShape: RawQuery = { ep: 0, u: 'anime-name' }
  return (Object.keys(queryShape) as Array<keyof RawQuery>).every((key) => {
    if (!(key in query)) return false
    const val = query[key as string]
    return typeof val === typeof queryShape[key as keyof RawQuery]
  })
}

const parseLink = (link: string | undefined): InvokedLink | null => {
  console.debug('[InvokedLink] Parsing:', link)
  if (!link) return null
  const parsedUrl = new URL(link)
  const hostname = parsedUrl.hostname
  const query = parsedUrl.searchParams.get('q')
  console.debug('[InvokedLink] Action:', hostname)
  console.debug('[InvokedLink] Query:', query)
  if (!isAction(hostname)) return null
  if (!query) return null
  try {
    const parsedQuery = JSON.parse(Buffer.from(query, 'base64').toString('utf8'))
    console.debug({ parsedQuery })
    if (!isQuery(parsedQuery)) return null

    switch (hostname) {
      case 'watch':
        return {
          action: hostname,
          partialLink: parsedQuery.u,
          episode: parsedQuery.ep
        }
    }
  } catch (e) {
    console.error('Invalid query:', query)
    return null
  }
}

let invokedLink: InvokedLink | null = null

export const getInvokedLink = (consume = false) => {
  try {
    return invokedLink
  } finally {
    if (consume) invokedLink = null
  }
}

const setProtocol = () => {
  if (process.env.NODE_ENV === 'development') {
    if (
      app.isDefaultProtocolClient(APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
    ) {
      return true
    }

    return app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1])
    ])
  }
  return app.isDefaultProtocolClient(APP_PROTOCOL) || app.setAsDefaultProtocolClient(APP_PROTOCOL)
}

export const setupOpenUrl = (onLinking?: (str: InvokedLink) => void) => {
  if (!setProtocol()) {
    console.error(`Failed to set APP_PROTOCOL=${APP_PROTOCOL}`)
    return
  }

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    console.debug('An instance is already running. Closing...')
    app.quit()
  } else {
    const handleProtocolArgs = (argv: string[]) => {
      console.debug('Second instance stopped', argv)
      if (process.platform === 'darwin') return
      const link = argv.find((arg) => arg.startsWith(APP_PROTOCOL + '://'))
      const parsedLink = parseLink(link)
      if (!parsedLink) return
      invokedLink = parsedLink
      onLinking?.(parsedLink)
      const mainWindow = getMainWindow()
      if (!mainWindow) return
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    app.on('second-instance', (_, argv) => {
      handleProtocolArgs(argv)
    })
    handleProtocolArgs(process.argv)
  }
}
