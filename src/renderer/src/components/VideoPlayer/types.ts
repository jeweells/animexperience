import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { Optional } from '@shared/types'
import { VideoOption } from './index'

export type $IframeContents = JQuery<HTMLIFrameElement | Text | Comment | Document>
export type BasicVideoInfo = {
  option?: Optional<VideoOption>
  anime?: Optional<RecentAnimeData>
}

export type KnownOption =
  | 'mega'
  | 'fembed'
  | 'okru'
  | 'mixdrop'
  | 'streamtape'
  | 'stape'
  | 'maru'
  | 'sw'
  | 'yourupload'
