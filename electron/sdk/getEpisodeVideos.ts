import cheerio from 'cheerio'
import JSON5 from 'json5'
import fetch from 'node-fetch'
import { JKAnimeSearchResults, searchJKAnime } from './searchAnime'

export const getJKAnimeEpisodeVideos = async (anime: string, episode: number) => {
    if (!(anime && episode)) {
        console.error('getJKAnimeEpisodeVideos: Invalid input', anime, episode)
        return null
    }
    const results: JKAnimeSearchResults = await searchJKAnime(anime)
    if (Array.isArray(results) && results.length > 0) {
        const result = results[0]
        const episodeLink = result.link?.endsWith('/')
            ? `${result.link}${episode}`
            : `${result.link}/${episode}`
        console.debug('Obtained:', episodeLink)
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
                matches.push({ index, html })
            }
            console.debug('Found', matches.length, 'matches')
            return matches.map(({ index, html }) => {
                return {
                    name: $(`.bg-servers a[data-id=${index}]`).text().trim(),
                    html,
                }
            })
        }
        console.debug('Script not found')
    }
    console.debug('No results')
    return null
}

export const getAnimeIDEpisodeVideos = async (episodeLink: string) => {
    if (!episodeLink) {
        console.error('getAnimeIDEpisodeVideos: No link provided')
        return null
    }
    console.debug('Getting episode videos of...', episodeLink)
    const body = await fetch(new URL(episodeLink)).then((d) => d.text())
    const $ = cheerio.load(body)
    console.debug('Parsing html...')
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
            console.debug('Parsing JSON...')
            return {
                name: x.name,
                html: JSON5.parse(x.data)?.v,
            }
        })
        .filter((x) => x ?? false)
    return datas
}
