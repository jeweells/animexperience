import * as React from 'react'
import { IconButtonProps } from '@mui/material/IconButton'
import ShareButton from '../../atoms/ShareButton'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { notifications } from '@reducers'
import { PUBLIC_URL } from '../../constants'

export const ShareAnimeEpisodeButton = React.memo<IconButtonProps>((props) => {
  const watching = useAppSelector((s) => s.watch.watching)
  const dispatch = useAppDispatch()
  return (
    <ShareButton
      {...props}
      tooltip={'Compartir episodio'}
      disabled={!watching}
      onClick={() => {
        if (!watching) return
        try {
          if (!watching.link) throw new Error('No link')
          const splitWord = '/ver/'
          const splitIndex = watching.link.indexOf(splitWord)
          if (splitIndex < 0) throw new Error('No index')
          const partialLink = watching.link
            .substr(splitIndex + splitWord.length)
            .replace(new RegExp(`-${watching.episode}$`), '')
          if (!partialLink) throw new Error('Invalid partial link')
          const link =
            `${PUBLIC_URL}/watch?q=` +
            Buffer.from(
              JSON.stringify({
                ep: watching.episode,
                u: partialLink,
                i: watching.img?.split('/').slice(-1)[0]
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
          console.error('[CLIPBOARD]', e)
        }
      }}
    />
  )
})

ShareAnimeEpisodeButton.displayName = 'ShareAnimeEpisodeButton'

export default ShareAnimeEpisodeButton
