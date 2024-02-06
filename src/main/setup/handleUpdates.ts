import { autoUpdater } from 'electron-updater'
import { app, ipcMain } from 'electron'
import { getMainWindow } from '../windows'
import { eventNames } from '@shared/constants'

export const handleUpdates = () => {
  if (!app.isPackaged) return
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  void autoUpdater.checkForUpdates()

  setInterval(() => {
    void autoUpdater.checkForUpdates()
  }, 30 * 60_000)

  autoUpdater.on('update-available', (result) => {
    getMainWindow()?.webContents.send(eventNames.update.found, { version: result.version })
  })

  ipcMain.handle(eventNames.update.install, () => {
    autoUpdater.quitAndInstall(false)
  })

  ipcMain.handle(eventNames.update.download, () => {
    autoUpdater.downloadUpdate().then(() => {
      getMainWindow()?.webContents.send(eventNames.update.finished)
    })
  })

  autoUpdater.on('download-progress', (e) => {
    getMainWindow()?.webContents.send(eventNames.update.progress, e)
  })
}
