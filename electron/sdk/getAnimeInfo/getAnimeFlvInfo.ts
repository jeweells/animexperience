import { Logger } from 'tslog'
import invokeNames from '../../invokeNames'
import { AnimeLinkToEpisode } from '../../linkBuilder'
import { getInfo } from '../../scanners/animeflv/fns/getInfo'
import { createAnimeFlvRequest } from '../../scanners/animeflv/window'

const logger = new Logger({ name: 'getAnimeFlvInfo' })

export const getAnimeFlvInfo = async (anime: string, link?: string) => {
    if (!link || !new URL(link).origin.includes('animeflv.net')) {
        logger.warn(
            `getAnimeFlvInfo: Invalid anime link (${link}), we'll try to find the correct using the anime info`,
        )
        logger.debug('getAnimeFlvInfo: Params:', {
            anime,
            link,
        })
        // Using invokeNames allows the use of cache
        const animes = await invokeNames.searchAnimeFlv.fn?.(anime)
        if (!(Array.isArray(animes) && animes.length > 0)) {
            logger.error(
                `getAnimeFlvInfo: Trying to find anime "${anime}" but it wasn't found`,
            )
            return null
        }
        const targetAnime = animes[0]
        link = targetAnime.link
    }
    if (!link) {
        logger.warn(`getAnimeFlvInfo: No link found for "${anime}"`)
        return null
    }
    const info: any = await createAnimeFlvRequest(link, getInfo)
    return {
        ...info,
        link,
        ...new AnimeLinkToEpisode(link, 'animeflv').raw(),
    }
}
