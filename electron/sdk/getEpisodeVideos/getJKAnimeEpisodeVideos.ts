import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { JKAnimeSearchResults, searchJKAnime } from '../searchAnime/searchJKAnime'
const logger = new Logger({ name: 'getJKAnimeEpisodeVideos' })

export const getJKAnimeEpisodeVideos = async (anime: string, episode: number) => {
    if (!(anime && episode)) {
        logger.error('getJKAnimeEpisodeVideos: Invalid input', anime, episode)
        return null
    }
    const results: JKAnimeSearchResults = await searchJKAnime(anime)
    if (Array.isArray(results) && results.length > 0) {
        const result = results[0]
        const episodeLink = result.link?.endsWith('/')
            ? `${result.link}${episode}`
            : `${result.link}/${episode}`
        logger.debug('Obtained:', episodeLink)
        const body = await fetch(new URL(episodeLink)).then((x) => x.text())
        const $ = cheerio.load(body)
        const scripts = $('script:not([src])')
            .map((idx, elm) => $(elm).html())
            .toArray()
        const videosText = scripts.find((x) => x.includes("getElementById('video_box')"))
        if (videosText) {
            const videosRegex = /video\[([0-9]+)]\s=\s'(<[^']+>)';/gm
            let m
            const matches = []
            while ((m = videosRegex.exec(videosText)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === videosRegex.lastIndex) {
                    videosRegex.lastIndex++
                }

                const index = m[1]
                const html = m[2]
                matches.push({
                    index,
                    html,
                })
            }
            logger.debug('Found', matches.length, 'matches')
            return matches.map(({ index, html }) => {
                return {
                    name: $(`.bg-servers a[data-id=${index}]`).text().trim(),
                    html,
                }
            })
        }
        logger.debug('Script not found')
    }
    logger.debug('No results')
    return null
}
