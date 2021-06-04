import { ipcMain } from 'electron'
import { getAnimeInfo } from './getEpisodesRange'
import { getAnimeIDEpisodeVideos, getJKAnimeEpisodeVideos } from './getEpisodeVideos'
import { getRecentAnimes } from './getRecentAnimes'
import { searchAIDFromMALEpisode, searchJKAnime } from './searchAnime'

export const setupSdk = () => {
    for (const fn of [
        getRecentAnimes,
        getAnimeInfo,
        getAnimeIDEpisodeVideos,
        getJKAnimeEpisodeVideos,
        searchAIDFromMALEpisode,
        searchJKAnime,
    ]) {
        ipcMain.handle(fn.name, async (event, ...args) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return fn(...args)
        })
    }
}

export default setupSdk
