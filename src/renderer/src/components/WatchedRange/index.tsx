import moment from 'moment'
import * as React from 'react'
import { styled } from '@mui/system'
import { EpisodeInfo } from '@shared/types'
import { Optional } from '@shared/types'
import Tooltip from '@mui/material/Tooltip'

export type WatchedRangeProps = {
  info: Optional<EpisodeInfo>
  showTime?: boolean
  hideBorder?: boolean
}

const Back = styled('div')<{ hideBorder?: boolean }>`
  width: 100%;
  background: rgba(154, 154, 154, 0.2);
`

const Progress = styled('div')`
  height: 4px;
  background: rgba(220, 220, 220, 0.64);
  transition: all 400ms;
`
const hhmmss = (seconds: number) => {
  const mmt = moment().startOf('day').seconds(seconds)
  if (!mmt) return '00:00'
  if (seconds < 3600) {
    return mmt.format('mm:ss')
  }
  return mmt.format('HH:mm:ss')
}

export const WatchedRange: React.FC<WatchedRangeProps> = React.memo<WatchedRangeProps>(
  ({ info, showTime, hideBorder }) => {
    const currTime = info?.currentTime
    const duration = info?.duration
    const isValid =
      typeof duration === 'number' &&
      typeof currTime === 'number' &&
      isFinite(duration) &&
      isFinite(currTime) &&
      duration !== 0
    const fmtDuration = React.useMemo(
      () => (isValid ? `${hhmmss(currTime)} / ${hhmmss(duration)}` : ''),
      [currTime, duration]
    )

    if (!isValid) return null

    return (
      <React.Fragment>
        <Tooltip
          open={showTime ? false : undefined}
          enterDelay={1000}
          enterNextDelay={1000}
          enterTouchDelay={1000}
          followCursor
          title={fmtDuration}
        >
          <Back hideBorder={hideBorder}>
            <Progress
              style={{
                width: `${isValid ? (currTime / duration) * 100 : 0}%`
              }}
            />
          </Back>
        </Tooltip>
        {info && showTime && fmtDuration && <div>{fmtDuration}</div>}
      </React.Fragment>
    )
  }
)

WatchedRange.displayName = 'WatchedRange'

export default WatchedRange
