import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { MalAnimeInfo } from '../../../globals/types'
import { cached } from '../../cache'
import { cleanName, similarity } from '../../utils'
const logger = new Logger({ name: 'searchMalAnime' })

export const searchMalAnime = cached(async (name: string) => {
    const url = new URL('https://myanimelist.net/search/prefix.json?type=anime&v=1')
    url.searchParams.append('keyword', cleanName(name))
    logger.debug('Searching for', name, '->', url.toString())
    const body = (await fetch(url).then((x) => x.json())) as {
        categories: Array<{
            type: string
            items: Array<MalAnimeInfo>
        }>
    }
    // We already filter by category=anime
    if (!body) return []

    const result = body.categories[0].items ?? []
    return result.sort((a, b) => {
        return similarity(b.name, name) - similarity(a.name, name)
    })
})
