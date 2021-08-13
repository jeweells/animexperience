import { ipcMain } from 'electron'
import { cached } from '../cache'
import invokeNames from '../invokeNames'
import { deepSearchAnimeId, deepSearchAnimeIdByPage } from './deepSearchAnime'
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
    console.debug('Setting up sdk')
    for (const fn of [
        invokeNames.getRecentAnimes.link(getRecentAnimes),
        invokeNames.getAnimeIDInfo.link(getAnimeIDInfo),
        invokeNames.getAnimeIDEpisodeVideos.link(getAnimeIDEpisodeVideos),
        invokeNames.getJKAnimeEpisodeVideos.link(getJKAnimeEpisodeVideos),
        invokeNames.searchAIDFromMALEpisode.link(searchAIDFromMALEpisode),
        invokeNames.searchJKAnime.link(searchJKAnime),
        invokeNames.searchMalAnime.link(searchMalAnime),
        invokeNames.searchAnimeID.link(searchAnimeID),
        invokeNames.getAnimeRecommendations.link(getAnimeRecommendations),
        invokeNames.getAnimeImage.link(getAnimeImage),
        invokeNames.deepSearchAnimeId.link(deepSearchAnimeId),
        invokeNames.deepSearchAnimeIdByPage.link(deepSearchAnimeIdByPage),
        // Allow the use of a cache for any result
    ]
        .map((fn) => {
            if (fn.fn) {
                fn.fn = cached(fn.fn)
            }
            return fn
        })
        // Non-cached functions
        .concat(invokeNames.keyDown.link(keyDown))) {
        ipcMain.handle(fn.name, async (event, ...args) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return fn.fn?.(...args)
        })
    }
}

export default setupSdk
