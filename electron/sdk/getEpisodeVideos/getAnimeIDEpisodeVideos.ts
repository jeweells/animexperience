import cheerio from 'cheerio'
import JSON5 from 'json5'
import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { AnimeInfo } from '../../../globals/types'
import invokeNames from '../../invokeNames'
const logger = new Logger({ name: 'getAnimeIDEpisodeVideos' })

export const getAnimeIDEpisodeVideos = async (
    anime: string,
    episode: number,
    episodeLink?: string,
) => {
    if (!episodeLink || !new URL(episodeLink).origin.includes('animeid.tv')) {
        logger.warn(
            `getAnimeIDEpisodeVideos: Invalid episodeLink (${episodeLink}), we'll try to find the correct using the anime info`,
        )
        // Using invokeNames allows the use of cache
        const animes = await invokeNames.searchAnimeID.fn?.(anime)
        if (!(Array.isArray(animes) && animes.length > 0)) {
            logger.error(
                `getAnimeIDEpisodeVideos: Trying to find anime "${anime}" but it wasn't found`,
            )
            return null
        }
        const targetAnime = animes[0]
        const info: AnimeInfo = await invokeNames.getAnimeIDInfo.fn?.(
            targetAnime.name,
            targetAnime.link,
        )
        episodeLink = info.episodeLink.replace(info.episodeReplace, String(episode))
    }

    if (!episodeLink) {
        logger.error('getAnimeIDEpisodeVideos: No link provided')
        return null
    }
    logger.debug('Getting episode videos of...', episodeLink)
    const body = await fetch(new URL(episodeLink)).then((d) => d.text())
    const $ = cheerio.load(body)
    logger.debug('Parsing html...')
    const mirrors = $('ul#mirrors')
    const datas = $('#partes .subtab .parte')
        .map((elm, b) => {
            const tabId = $(b).parent().attr('data-tab-id')
            const optionName = mirrors
                .find(`li.tab[data-tab-id=${tabId}]`)
                ?.text()
                ?.trim()
                ?.toUpperCase()
            return {
                name: optionName,
                data: $(b).attr('data'),
            }
        })
        .toArray()
        .filter((x): x is { name: string; data: string } => !!x.data)
        .map((x) => {
            logger.debug('Parsing JSON (v data)...', x.data)
            return {
                name: x.name,
                html: JSON5.parse(x.data)?.v,
            }
        })
        .filter((x) => x ?? false)
    return datas
}
