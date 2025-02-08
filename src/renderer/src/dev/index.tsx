import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEvents } from './hooks/useEvents'
import { MessagesByType } from './components/MessagesByType'
import { DevMessage } from '~/src/dev/types'
import { MAX_TOKENS } from '~/src/dev/hooks/useTokens'
import { range } from '~/src/utils'
import { TokenViewer } from '~/src/dev/components/TokenViewer'
export default function Dev() {
  useEvents()
  return (
    <div style={{ padding: 32 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MessagesByType />
        </Grid>
        {(['info', 'debug', 'warn', 'error'] as DevMessage['type'][]).map((type) => {
          return (
            <Grid key={type} item xs={6}>
              <Typography fontWeight={600} marginBottom={2}>
                {type.toUpperCase()}
              </Typography>
              <MessagesByType type={type} />
            </Grid>
          )
        })}
        {range(MAX_TOKENS).map((index) => {
          return (
            <Grid key={index} item xs={4}>
              <TokenViewer index={index} />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
