import { join } from 'path'
import { session } from 'electron'
import { is } from '@electron-toolkit/utils'

export const loadExtensions = async () => {
  await session.defaultSession
    .loadExtension(join(__dirname, './extensions/breakfullscreen/'))
    .then(() => console.debug('[BreakFullscreenExt] Extension loaded'))

  if (is.dev) {
    const installExtension = require('electron-devtools-installer')
    const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installExtension
    installExtension
      .default(REACT_DEVELOPER_TOOLS)
      .then((name) => console.debug(`Added Extension:  ${name}`))
      .catch((err) => console.debug('An error occurred: ', err))
    installExtension
      .default(REDUX_DEVTOOLS)
      .then((name) => console.debug(`Added Extension:  ${name}`))
      .catch((err) => console.debug('An error occurred: ', err))
  }
}
