import { createMainWindow } from './createMainWindow'
import { app, BrowserWindow } from 'electron'

export const onActivate = () => {
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) void createMainWindow()
  })
}
