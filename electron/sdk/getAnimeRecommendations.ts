import cheerio from 'cheerio'
import { searchMalAnime } from './searchAnime'
import fetch from 'node-fetch'

export const getAnimeRecommendations = async (animeName: string) => {
    console.debug('Getting anime recommendations')
    const animes = await searchMalAnime(animeName)
    console.debug(`Found ${animes.length} animes that matches ${animeName}`)
    if (animes.length > 0) {
        console.debug('Best match:', animes[0])
        const recs = (await getMalAnimeRecommendations(animes[0].url)) ?? []
        console.debug(`Got recommendations for ${animeName}:`, recs.length)
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
        console.debug('No images found for', srcset)
        return ''
    }
    return malImageUrlToImage(images[0])
}

export const getMalAnimeRecommendations = async (malUrl: string) => {
    console.debug('Fetching MalAnimeRecommendations')
    const body = await fetch(new URL(malUrl)).then((x) => x.text())
    console.debug('Parsing html')
    const $ = cheerio.load(body)
    const items = $('#anime_recommendation li.btn-anime > a[href]')
    console.debug('Found', items.length, 'items')
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
                    console.debug(`Not found id for link: "${link}"`)
                }
            } else {
                console.debug('Not found link for node', idx)
            }
            return null
        })
        .toArray()
        .filter((x) => !!x)
}
