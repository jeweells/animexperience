import { info } from '@dev'
import { ipcMain } from 'electron'

// IPC test
export const onPing = () => ipcMain.on('ping', () => info('pong'))
