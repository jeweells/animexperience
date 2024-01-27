import { Logger } from 'tslog'
import { MALImageFormats, RecentAnimeEpisode } from '@shared/types'
import { searchAnime } from '../../scanners/animeflv/fns/searchAnime'
import { BASE_ORIGIN, createAnimeFlvRequest } from '../../scanners/animeflv/window'
import { cleanName, similarity } from '../../utils'
import { getAnimeFlvEpisodeVideos } from '../getEpisodeVideos/getAnimeFlvEpisodeVideos'
import { ForcedAny } from '../../../shared/types'
const logger = new Logger({ name: 'searchAnimeFlv' })

export type RecentAnimeData = {
  entry: {
    mal_id: number
    images: MALImageFormats
    title: string
  }
  episodes: RecentAnimeEpisode[]
}

export const searchAnimeFlvFromMALEpisode = async (arg: RecentAnimeData) => {
  const params = new URLSearchParams()
  params.set('q', arg.entry.title)
  logger.debug('Searching...')
  return await getAnimeFlvEpisodeVideos(arg.entry.title, arg.episodes[0].mal_id)
}
export const searchAnimeFlv = async (animeName: string) => {
  const url = new URL(BASE_ORIGIN + '/browse')
  url.searchParams.set('q', cleanName(animeName.replace(/\((TV|OVA|SERIE|ESPECIAL)\)/gi, '')))
  const res = (await createAnimeFlvRequest(url.toString(), searchAnime)) as ForcedAny[]
  return res.sort((a, b) => {
    return similarity(b.name, animeName) - similarity(a.name, animeName)
  })
}
