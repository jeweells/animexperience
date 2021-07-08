import '@babel/polyfill'
import { app, BrowserWindow, ipcMain, session } from 'electron'
import installExtension, {
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} from 'electron-devtools-installer'
import * as path from 'path'
import * as url from 'url'
import { setupBlocker } from './blocker'
import setupSdk from './sdk'
import { setupStores } from './store'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize()

// Comment in order to make the react dev tools work
app.commandLine.appendSwitch('disable-site-isolation-trials')
let mainWindow: Electron.BrowserWindow | null

async function createWindow() {
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
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:4000'
            : path.join(__dirname, 'renderer')
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
    await setupBlocker()

    if (process.env.NODE_ENV === 'development') {
        const window = mainWindow
        mainWindow.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools({
                mode: 'detach',
            })
        })

        mainWindow.loadURL(publicPath)
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(publicPath, 'index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        )
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
    .whenReady()
    .then(() => {
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
