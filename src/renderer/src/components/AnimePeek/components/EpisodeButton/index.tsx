import { memo, FC, useCallback, useMemo } from 'react'
import { styled } from '@mui/system'
import { AnimeInfo } from '@shared/types'
import { watch } from '@reducers/watch'
import { FRowG16 } from '~/src/atoms/Layout'
import { useWatched } from '~/src/hooks/useWatched'
import WatchedRange from '../../../WatchedRange'
import Button from '@mui/material/Button'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import Tooltip from '@mui/material/Tooltip'
import { EPISODE_BUTTON } from '@selectors'
import { useAppDispatch } from '~/redux/utils'

export const SEpisodeButton = styled(Button)`
  width: 100%;
  text-align: left;
  justify-content: flex-start;
`

export type EpisodeButtonProps = {
  info: AnimeInfo
  episode: number
}

const WatchedInfo = styled(FRowG16)`
  flex: 1;
  align-items: center;
`

const Content = styled(FRowG16)`
  align-items: center;
  width: 100%;
  justify-content: space-between;
`

export const EpisodeButton: FC<EpisodeButtonProps> = memo(({ episode, info }) => {
  const epData = useMemo(() => {
    return {
      episode,
      name: info.title,
      link: info.episodeLink.replace(info.episodeReplace, String(episode)),
      img: info.image
    }
  }, [info, episode])
  const watched = useWatched(epData)
  const dispatch = useAppDispatch()
  return (
    <Tooltip title={'Ver episodio'} arrow placement={'right'}>
      <SEpisodeButton
        data-testid={EPISODE_BUTTON.WATCH_BUTTON}
        onClick={useCallback(() => {
          dispatch(watch.watchEpisode(epData))
        }, [])}
      >
        <Content>
          <div>{`Episodio ${episode}`}</div>
          <WatchedInfo>
            {watched && <WatchedRange info={watched} showTime={true} hideBorder={true} />}
          </WatchedInfo>
          <PlayArrowRoundedIcon style={{ fontSize: '1.4rem', overflow: 'hidden' }} />
        </Content>
      </SEpisodeButton>
    </Tooltip>
  )
})

EpisodeButton.displayName = 'EpisodeButton'

export default EpisodeButton
