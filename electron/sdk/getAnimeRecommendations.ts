import cheerio from 'cheerio'
import { searchMalAnime } from './searchAnime'
import fetch from 'node-fetch'

export const getAnimeRecommendations = async (animeName: string) => {
    console.debug('Getting anime recommendations')
    const animes = await searchMalAnime(animeName)
    console.debug(`Got recommendations for ${animeName}:`, animes.length)
    if (animes.length > 0) {
        return (await getMalAnimeRecommendations(animes[0].url)) ?? []
    }
    return []
}

const getImage = (srcset: string) => {
    const images = srcset
        .split(' ')
        .map((x) => {
            return x.replace(/^[1-2]x,/, '')
        })
        .filter((x) => !!x)
    if (images.length === 0) {
        console.debug('No images found for', srcset)
        return ''
    }

    const imageUrl = new URL(images[0])
    console.debug(imageUrl)
    imageUrl.search = ''
    imageUrl.pathname = imageUrl.pathname.replace(/^\/r\/[0-9]+x[0-9]+\//, '/')
    return imageUrl.toString()
}

export const getMalAnimeRecommendations = async (malUrl: string) => {
    console.debug('Fetching MalAnimeRecommendations')
    const body = await fetch(malUrl).then((x) => x.text())
    console.debug('Parsing html')
    const $ = cheerio.load(body)
    const items = $('#anime_recommendation li.btn-anime > a[href]')
    console.debug('Found', items.length, 'items')
    return items
        .map((idx, elm) => {
            const node = $(elm)
            const link = node.attr('href')
            if (link) {
                const id = /-([0-9]+)$/.exec(link)?.[1]
                if (id) {
                    const srcset = node.find('img[data-srcset]').attr('data-srcset') ?? ''

                    const title = node.find('span.title').text()
                    return {
                        id: parseInt(id),
                        name: title,
                        image: getImage(srcset),
                    }
                }
            }
            return null
        })
        .toArray()
        .filter((x) => !!x)
}
