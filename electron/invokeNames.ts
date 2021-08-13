import { LinkedFn } from './fnlinker'

export default {
    getRecentAnimes: new LinkedFn(),
    getAnimeIDInfo: new LinkedFn(),
    getAnimeIDEpisodeVideos: new LinkedFn(),
    getJKAnimeEpisodeVideos: new LinkedFn(),
    searchAIDFromMALEpisode: new LinkedFn(),
    searchJKAnime: new LinkedFn(),
    searchMalAnime: new LinkedFn(),
    searchAnimeID: new LinkedFn(),
    getAnimeRecommendations: new LinkedFn(),
    getAnimeImage: new LinkedFn(),
    deepSearchAnimeId: new LinkedFn(),
    deepSearchAnimeIdByPage: new LinkedFn(),
    keyDown: new LinkedFn(),
}
