import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { AnimeIDAnimeMatch, DeepAnimeIdSearchResult } from '../../../shared/types'
import { cached } from '../../cache'

export const deepSearchAnimeIdByPage = async (animeName: string, page: number) => {
  return deepSearchAnimeIdRaw(animeName.replace(/\./g, '').slice(0, 50), page)
}
const deepSearchAnimeIdRaw = cached(async (animeName: string, page: number) => {
  const url = new URL('http://www.animeid.tv/buscar')
  url.searchParams.append('q', animeName)
  if (page > 1) {
    url.searchParams.append('pag', String(page))
  }
  const html = await fetch(url).then((x) => x.text())
  const $ = cheerio.load(html)
  const result = $('#result > article')
    .map((_idx, elm) => {
      const node = $(elm)
      const name = node.find('header').text()
      const link = node.find('a[href]').attr('href')
      const image = node.find('img[src]').attr('src')
      if (name && link && image) {
        return {
          name,
          link: 'http://www.animeid.tv' + link,
          image
        } as AnimeIDAnimeMatch
      }
      return null
    })
    .toArray()
    .filter((x) => !!x)
  const lastPageHref = $('#result > #paginas > ul.pagination > li:last-child > a[href]').attr(
    'href'
  )
  const fResult: DeepAnimeIdSearchResult = {
    search: animeName,
    matches: result,
    hasNext: false
  }
  if (lastPageHref) {
    const regex = /pag=([0-9]+)$/
    const lastPageStr = regex.exec(lastPageHref)?.[1]
    if (lastPageStr) {
      fResult.nextPage = page + 1
      fResult.maxPage = parseInt(lastPageStr)
      fResult.hasNext = true
    }
  }
  return fResult
})
export const deepSearchAnimeId = (animeName: string) => {
  return deepSearchAnimeIdByPage(animeName, 1)
}
