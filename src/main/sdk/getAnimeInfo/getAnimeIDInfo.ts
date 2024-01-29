import * as cheerio from 'cheerio'
import { Cheerio, CheerioAPI, Element } from 'cheerio'
import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { AnimeInfo, RelatedAnime } from '@shared/types'
import moment from 'moment'
import { Optional } from '@shared/types'
import invokeNames from '../../invokeNames'

import { AnimeLinkToEpisode } from '@shared/utils'

const logger = new Logger({ name: 'getAnimeIDInfo' })

export interface AnimeInfoBase {
  info: Optional<AnimeInfo>
  get(): void
}

class AnimeIDInfo implements AnimeInfoBase {
  $: CheerioAPI
  info: AnimeInfo
  constructor(api: CheerioAPI, link: string) {
    this.$ = api
    this.info = this.setLinks(link)
  }

  setLinks(link: string) {
    return {
      ...new AnimeLinkToEpisode(link, 'animeid').raw(),
      link
    }
  }

  parseType(s: string): AnimeInfo['type'] | undefined {
    const _s = s as AnimeInfo['type']
    switch (_s as AnimeInfo['type']) {
      case 'Serie':
        return _s
    }
    return
  }

  parseStatus(s: string): AnimeInfo['status'] | undefined {
    const _s = s as AnimeInfo['status']
    switch (_s) {
      case 'En emisión':
      case 'Finalizada':
        return _s
    }
    return
  }

  getEpisodeNumber(elm: Cheerio<Element>) {
    if (elm.length > 0) {
      const epRegex = /-([0-9]+)$/
      const episode = epRegex.exec(elm.attr('href') ?? '')?.[1]
      if (episode) {
        return parseInt(episode)
      }
    }
    return null
  }

  async setEpisodesRange() {
    const orderBtn = this.$('#ord[data-id]')
    if (orderBtn.length > 0) {
      const id = orderBtn.attr('data-id')
      const liEpisodes = this.$('#listado > li > a')
      let maxRange: number | null = null
      for (let i = 0; i < liEpisodes.length && maxRange === null; i++) {
        maxRange = this.getEpisodeNumber(this.$(liEpisodes.get(i)))
      }
      maxRange = maxRange ?? 1
      let minRange = 0
      logger.debug(`Obtained episodes info: id(${id}) maxRange(${maxRange})`)
      if (this.$('#paginas').children().length === 0) {
        minRange = this.getEpisodeNumber(this.$('#listado > li:last-child > a')) ?? 1
      } else {
        logger.debug('Too many episodes require pagination; Fetching for first episodes')
        const ascEps = await fetch(new URL(`https://www.animeid.tv/ajax/caps?id=${id}&ord=ASC`), {
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
            'x-requested-with': 'XMLHttpRequest'
          },
          method: 'GET'
        }).then((x) => x.json())
        minRange = parseInt(ascEps.list[0].numero ?? '1')
      }
      logger.debug(`minRange(${minRange})`)
      if (this.info) {
        this.info.episodesRange = {
          min: minRange,
          max: maxRange
        }
      }
    }
  }

  async setStatusLeft() {
    if (!this.info) return
    const data = this.$('div.status-left > div.cuerpo')
    this.info.type = this.parseType(data.find("strong:contains('Tipo') + span").text().trim())
    this.info.status = this.parseStatus(data.find("strong:contains('Estado') + span").text().trim())
    const emitted = data.find("strong:contains('Emitido') + span").text().trim()

    this.info.emitted = {}
    const emittedDate = moment(emitted, 'DD MMM YYYY', true)
    if (emittedDate.isValid()) {
      this.info.emitted.from = emittedDate.unix()
    } else {
      logger.error('Invalid date:', emitted)
    }
  }

  parseRelatedAnimeType(type: string): RelatedAnime['type'] | null {
    switch (type) {
      case 'Ova':
      case 'Serie':
        return type
      case 'Peli':
        return 'Película'
      case 'Espec.':
        return 'Especial'
    }
    return null
  }

  async setStatusRight() {
    if (!this.info) return
    const data = this.$('div.status-right')
    const related = data.find(".title:contains('Relacionados') + ul.cuerpo")
    this.info.related = related
      .find('li')
      .map((_idx, elm) => {
        const e = this.$(elm)
        const type = e.find('span').text()
        const aLink = e.find('a')
        return {
          type: this.parseRelatedAnimeType(type),
          link: aLink.attr('href') ?? '',
          name: aLink.text().trim()
        }
      })
      .toArray()
      .filter((x): x is RelatedAnime => {
        return !!(x.type && x.link && x.name)
      })
  }

  async setHeader() {
    if (!this.info) return
    const animeHeader = this.$('article#anime')
    this.info.image = animeHeader.find('figure > img[src]').attr('src')
    const titles = animeHeader.find('hgroup')
    this.info.title = titles.find('h1').text()
    this.info.otherTitles = titles.find('h2').text().split(', ')

    this.info.description = animeHeader.find('p.sinopsis').text()
    this.info.tags = animeHeader
      .find('ul.tags > li > a[href]')
      .map((_idx, elm) => {
        return this.$(elm).text()
      })
      .toArray()
  }

  async get() {
    await this.setEpisodesRange()
    await this.setHeader()
    await this.setStatusLeft()
    await this.setStatusRight()
    logger.debug('INFO', this.info)
    return this.info
  }
}

export const getAnimeIDInfo = async (anime: string, link?: string) => {
  if (!link || !new URL(link).origin.includes('animeid.tv')) {
    logger.warn(
      `getAnimeIDInfo: Invalid anime link (${link}), we'll try to find the correct using the anime info`
    )
    logger.debug('getAnimeIDInfo: Params', { anime, link })
    // Using invokeNames allows the use of cache
    const animes = await invokeNames.searchAnimeID.fn?.(anime)
    if (!(Array.isArray(animes) && animes.length > 0)) {
      logger.error(`getAnimeIDInfo: Trying to find anime "${anime}" but it wasn't found`)
      return null
    }
    const targetAnime = animes[0]
    link = targetAnime.link
  }
  if (!link) {
    logger.error('getAnimeIDInfo: No link provided')
    return null
  }

  logger.debug('Getting anime info html...', link)
  const animeHTML = await fetch(new URL(link)).then((x) => x.text())
  return new AnimeIDInfo(cheerio.load(animeHTML), link).get()
}
