import React from 'react'
import { IconButtonProps } from '@mui/material/IconButton'
import ShareButton from '../../atoms/ShareButton'
import { useAppSelector } from '../../../redux/store'
import { APP_PROTOCOL } from '../../../electron/constants'
import { clipboard } from 'electron'

export const ShareAnimeButton = React.memo<IconButtonProps>((props) => {
    const info = useAppSelector((s) => s.peek.info)
    return (
        <ShareButton
            {...props}
            disabled={!info}
            onClick={() => {
                if (!info) return
                try {
                    if (!info.link) return
                    const splitWord = '/anime/'
                    const splitIndex = info.link.indexOf(splitWord)
                    if (splitIndex < 0) return
                    const partialLink = info.link.substr(splitIndex + splitWord.length)
                    if (!partialLink) return
                    const link =
                        `${APP_PROTOCOL}://watch/?q=` +
                        Buffer.from(
                            JSON.stringify({
                                ep: info.episodesRange?.min ?? 1,
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

ShareAnimeButton.displayName = 'ShareAnimeButton'

export default ShareAnimeButton
