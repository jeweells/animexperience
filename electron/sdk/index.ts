import { ipcMain } from "electron";
import { getAnimeIDEpisodeVideos, getJKAnimeEpisodeVideos } from "./getEpisodeVideos";
import { getRecentAnimes } from "./getRecentAnimes";
import { searchAIDFromMALEpisode, searchJKAnime } from "./searchAnime";

export const setupSdk = () => {
    [
        getRecentAnimes,
        getAnimeIDEpisodeVideos,
        getJKAnimeEpisodeVideos,
        searchAIDFromMALEpisode,
        searchJKAnime,
    ].forEach((fn) => {
        ipcMain.handle(fn.name, async (event, ...args) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return fn(...args);
        });
    });
};

export default setupSdk;
