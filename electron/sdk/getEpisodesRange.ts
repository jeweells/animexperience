import cheerio, { Cheerio, Element } from 'cheerio'
import fetch from 'node-fetch'
import { AnimeInfo } from '../../globals/types'

const getEpisodeNumber = (elm: Cheerio<Element>) => {
    if (elm.length > 0) {
        const epRegex = /[0-9]+$/
        const episode = epRegex.exec(elm.attr('href') ?? '')?.[0]
        if (episode) {
            return parseInt(episode)
        }
    }
    return null
}

export const getAnimeInfo = async (link: string) => {
    const animeLink = link.replace(/-[0-9]$/, '').replace('animeid.tv/v/', 'animeid.tv/')

    const animeHTML = await fetch(animeLink).then((x) => x.text())
    console.debug('Getting anime info html...', animeLink, 'RAW:', link)
    const $ = cheerio.load(animeHTML)
    const info: AnimeInfo = {}
    const orderBtn = $('#ord[data-id]')
    if (orderBtn.length > 0) {
        const id = orderBtn.attr('data-id')
        const lastEpLink = $('#listado > li:first-child > a')
        const maxRange = getEpisodeNumber(lastEpLink) ?? 1
        let minRange = 0
        console.debug(`Obtained episodes info: id(${id}) maxRange(${maxRange})`)
        if ($('#paginas').children().length === 0) {
            minRange = getEpisodeNumber($('#listado > li:last-child > a')) ?? 1
        } else {
            console.debug(
                'Too many episodes require pagination; Fetching for first episodes',
            )
            const ascEps = await fetch(
                `https://www.animeid.tv/ajax/caps?id=${id}&ord=ASC`,
            ).then((x) => x.json())
            minRange = parseInt(ascEps.list[0].numero ?? '1')
        }
        console.debug(`minRange(${minRange})`)
        info.episodesRange = {
            min: minRange,
            max: maxRange,
        }
    }

    return info
}
