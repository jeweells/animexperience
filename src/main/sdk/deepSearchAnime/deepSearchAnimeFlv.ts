import { DeepAnimeIdSearchResult } from '@shared/types'
import { searchAnimeByPage } from '../../scanners/animeflv/fns/searchAnimeByPage'
import { BASE_ORIGIN, createAnimeFlvRequest } from '../../scanners/animeflv/window'
import { cleanName } from '../../utils'

export const deepSearchAnimeFlvByPage = async (animeName: string, page = 1) => {
  const url = new URL(BASE_ORIGIN + '/browse')
  url.searchParams.set('q', cleanName(animeName.replace(/\((TV|OVA|SERIE|ESPECIAL)\)/gi, '')))
  url.searchParams.set('page', String(page))

  const r = (await createAnimeFlvRequest(
    url.toString(),
    searchAnimeByPage
  )) as unknown as DeepAnimeIdSearchResult
  return {
    ...r,
    search: animeName
  }
}
export const deepSearchAnimeFlv = (animeName: string) => {
  return deepSearchAnimeFlvByPage(animeName, 1)
}
