import React from 'react'
import { IconButtonProps } from '@mui/material/IconButton'
import ShareButton from '../../atoms/ShareButton'
import { useAppSelector } from '../../../redux/store'
import { APP_PROTOCOL } from '../../../electron/constants'
import { clipboard } from 'electron'

export const ShareAnimeEpisodeButton = React.memo<IconButtonProps>((props) => {
    const watching = useAppSelector((s) => s.watch.watching)
    return (
        <ShareButton
            {...props}
            disabled={!watching}
            onClick={() => {
                if (!watching) return
                try {
                    if (!watching.link) return
                    const splitWord = '/ver/'
                    const splitIndex = watching.link.indexOf(splitWord)
                    if (splitIndex < 0) return
                    const partialLink = watching.link
                        .substr(splitIndex + splitWord.length)
                        .replace(new RegExp(`-${watching.episode}$`), '')
                    if (!partialLink) return
                    const link =
                        `${APP_PROTOCOL}://watch/?q=` +
                        Buffer.from(
                            JSON.stringify({
                                ep: watching.episode,
                                u: partialLink,
                            }),
                            'utf8',
                        ).toString('base64')
                    clipboard.writeText(link)
                } catch (e) {
                    console.error('[CLIPBOARD]', e)
                }
            }}
        />
    )
})

ShareAnimeEpisodeButton.displayName = 'ShareAnimeEpisodeButton'

export default ShareAnimeEpisodeButton
