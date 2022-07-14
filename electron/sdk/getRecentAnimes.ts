import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { listRecentAnimes } from '../scanners/animeflv/fns/listRecentAnimes'
import { BASE_ORIGIN, createAnimeFlvRequest } from '../scanners/animeflv/window'

const logger = new Logger({ name: 'getRecentAnimes' })

export const getRecentAnimes = async () => {
    logger.debug('Getting recent animes...')
    return await createAnimeFlvRequest(BASE_ORIGIN, listRecentAnimes)

    const animeIdHome = await fetch(new URL('https://www.animeid.tv')).then((x) =>
        x.text(),
    )
    logger.debug('Getting episode html...')
    const $ = cheerio.load(animeIdHome)
    logger.debug('Parsing html...')
    const episodeRegex = /[0-9]+$/m
    return $('section.main > section.lastcap > div.dia')
        .map((idx, b) => {
            const node = $(b)
            const dateStr = node.before().find('span.right').text()
            const arr = node
                .find('article')
                .map((_, article) => {
                    const node = $(article)
                    const img = node.find('img')
                    const title = node.find('header').text()
                    const episode = episodeRegex.exec(title)?.[0] ?? null
                    const relLink = node.find('a').attr('href')
                    return {
                        date: dateStr,
                        name: img.attr('alt'),
                        episode: episode !== null ? parseInt(episode) : null,
                        link:
                            relLink ?? false ? 'https://www.animeid.tv' + relLink : null,
                        img: img.attr('src'),
                    }
                })
                .toArray()
            return arr
        })
        .toArray()
}
