import { autoUpdater } from 'electron-updater'
import { app } from 'electron'
import { info } from '@dev'

export const checkForUpdates = () => {
  if (!app.isPackaged) return
  autoUpdater.checkForUpdates().then((result) => {
    info('Updates available!', result)
  })
}
