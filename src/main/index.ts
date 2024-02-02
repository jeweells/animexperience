import { app, ipcMain } from 'electron'
import moment from 'moment'
import 'moment/locale/es'
import setupSdk from './sdk'
import { setupStores } from './store'
import { getMainWindow } from './windows'
import { setupOpenUrl } from './sdk/openUrl'
import { eventNames } from '@shared/constants'
import { electronApp } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import { createMainWindow } from './setup/createMainWindow'
import { onBrowserWindowCreated } from './setup/onBrowserWindowCreated'
import { onPing } from './setup/onPing'
import { onActivate } from './setup/onActivate'
import { checkForUpdates } from './setup/checkForUpdates'

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  console.debug('App is ready')
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.animexperience')
  onBrowserWindowCreated()
  onPing()
  await createMainWindow()
  onActivate()
  checkForUpdates()
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
