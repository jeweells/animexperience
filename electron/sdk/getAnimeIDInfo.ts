import cheerio, { Cheerio, Element } from 'cheerio'
import fetch from 'node-fetch'
import { AnimeInfo } from '../../globals/types'
import moment from 'moment'

const getEpisodeNumber = (elm: Cheerio<Element>) => {
    if (elm.length > 0) {
        const epRegex = /-([0-9]+)$/
        const episode = epRegex.exec(elm.attr('href') ?? '')?.[1]
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

    console.debug('Getting anime info html...', link)
    const animeHTML = await fetch(new URL(link)).then((x) => x.text())
    const $ = cheerio.load(animeHTML)
    const info: AnimeInfo = {
        episodeLink,
        link,
        episodeReplace,
    }
    const orderBtn = $('#ord[data-id]')
    if (orderBtn.length > 0) {
        const id = orderBtn.attr('data-id')
        const liEpisodes = $('#listado > li > a')
        let maxRange: number | null = null
        for (let i = 0; i < liEpisodes.length && maxRange === null; i++) {
            maxRange = getEpisodeNumber($(liEpisodes.get(i)))
        }
        maxRange = maxRange ?? 1
        let minRange = 0
        console.debug(`Obtained episodes info: id(${id}) maxRange(${maxRange})`)
        if ($('#paginas').children().length === 0) {
            minRange = getEpisodeNumber($('#listado > li:last-child > a')) ?? 1
        } else {
            console.debug(
                'Too many episodes require pagination; Fetching for first episodes',
            )
            const ascEps = await fetch(
                new URL(`https://www.animeid.tv/ajax/caps?id=${id}&ord=ASC`),
                {
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
                },
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
    const emitted = data.find("strong:contains('Emitido') + span").text().trim()

    info.emitted = {}
    const emittedDate = moment(emitted, 'DD MMM YYYY', true)
    if (emittedDate.isValid()) {
        info.emitted.from = emittedDate.unix()
    } else {
        console.error('Invalid date:', emitted)
    }
    return info
}
