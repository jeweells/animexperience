import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { AnimeIDSearchResponse, RecentAnimeData } from '../../src/types'
import { getAnimeIDEpisodeVideos } from './getEpisodeVideos'

export type JKAnimeSearchResult = Partial<{
    name: string
    link: string
}>
export type JKAnimeSearchResults = JKAnimeSearchResult[]

export const searchAIDFromMALEpisode = async (arg: RecentAnimeData) => {
    const params = new URLSearchParams()
    params.set('q', arg.entry.title)
    console.debug('Searching...')
    const animeResponse: AnimeIDSearchResponse = await fetch(
        'https://www.animeid.tv/ajax/search?' + params.toString(),
        {
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'en,es;q=0.9,es-ES;q=0.8',
                'cache-control': 'no-cache',
                pragma: 'no-cache',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
            },
            // referrer: 'https://www.animeid.tv/v/kingdom-3rd-season-8',
            // referrerPolicy: 'strict-origin-when-cross-origin',
            method: 'GET',
            // mode: 'cors',
            // credentials: 'include'
        },
    ).then((x) => x.json())
    if (animeResponse?.length > 0) {
        const data = animeResponse[0]
        const toWatchLink = data.link.replace('animeid.tv/', 'animeid.tv/v/')
        const episodeLink = `${toWatchLink}-${arg.episodes[0].mal_id}`
        console.debug('Getting episode html...')
        return await getAnimeIDEpisodeVideos(episodeLink)
    }
    return null
}

export const searchJKAnime = async (animeName: string) => {
    const filteredName = animeName
        .replace(/[^A-Za-z]/g, ' ')
        .split(' ')
        .filter((x) => !!x)
        .map((x) => x.toLowerCase())
        .join('_')

    console.debug('SearchingJKAnime:', animeName, '->', filteredName)
    const body = await fetch(`https://jkanime.net/buscar/${filteredName}/1/`).then((x) => x.text())
    const $ = cheerio.load(body)
    return $('.anime__page__content > .row')
        .children()
        .map((_, child) => {
            const node = $(child)
            const a = node.find('a')
            return {
                name: a.text(),
                link: a.attr('href'),
            }
        })
        .toArray()
}
