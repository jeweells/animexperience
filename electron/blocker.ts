import { ElectronBlocker, fullLists, Request } from '@cliqz/adblocker-electron'
import { session } from 'electron'
import { promises as fs } from 'fs'
import fetch from 'node-fetch'

export const setupBlocker = async () => {
    const blocker = await ElectronBlocker.fromLists(
        fetch,
        fullLists,
        {
            enableCompression: true,
        },
        {
            path: 'engine.bin',
            read: fs.readFile,
            write: fs.writeFile,
        },
    )

    blocker.enableBlockingInSession(session.defaultSession)

    blocker.on('request-blocked', (request: Request) => {
        console.debug('blocked', request.tabId, request.url)
    })

    blocker.on('request-redirected', (request: Request) => {
        console.debug('redirected', request.tabId, request.url)
    })

    blocker.on('request-whitelisted', (request: Request) => {
        console.debug('whitelisted', request.tabId, request.url)
    })

    blocker.on('csp-injected', (request: Request) => {
        console.debug('csp', request.url)
    })

    blocker.on('script-injected', (script: string, url: string) => {
        console.debug('script', script.length, url)
    })

    blocker.on('style-injected', (style: string, url: string) => {
        console.debug('style', style.length, url)
    })
}
