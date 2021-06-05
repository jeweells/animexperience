import { ipcMain } from 'electron'
import { getAnimeRecommendations } from './getAnimeRecommendations'
import { getAnimeInfo } from './getEpisodesRange'
import { getAnimeIDEpisodeVideos, getJKAnimeEpisodeVideos } from './getEpisodeVideos'
import { getRecentAnimes } from './getRecentAnimes'
import { searchAIDFromMALEpisode, searchJKAnime, searchMalAnime } from './searchAnime'

export const setupSdk = () => {
    for (const fn of [
        getRecentAnimes,
        getAnimeInfo,
        getAnimeIDEpisodeVideos,
        getJKAnimeEpisodeVideos,
        searchAIDFromMALEpisode,
        searchJKAnime,
        searchMalAnime,
        getAnimeRecommendations,
    ]) {
        ipcMain.handle(fn.name, async (event, ...args) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return fn(...args)
        })
    }
}

export default setupSdk
