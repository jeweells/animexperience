import { EpisodeInfo } from '../../../globals/types'
import { Optional } from '../../types'
import { rendererInvoke } from '../../utils'
import { VideoOption } from './index'
import { $IframeContents } from './types'
import { deepIframes } from './utils'

export const handleFullScreen = (
    option: Optional<VideoOption>,
    contents: $IframeContents,
    episodeInfo: Optional<EpisodeInfo>,
) => {
    if (document.fullscreenElement) return true

    const methods: Partial<Record<
        string,
        (contents: $IframeContents, episodeInfo?: Optional<EpisodeInfo>) => boolean
    >> = {
        // Some might be repeated since they are handled the same way
        fembed: handleFembed,
        okru: handleOkru,
        mixdrop: handleMixDrop,
        streamtape: handleStreamtape,
        nozomi: handleNozomi,
        desu: handleNozomi,
        'xtreme s': handleXtremeS,
    }
    const handler = methods[option?.name?.toLowerCase() ?? '']
    if (handler) {
        for (const iframe of deepIframes(contents)) {
            if (handler(iframe, episodeInfo)) {
                return !!document.fullscreenElement
            }
        }
    }

    return false
}

const simpleSendF = (
    iframe: $IframeContents,
    selector: string,
    beforeClick?: (elm: HTMLElement) => void,
) => {
    const elm = iframe.find(selector).get(0)
    if (elm) {
        if (elm.ownerDocument.activeElement !== elm) {
            elm.addEventListener(
                'focus',
                async () => {
                    if (!document.fullscreenElement) {
                        beforeClick?.(elm)
                        console.debug('Pressing F key')
                        await rendererInvoke('keyDown', 'f')
                    }
                },
                { once: true },
            )
            elm.focus()
        }
        return true
    }
    return false
}

const simpleSendFWClick = (iframe: $IframeContents, selector: string) => {
    return simpleSendF(iframe, selector, (elm) => {
        elm.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 'f' && !document.fullscreenElement) {
                    elm.click()
                }
            },
            { once: true },
        )
    })
}

export const handleStreamtape = (iframe: $IframeContents) => {
    return simpleSendF(iframe, 'button[data-plyr=fullscreen]')
}

export const handleNozomi = (iframe: $IframeContents) => {
    return simpleSendFWClick(
        iframe,
        'button.dplayer-full-icon[data-balloon=Pantalla\\ completa]',
    )
}

export const handleXtremeS = (iframe: $IframeContents) => {
    return simpleSendFWClick(iframe, 'button.vjs-fullscreen-control[title=Fullscreen]')
}

export const handleMixDrop = (iframe: $IframeContents) => {
    return simpleSendFWClick(iframe, 'button.vjs-fullscreen-control[title=Fullscreen]')
}

export const handleFembed = (iframe: $IframeContents) => {
    return simpleSendF(iframe, 'div#vstr[aria-label=Video\\ Player]')
}

export const handleOkru = (iframe: $IframeContents) => {
    return simpleSendF(iframe, '#embedVideoE')
}
