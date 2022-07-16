import { app } from 'electron'
import filewatcher from 'filewatcher'

export default (paths: string | string[]) => {
    if (process.env.NODE_ENV !== 'development') return
    const watcher = filewatcher()
    paths = Array.isArray(paths) ? paths : [paths]
    paths.forEach((path) => {
        watcher.add(path)
    })
    watcher.on('change', () => {
        app.relaunch()
        app.exit()
    })
}
