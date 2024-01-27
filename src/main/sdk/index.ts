import { ipcMain } from 'electron'
import { cached } from '../cache'
import invokeNames from '../invokeNames'
import { retry } from '../retry'
import { deepSearchAnimeFlv, deepSearchAnimeFlvByPage } from './deepSearchAnime/deepSearchAnimeFlv'
import { deepSearchAnimeId, deepSearchAnimeIdByPage } from './deepSearchAnime/deepSearchAnimeId'
import {
  getAnimeFlvInfo,
  getAnimeFlvInfoFromLink,
  getAnimeFlvInfoFromPartialLink
} from './getAnimeInfo/getAnimeFlvInfo'
import { getAnimeImage } from './getAnimeImage'
import { getAnimeRecommendations } from './getAnimeRecommendations'
import { getAnimeIDInfo } from './getAnimeInfo/getAnimeIDInfo'
import { getAnimeFlvEpisodeVideos } from './getEpisodeVideos/getAnimeFlvEpisodeVideos'
import { getAnimeIDEpisodeVideos } from './getEpisodeVideos/getAnimeIDEpisodeVideos'
import { getJKAnimeEpisodeVideos } from './getEpisodeVideos/getJKAnimeEpisodeVideos'
import { getRecentAnimes } from './getRecentAnimes'
import { keyDown } from './inputEvents'
import { searchAnimeFlv, searchAnimeFlvFromMALEpisode } from './searchAnime/searchAnimeFlv'
import { searchAnimeID } from './searchAnime/searchAnimeId'
import { searchJKAnime } from './searchAnime/searchJKAnime'
import { searchMalAnime } from './searchAnime/searchMalAnime'
import { getInvokedLink } from './openUrl'

export const setupSdk = () => {
  console.debug('Setting up sdk')
  for (const fn of [
    invokeNames.getRecentAnimes.link(getRecentAnimes),
    invokeNames.getAnimeIDInfo.link(getAnimeIDInfo),
    invokeNames.getAnimeFlvInfo.link(getAnimeFlvInfo),
    invokeNames.getAnimeFlvInfoFromLink.link(getAnimeFlvInfoFromLink),
    invokeNames.getAnimeFlvInfoFromPartialLink.link(getAnimeFlvInfoFromPartialLink),
    invokeNames.getAnimeFlvEpisodeVideos.link(getAnimeFlvEpisodeVideos),
    invokeNames.getAnimeIDEpisodeVideos.link(getAnimeIDEpisodeVideos),
    invokeNames.getJKAnimeEpisodeVideos.link(getJKAnimeEpisodeVideos),
    invokeNames.searchAIDFromMALEpisode.link(searchAnimeFlvFromMALEpisode),
    invokeNames.searchJKAnime.link(searchJKAnime),
    invokeNames.searchMalAnime.link(searchMalAnime),
    invokeNames.searchAnimeID.link(searchAnimeID),
    invokeNames.searchAnimeFlv.link(searchAnimeFlv),
    invokeNames.getAnimeRecommendations.link(getAnimeRecommendations),
    invokeNames.getAnimeImage.link(getAnimeImage),
    invokeNames.deepSearchAnimeId.link(deepSearchAnimeId),
    invokeNames.deepSearchAnimeFlv.link(deepSearchAnimeFlv),
    invokeNames.deepSearchAnimeIdByPage.link(deepSearchAnimeIdByPage),
    invokeNames.deepSearchAnimeFlvByPage.link(deepSearchAnimeFlvByPage)
    // Allow the use of a cache for any result
  ]
    .map(retry)
    .map((fn) => {
      if (fn.fn) {
        fn.fn = cached(fn.fn)
      }
      return fn
    })
    // Non-cached functions
    .concat(invokeNames.keyDown.link(keyDown), invokeNames.getInvokedLink.link(getInvokedLink))) {
    ipcMain.handle(fn.name, async (_event, ...args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return fn.fn?.(...args)
    })
  }
}

export default setupSdk
