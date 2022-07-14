import { malImageUrlToImage } from './getAnimeRecommendations'
import { searchMalAnime } from './searchAnime/searchMalAnime'

export const getAnimeImage = (animeName: string) => {
    return getMalAnimeImage(animeName)
}

export const getMalAnimeImage = async (animeName: string) => {
    const animes = await searchMalAnime(animeName)
    // eslint-disable-next-line camelcase
    return malImageUrlToImage(animes?.[0]?.image_url)
}
