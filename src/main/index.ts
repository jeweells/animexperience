import { app, BrowserWindow, ipcMain, session } from 'electron'
import moment from 'moment'
import 'moment/locale/es'
import { setupBlocker } from './blocker'
import setupSdk from './sdk'
import { setupStores } from './store'
import { getMainWindow, setMainWindow } from './windows'
import { setupOpenUrl } from './sdk/openUrl'
import { eventNames } from '@shared/constants'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { handleFailedVideoUrls } from './handleFailedVideoUrls'
import { autoUpdater } from 'electron-updater'

moment.locale('es')

if (app.isPackaged) {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
}

setupOpenUrl((invokedLink) => {
  console.debug({ invokedLink })
  getMainWindow()?.webContents.send(eventNames.linkInvoked, invokedLink)
})
// Comment in order to make the React dev tools work
app.commandLine.appendSwitch('disable-site-isolation-trials')

// eslint-disable-next-line no-console
async function createWindow(): Promise<void> {
  console.debug('Creating window')

  await session.defaultSession
    .loadExtension(join(__dirname, './extensions/breakfullscreen/'))
    .then(() => console.debug('[BreakFullscreenExt] Extension loaded'))

  const mainWindow = setMainWindow(
    new BrowserWindow({
      width: 1100,
      height: 700,
      show: false,
      backgroundColor: '#191622',
      frame: false,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false
      }
    })
  )

  let publicPath
  console.debug('Setting open handler')
  mainWindow.webContents.setWindowOpenHandler((d) => {
    console.debug('Denied popup', d.url)
    return {
      action: 'deny'
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
    if (is.dev) {
      mainWindow.webContents.openDevTools({
        mode: 'detach'
      })
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    publicPath = process.env['ELECTRON_RENDERER_URL']
    mainWindow.loadURL(publicPath).then(() => setupBlocker())
  } else {
    publicPath = join(__dirname, '../renderer/index.html')
    mainWindow.loadFile(publicPath).then(() => setupBlocker())
  }
  // Referrer needed to display some players in JKAnime.net
  session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
    console.debug('onBeforeHeaders', details.url)

    if (
      ['https://jkanime.net/', 'https://www3.animeflv.net/', 'https://animeflv.net/'].some((u) =>
        details.url.startsWith(u)
      )
    ) {
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
    }
    return callback({ cancel: false, requestHeaders: details.requestHeaders })
  })

  mainWindow.webContents.setUserAgent(
    mainWindow.webContents
      .getUserAgent()
      .split(' ')
      .filter((x) => !x.includes('animexperience') && !x.includes('Electron'))
      .join(' ')
  )

  handleFailedVideoUrls(session.defaultSession.webRequest)

  mainWindow.on('closed', () => {
    setMainWindow(null)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  console.debug('App is ready')
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.animexperience')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  await createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (is.dev) {
    const installExtension = require('electron-devtools-installer')
    const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installExtension
    installExtension
      .default(REACT_DEVELOPER_TOOLS)
      .then((name) => console.debug(`Added Extension:  ${name}`))
      .catch((err) => console.debug('An error occurred: ', err))
    installExtension
      .default(REDUX_DEVTOOLS)
      .then((name) => console.debug(`Added Extension:  ${name}`))
      .catch((err) => console.debug('An error occurred: ', err))
  }

  if (app.isPackaged) {
    autoUpdater.checkForUpdates().then((result) => {
      console.debug('Updates available!', result)
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

setupSdk()
setupStores()

ipcMain.handle('closeApp', () => {
  app.quit()
})

if (app.isPackaged) {
  autoUpdater.on('update-available', () => {
    autoUpdater.downloadUpdate().then((info) => {
      console.debug('Updated downloaded!', info)
    })
  })
}
