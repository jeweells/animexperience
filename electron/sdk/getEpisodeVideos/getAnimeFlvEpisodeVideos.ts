import { Logger } from 'tslog'
import { AnimeInfo } from '../../../globals/types'
import invokeNames from '../../invokeNames'
import { getVideos } from '../../scanners/animeflv/fns/getVideos'
import { createAnimeFlvRequest } from '../../scanners/animeflv/window'
const logger = new Logger({ name: 'getAnimeFlvEpisodeVideos' })

export const getAnimeFlvEpisodeVideos = async (
    anime: string,
    episode: number,
    episodeLink?: string,
) => {
    if (!episodeLink || !new URL(episodeLink).origin.includes('animeflv.net')) {
        logger.warn(
            `getAnimeFlvEpisodeVideos: Invalid episodeLink (${episodeLink}), we'll try to find the correct using the anime info`,
        )
        logger.debug('getAnimeFlvEpisodeVideos: Params:', {
            anime,
            episode,
            episodeLink,
        })
        // Using invokeNames allows the use of cache
        const animes = await invokeNames.searchAnimeFlv.fn?.(anime)
        if (!(Array.isArray(animes) && animes.length > 0)) {
            logger.error(
                `getAnimeFlvEpisodeVideos: Trying to find anime "${anime}" but it wasn't found`,
            )
            return null
        }
        const targetAnime = animes[0]
        logger.debug('getAnimeFlvEpisodeVideos: Found', targetAnime)
        const info: AnimeInfo = await invokeNames.getAnimeFlvInfo.fn?.(
            targetAnime.name,
            targetAnime.link,
        )
        logger.debug('getAnimeFlvEpisodeVideos: Info found', info)
        episodeLink = info.episodeLink.replace(info.episodeReplace, String(episode))
    }
    if (!episodeLink) {
        logger.error('getAnimeFlvEpisodeVideos: No link provided')
        return null
    }
    logger.debug('Getting episode videos of...', episodeLink)
    return await createAnimeFlvRequest(episodeLink, getVideos)
}
