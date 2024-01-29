import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { Logger } from 'tslog'
import { cleanName, similarity } from '../../utils'
const logger = new Logger({ name: 'searchJKAnime' })

export type JKAnimeSearchResult = Partial<{
  name: string
  link: string
}>
export type JKAnimeSearchResults = JKAnimeSearchResult[]
export const searchJKAnime = async (animeName: string) => {
  const filteredName = cleanName(animeName)
    .split(' ')
    .filter((x) => !!x)
    .map((x) => x.toLowerCase())
    .join('_')

  logger.debug('SearchingJKAnime:', animeName, '->', filteredName)
  const body = await fetch(new URL(`https://jkanime.net/buscar/${filteredName}/1/`)).then((x) =>
    x.text()
  )
  const $ = cheerio.load(body)
  return $('.anime__page__content > .row')
    .children()
    .map((_, child) => {
      const node = $(child)
      const a = node.find('a')
      return {
        name: a.text(),
        link: a.attr('href')
      }
    })
    .toArray()
    .sort((a, b) => {
      return similarity(b.name, animeName) - similarity(a.name, animeName)
    })
}
