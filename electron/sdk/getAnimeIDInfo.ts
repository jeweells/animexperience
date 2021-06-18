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

const parseType = (s: string): AnimeInfo['type'] | undefined => {
    const _s = s as AnimeInfo['type']
    switch (_s as AnimeInfo['type']) {
        case 'Serie':
            return _s
    }
}
const parseStatus = (s: string): AnimeInfo['status'] | undefined => {
    const _s = s as AnimeInfo['status']
    switch (_s) {
        case 'En emisión':
        case 'Finalizada':
            return _s
    }
}

export const getAnimeIDInfo = async (link: string) => {
    const episodeReplace = '<episode>'
    const episodeLink = `${link.replace(
        'animeid.tv/',
        'animeid.tv/v/',
    )}-${episodeReplace}`

    const animeHTML = await fetch(link).then((x) => x.text())
    console.debug('Getting anime info html...', link)
    const $ = cheerio.load(animeHTML)
    const info: AnimeInfo = {
        episodeLink,
        link,
        episodeReplace,
    }
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
    const animeHeader = $('article#anime')
    info.image = animeHeader.find('figure > img[src]').attr('src')
    const titles = animeHeader.find('hgroup')
    info.title = titles.find('h1').text()
    info.otherTitles = titles.find('h2').text().split(', ')

    info.description = animeHeader.find('p.sinopsis').text()
    info.tags = animeHeader
        .find('ul.tags > li > a[href]')
        .map((idx, elm) => {
            return $(elm).text()
        })
        .toArray()
    const data = $('div.status-left > div.cuerpo')
    info.type = parseType(data.find("strong:contains('Tipo') + span").text().trim())
    info.status = parseStatus(data.find("strong:contains('Estado') + span").text().trim())
    return info
}
