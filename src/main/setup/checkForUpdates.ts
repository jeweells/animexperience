import { autoUpdater } from 'electron-updater'
import { app } from 'electron'

export const checkForUpdates = () => {
  if (!app.isPackaged) return
  autoUpdater.checkForUpdates().then((result) => {
    console.debug('Updates available!', result)
  })
}
