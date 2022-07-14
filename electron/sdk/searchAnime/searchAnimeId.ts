import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { AnimeIDAnimeMatch } from '../../../globals/types'
import { AnimeIDSearchResponse } from '../../../src/types'
import { cached } from '../../cache'
import { similarity } from '../../utils'
const logger = new Logger({ name: 'searchAnimeID' })

const searchAnimeIDRaw = cached(async (animeName: string) => {
    const url = new URL('https://www.animeid.tv/ajax/search')
    url.searchParams.append('q', animeName)
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
        logger.debug('For', `(${animeName})`, '| Found', animeResponse.length, 'matches')
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
    logger.debug('Unexpected output')
    return []
})
export const searchAnimeID = (animeName: string) => {
    return searchAnimeIDRaw(animeName.replace(/\./g, '').slice(0, 50))
}
