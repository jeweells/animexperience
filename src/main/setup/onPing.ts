import { ipcMain } from 'electron'

// IPC test
export const onPing = () => ipcMain.on('ping', () => console.log('pong'))
