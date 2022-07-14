import { BrowserWindow } from 'electron'

const getWebContents = () => BrowserWindow.getAllWindows()[0]?.webContents

export const keyDown = (key: string) => {
    getWebContents().sendInputEvent({
        type: 'keyDown',
        modifiers: [],
        keyCode: key,
    })
}
