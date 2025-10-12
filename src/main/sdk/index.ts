import { ipcMain } from 'electron'
import { cached } from '../cache'
import invokeNames from '../invokeNames'
import { retry } from '../retry'
import { deepSearchAnimeFlv, deepSearchAnimeFlvByPage } from './deepSearchAnime/deepSearchAnimeFlv'
import {
  getAnimeFlvInfo,
  getAnimeFlvInfoFromLink,
  getAnimeFlvInfoFromPartialLink
} from './getAnimeInfo/getAnimeFlvInfo'
import { getAnimeImage } from './getAnimeImage'
import { getAnimeRecommendations } from './getAnimeRecommendations'
import { getAnimeFlvEpisodeVideos } from './getEpisodeVideos/getAnimeFlvEpisodeVideos'
import { getJKAnimeEpisodeVideos } from './getEpisodeVideos/getJKAnimeEpisodeVideos'
import { getRecentAnimes } from './getRecentAnimes'
import { keyDown } from './inputEvents'
import { searchAnimeFlv, searchAnimeFlvFromMALEpisode } from './searchAnime/searchAnimeFlv'
import { searchJKAnime } from './searchAnime/searchJKAnime'
import { searchMalAnime } from './searchAnime/searchMalAnime'
import { getInvokedLink } from './openUrl'
import { info } from '@dev'

export const setupSdk = () => {
  info('Setting up sdk')
  for (const fn of [
    invokeNames.getRecentAnimes.link(getRecentAnimes),
    invokeNames.getAnimeFlvInfo.link(getAnimeFlvInfo),
    invokeNames.getAnimeFlvInfoFromLink.link(getAnimeFlvInfoFromLink),
    invokeNames.getAnimeFlvInfoFromPartialLink.link(getAnimeFlvInfoFromPartialLink),
    invokeNames.getAnimeFlvEpisodeVideos.link(getAnimeFlvEpisodeVideos),
    invokeNames.getJKAnimeEpisodeVideos.link(getJKAnimeEpisodeVideos),
    invokeNames.searchAIDFromMALEpisode.link(searchAnimeFlvFromMALEpisode),
    invokeNames.searchJKAnime.link(searchJKAnime),
    invokeNames.searchMalAnime.link(searchMalAnime),
    invokeNames.searchAnimeFlv.link(searchAnimeFlv),
    invokeNames.getAnimeRecommendations.link(getAnimeRecommendations),
    invokeNames.getAnimeImage.link(getAnimeImage),
    invokeNames.deepSearchAnimeFlv.link(deepSearchAnimeFlv),
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
