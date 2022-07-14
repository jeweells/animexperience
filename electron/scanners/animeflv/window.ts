import { BrowserWindow } from 'electron'
import { requestFromWindow } from '../base'

export const BASE_ORIGIN = 'https://animeflv.net'
export const createAnimeFlvRequest = async (url: string, fnContent: string) => {
    return new Promise((resolve, reject) => {
        const w = new BrowserWindow({
            // width: 1100,
            // height: 700,
            width: 0,
            height: 0,
            frame: false,
            resizable: false,
            opacity: 0,
            focusable: false,

            backgroundColor: '#b0b1a2',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                images: false,
                partition: 'animeflv-session',

                devTools: false,
            },
        })
        w.webContents.session.webRequest.onBeforeRequest(
            {
                urls: ['<all_urls>'],
            },
            (details, callback) => {
                let cancel = false
                const url = new URL(details.url)
                const ANIMEFLV_URL_REGEX = /^((www)?3?\.)?animeflv\.net/gm
                const blackListExt = ['css', 'woff2', 'woff', 'ttf', 'js']
                if (
                    url.protocol !== 'devtools:' &&
                    (ANIMEFLV_URL_REGEX.exec(url.host) === null ||
                        blackListExt.some((ext) => url.pathname.endsWith('.' + ext)))
                ) {
                    console.debug('[ANIMEFLV]', details.url, '(CANCELED)')
                    cancel = true
                } else {
                    console.debug('[ANIMEFLV]', details.url)
                }
                const r = { cancel }
                callback(r)
            },
        )

        w.loadURL(url)
        w.show()
        w.webContents.on('did-finish-load', async () => {
            try {
                resolve(await requestFromWindow(w, fnContent))
                if (process.env.NODE_ENV === 'development') {
                    w.close()
                }
            } catch (e) {
                reject(e)
            } finally {
                if (process.env.NODE_ENV !== 'development') {
                    w.close()
                }
            }
        })
        return w
    })
}
