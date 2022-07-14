import { EpisodeInfo } from '../../../globals/types'
import { Optional } from '../../types'
import { BasicVideoInfo } from './types'

export const handleSeek = (
    info: BasicVideoInfo,
    data: Optional<EpisodeInfo>,
    video: HTMLVideoElement,
): void => {
    const opt = info.option?.name.toLowerCase()

    switch (opt) {
        case 'okru': // Okru is handled injecting functionallity before clicking the play button
            break
        default:
            {
                const handler = () => {
                    if (data && data.currentTime) {
                        if (Math.abs(video.currentTime - data.currentTime) > 5) {
                            video.currentTime = data.currentTime
                        }
                    }
                    if (video.paused) {
                        video.play()
                    }
                }
                video.addEventListener('canplay', handler, { once: true })
            }
            break
    }
}
