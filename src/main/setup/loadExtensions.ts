import { join } from 'path'
import { session } from 'electron'
import { is } from '@electron-toolkit/utils'
import { error, info } from '@dev'
import { EXTENSIONS_DIRECTORY } from '../constants'

export const loadExtensions = async () => {
  await session.defaultSession
    .loadExtension(join(EXTENSIONS_DIRECTORY, './breakfullscreen/'))
    .then(() => info('[BreakFullscreen] Extension loaded'))
  await session.defaultSession
    .loadExtension(join(EXTENSIONS_DIRECTORY, './breakstyles/'))
    .then(() => info('[BreakStyles] Extension loaded'))

  if (is.dev) {
    const installExtension = require('electron-devtools-installer')
    const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installExtension
    installExtension
      .default(REACT_DEVELOPER_TOOLS)
      .then((name) => info(`Added Extension:  ${name}`))
      .catch((err) => error('An error occurred: ', err))
    installExtension
      .default(REDUX_DEVTOOLS)
      .then((name) => info(`Added Extension:  ${name}`))
      .catch((err) => error('An error occurred: ', err))
  }
}
