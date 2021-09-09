import { app, BrowserWindow, ipcMain, session } from 'electron'
import installExtension, {
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} from 'electron-devtools-installer'
import { setupBlocker } from './blocker'
import setupSdk from './sdk'
import { setupStores } from './store'
import moment from 'moment'
import 'moment/locale/es'

import serve from 'electron-serve'
moment.locale('es')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize()

if (process.env.NODE_ENV !== 'development') serve({ directory: 'dist/renderer' })
// Comment in order to make the react dev tools work
app.commandLine.appendSwitch('disable-site-isolation-trials')
let mainWindow: Electron.BrowserWindow | null
// eslint-disable-next-line no-console
async function createWindow() {
    console.debug('Creating window')
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 700,
        backgroundColor: '#191622',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    })
    const publicPath =
        process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'app://-'
    console.debug('Public path:', publicPath)
    console.debug('Setting open handler')
    mainWindow.webContents.setWindowOpenHandler((d) => {
        console.debug('Denied popup', d.url)
        return {
            action: 'deny',
        }
    })

    // Referrer needed to display some players in JKAnime.net
    session.defaultSession.webRequest.onBeforeSendHeaders(
        {
            urls: ['https://jkanime.net/*'],
        },
        (details, callback) => {
            const url = new URL(details.url)
            details.requestHeaders.Origin = url.origin
            if (
                !details.url.includes(publicPath) &&
                details.requestHeaders.Referer &&
                details.requestHeaders.Referer.includes(publicPath)
            ) {
                details.requestHeaders.Referer = details.url
                console.debug('ADDED REFERER FOR', details.url)
            }
            // eslint-disable-next-line standard/no-callback-literal
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        },
    )

    if (process.env.NODE_ENV === 'development') {
        const window = mainWindow
        mainWindow.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools({
                mode: 'detach',
            })
        })
    }
    mainWindow.loadURL(publicPath).then(() => setupBlocker())

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
    .whenReady()
    .then(() => {
        console.debug('App is ready')
        if (process.env.NODE_ENV === 'development') {
            installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.debug(`Added Extension:  ${name}`))
                .catch((err) => console.debug('An error occurred: ', err))
            installExtension(REDUX_DEVTOOLS)
                .then((name) => console.debug(`Added Extension:  ${name}`))
                .catch((err) => console.debug('An error occurred: ', err))
        }
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.allowRendererProcessReuse = true
setupSdk()
setupStores()

ipcMain.handle('closeApp', () => {
    mainWindow?.close()
})
