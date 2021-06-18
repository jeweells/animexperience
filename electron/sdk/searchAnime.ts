import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { AnimeIDAnimeMatch, MalAnimeInfo } from '../../globals/types'
import { AnimeIDSearchResponse, RecentAnimeData } from '../../src/types'
import { cleanName, similarity } from '../utils'
import { getAnimeIDEpisodeVideos } from './getEpisodeVideos'

export type JKAnimeSearchResult = Partial<{
    name: string
    link: string
}>
export type JKAnimeSearchResults = JKAnimeSearchResult[]

export const searchAnimeID = async (animeName: string) => {
    const url = new URL('https://www.animeid.tv/ajax/search')
    const cleanedAnimeName = cleanName(animeName)
    url.searchParams.append('q', cleanedAnimeName)
    const animeResponse: AnimeIDSearchResponse = await fetch(url, {
        headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en,es;q=0.9,es-ES;q=0.8',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua':
                '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        method: 'GET',
    }).then((x) => x.json())
    if (Array.isArray(animeResponse)) {
        console.debug(
            'For',
            cleanedAnimeName,
            `(${animeName})`,
            '| Found',
            animeResponse.length,
            'matches',
        )
        return animeResponse
            .map((x) => ({
                name: x.text,
                link: x.link,
                image: x.image,
            }))
            .sort((a, b) => {
                return similarity(b.name, animeName) - similarity(a.name, animeName)
            }) as AnimeIDAnimeMatch[]
    }
    console.debug('Unexpected output')
    return []
}

export const searchAIDFromMALEpisode = async (arg: RecentAnimeData) => {
    const params = new URLSearchParams()
    params.set('q', arg.entry.title)
    console.debug('Searching...')
    const animes = await searchAnimeID(arg.entry.title)
    const firstAnime = animes?.[0]
    if (firstAnime) {
        const toWatchLink = firstAnime.link.replace('animeid.tv/', 'animeid.tv/v/')
        const episodeLink = `${toWatchLink}-${arg.episodes[0].mal_id}`
        console.debug('Getting episode html...')
        return await getAnimeIDEpisodeVideos(episodeLink)
    }
    return null
}

export const searchJKAnime = async (animeName: string) => {
    const filteredName = cleanName(animeName)
        .split(' ')
        .filter((x) => !!x)
        .map((x) => x.toLowerCase())
        .join('_')

    console.debug('SearchingJKAnime:', animeName, '->', filteredName)
    const body = await fetch(
        new URL(`https://jkanime.net/buscar/${filteredName}/1/`),
    ).then((x) => x.text())
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

export const searchMalAnime = async (name: string) => {
    const url = new URL('https://myanimelist.net/search/prefix.json?type=anime&v=1')
    url.searchParams.append('keyword', cleanName(name))
    console.debug('Searching for', name, '->', url.toString())
    const body = (await fetch(url).then((x) => x.json())) as {
        categories: Array<{
            type: string
            items: Array<MalAnimeInfo>
        }>
    }
    // We already filter by category=anime
    if (!body) return []

    return body.categories[0].items ?? []
}
