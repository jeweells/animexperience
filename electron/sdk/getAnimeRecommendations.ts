import cheerio from 'cheerio'
import { Logger } from 'tslog'
import fetch from 'node-fetch'
import { searchMalAnime } from './searchAnime/searchMalAnime'

const logger = new Logger({ name: 'getAnimeRecommendations' })

export const getAnimeRecommendations = async (animeName: string) => {
    // Maximum 100 characters
    animeName = animeName.slice(0, 100)
    logger.debug('Getting anime recommendations')
    const animes = await searchMalAnime(animeName)
    logger.debug(`Found ${animes.length} animes that matches ${animeName}`)
    if (animes.length > 0) {
        logger.debug('Best match:', animes[0])
        const recs = (await getMalAnimeRecommendations(animes[0].url)) ?? []
        logger.debug(`Got recommendations for ${animeName}:`, recs.length)
        return recs
    }
    return []
}

export const malImageUrlToImage = (imgUrl: string) => {
    const imageUrl = new URL(imgUrl)
    imageUrl.search = ''
    imageUrl.pathname = imageUrl.pathname.replace(/^\/r\/[0-9]+x[0-9]+\//, '/')
    return imageUrl.toString()
}
const getMalImageFromSrcSet = (srcset: string) => {
    const images = srcset
        .split(' ')
        .map((x) => {
            return x.replace(/^[1-2]x,/, '')
        })
        .filter((x) => !!x)
    if (images.length === 0) {
        logger.debug('No images found for', srcset)
        return ''
    }
    return malImageUrlToImage(images[0])
}

export const getMalAnimeRecommendations = async (malUrl: string) => {
    logger.debug('Fetching MalAnimeRecommendations')
    const body = await fetch(new URL(malUrl)).then((x) => x.text())
    logger.debug('Parsing html')
    const $ = cheerio.load(body)
    const items = $('#anime_recommendation li.btn-anime > a[href]')
    logger.debug('Found', items.length, 'items')
    return items
        .map((idx, elm) => {
            const node = $(elm)
            const link = node.attr('href')
            if (link) {
                const id =
                    /-([0-9]+)$/.exec(link)?.[1] ?? /anime\/([0-9]+)\//.exec(link)?.[1]
                if (id) {
                    const srcset = node.find('img[data-srcset]').attr('data-srcset') ?? ''

                    const title = node.find('span.title').text()
                    return {
                        id: parseInt(id),
                        name: title,
                        image: getMalImageFromSrcSet(srcset),
                    }
                } else {
                    logger.debug(`Not found id for link: "${link}"`)
                }
            } else {
                logger.debug('Not found link for node', idx)
            }
            return null
        })
        .toArray()
        .filter((x) => !!x)
}
