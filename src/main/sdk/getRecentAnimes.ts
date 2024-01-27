import { Logger } from 'tslog'
import { listRecentAnimes } from '../scanners/animeflv/fns/listRecentAnimes'
import { BASE_ORIGIN, createAnimeFlvRequest } from '../scanners/animeflv/window'

const logger = new Logger({ name: 'getRecentAnimes' })

export const getRecentAnimes = async () => {
  logger.debug('Getting recent animes...')
  return await createAnimeFlvRequest(BASE_ORIGIN, listRecentAnimes)
}
