import * as React from 'react'
import { IconButtonProps } from '@mui/material/IconButton'
import ShareButton from '../../atoms/ShareButton'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { notifications } from '@reducers/notifications'
import { PUBLIC_URL } from '../../constants'
import { error } from '@dev/events'

export const ShareAnimeButton = React.memo<IconButtonProps>((props) => {
  const info = useAppSelector((s) => s.peek.info)
  const dispatch = useAppDispatch()
  return (
    <ShareButton
      {...props}
      tooltip={'Compartir anime'}
      disabled={!info}
      onClick={() => {
        if (!info) return
        try {
          if (!info.link) throw new Error('No link')
          const splitWord = '/anime/'
          const splitIndex = info.link.indexOf(splitWord)
          if (splitIndex < 0) throw new Error('No index')
          const partialLink = info.link.substr(splitIndex + splitWord.length)
          if (!partialLink) throw new Error('Invalid partial link')
          const link =
            `${PUBLIC_URL}/watch?q=` +
            Buffer.from(
              JSON.stringify({
                ep: info.episodesRange?.min ?? 1,
                u: partialLink,
                i: info.image?.split('/').slice(-1)[0]
              }),
              'utf8'
            ).toString('base64')
          window.clipboard.writeText(link)
          dispatch(
            notifications.setMessage({
              message: 'Se ha copiado el enlace al portapapeles'
            })
          )
        } catch (e) {
          error('[CLIPBOARD]', e)
        }
      }}
    />
  )
})

ShareAnimeButton.displayName = 'ShareAnimeButton'

export default ShareAnimeButton
