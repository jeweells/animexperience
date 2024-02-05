import { is } from '@electron-toolkit/utils'
import { join, resolve } from 'path'
import { app } from 'electron'

export const APP_PROTOCOL = 'animexp'

export const PUBLIC_PATH_IS_FILE = !(is.dev && process.env['ELECTRON_RENDERER_URL'])
export const PUBLIC_PATH = PUBLIC_PATH_IS_FILE
  ? join(__dirname, '../renderer/index.html')
  : process.env['ELECTRON_RENDERER_URL']!

export const EXTENSIONS_DIRECTORY = resolve(
  join(app.isPackaged ? join(__dirname, '..', '..', '..') : __dirname, 'extensions')
)
