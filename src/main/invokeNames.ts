import { LinkedFn } from './fnlinker'

export default {
  getRecentAnimes: new LinkedFn(),
  getAnimeIDInfo: new LinkedFn(),
  getAnimeFlvInfo: new LinkedFn(),
  getAnimeFlvInfoFromLink: new LinkedFn(),
  getAnimeFlvInfoFromPartialLink: new LinkedFn(),
  getAnimeFlvEpisodeVideos: new LinkedFn(),
  getAnimeIDEpisodeVideos: new LinkedFn(),
  getJKAnimeEpisodeVideos: new LinkedFn(),
  searchAIDFromMALEpisode: new LinkedFn(),
  searchJKAnime: new LinkedFn(),
  searchMalAnime: new LinkedFn(),
  searchAnimeID: new LinkedFn(),
  searchAnimeFlv: new LinkedFn(),
  getAnimeRecommendations: new LinkedFn(),
  getAnimeImage: new LinkedFn(),
  deepSearchAnimeId: new LinkedFn(),
  deepSearchAnimeIdByPage: new LinkedFn(),
  deepSearchAnimeFlv: new LinkedFn(),
  deepSearchAnimeFlvByPage: new LinkedFn(),
  keyDown: new LinkedFn(),
  getInvokedLink: new LinkedFn()
}
