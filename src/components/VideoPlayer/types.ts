import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { Optional } from '../../types'
import { VideoOption } from './index'

export type $IframeContents = JQuery<HTMLIFrameElement | Text | Comment | Document>
export type BasicVideoInfo = {
    option?: Optional<VideoOption>
    anime?: Optional<RecentAnimeData>
}
