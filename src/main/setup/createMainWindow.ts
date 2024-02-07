import { setMainWindow } from '../windows'
import { join } from 'path'
import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { loadExtensions } from './loadExtensions'
import { setWindowOpenHanlder } from './setWindowOpenHanlder'
import { onReadyToShow } from './onReadyToShow'
import { onBeforeSendHeaders } from './onBeforeSendHeaders'
import { onWebRequestCompleted } from './onWebRequestCompleted'
import { loadMainWindow } from './loadMainWindow'
import { setupBlocker } from '../blocker'
import { setUserAgent } from './setUserAgent'
import { onClosed } from './onClosed'
import { debug } from '@dev'
import { onFullscreen } from './onFullscreen'

export async function createMainWindow(): Promise<void> {
  debug('Creating window')
  await loadExtensions()
  const window = buildWindow()
  onFullscreen(window)
  setWindowOpenHanlder(window)
  onReadyToShow(window)
  onBeforeSendHeaders()
  onWebRequestCompleted()
  await loadMainWindow(window)
  await setupBlocker()
  setUserAgent(window)
  onClosed(window)
}

const buildWindow = () =>
  setMainWindow(
    new BrowserWindow({
      title: 'Animexperience',
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
