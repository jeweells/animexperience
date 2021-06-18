import { ipcMain } from 'electron'
import { cached } from '../cache'
import { getAnimeImage } from './getAnimeImage'
import { getAnimeRecommendations } from './getAnimeRecommendations'
import { getAnimeIDInfo } from './getAnimeIDInfo'
import { getAnimeIDEpisodeVideos, getJKAnimeEpisodeVideos } from './getEpisodeVideos'
import { getRecentAnimes } from './getRecentAnimes'
import { keyDown } from './inputEvents'
import {
    searchAIDFromMALEpisode,
    searchAnimeID,
    searchJKAnime,
    searchMalAnime,
} from './searchAnime'

export const setupSdk = () => {
    for (const fn of ([
        getRecentAnimes,
        getAnimeIDInfo,
        getAnimeIDEpisodeVideos,
        getJKAnimeEpisodeVideos,
        searchAIDFromMALEpisode,
        searchJKAnime,
        searchMalAnime,
        searchAnimeID,
        getAnimeRecommendations,
        getAnimeImage,
        // Allow the use of a cache for any result
    ] as Array<(...arg: any) => any>)
        .map((fn) => cached(fn))
        // Non-cached functions
        .concat(keyDown)) {
        ipcMain.handle(fn.name, async (event, ...args) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return fn(...args)
        })
    }
}

export default setupSdk
