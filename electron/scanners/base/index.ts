import { ipcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'

export const requestFromWindow = (w: Electron.BrowserWindow, fnContent: string) => {
    return new Promise((resolve, reject) => {
        const key = `__animeflv-${uuidv4()}`

        ipcMain.handleOnce(key, (e, arg) => {
            console.debug('RESOLVED WITH', arg)
            resolve(arg)
        })
        const code = `
            {
                const execute = () => {
                    ${fnContent}
                };
                require('electron').ipcRenderer.invoke('${key}', execute())    
            }
        `
        w.webContents.executeJavaScript(code).catch(reject)
    })
}
