import moment from 'moment'
import 'moment/locale/es'
import * as React from 'react'
import { Provider } from 'react-redux'
import { animeSearch, peek, watch } from '@reducers'
import CssBaseline from '@mui/material/CssBaseline'

import store from '~/redux/store'
import {
  AnimePeekModal,
  AnimeSearchModal,
  FollowedAnimesUpdates,
  ContinueWatching,
  RecentAnimes,
  Topbar,
  VideoPlayerModal,
  WatchInvokedLinkModal,
  Notifications
} from '@components'
import { VSpace } from './atoms/Spacing'
import { useInvokedLinks } from './hooks/useInvokedLinks'
import { useAppDispatch } from '~/redux/utils'
import { ThemeProvider } from '@mui/material'
import theme from './theme'
import { useEffect } from 'react'

moment.locale('es')

const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    navigator.mediaSession.setActionHandler('pause', () => {
      console.debug('This shit has been paused 🥵🥵')
    })
  }, [])
  useInvokedLinks()

  return (
    <React.Fragment>
      <Topbar>
        <FollowedAnimesUpdates />
        <ContinueWatching />
        <RecentAnimes />
        <VSpace size={32} />
        <VideoPlayerModal
          TransitionProps={{
            onExited: () => {
              dispatch(watch.reset())
            }
          }}
        />
        <AnimePeekModal
          TransitionProps={{
            onExited: () => {
              dispatch(peek.setInfo(null))
            }
          }}
        />
        <AnimeSearchModal
          TransitionProps={{
            onExited: () => {
              dispatch(animeSearch.setSearching(false))
            }
          }}
        />
        <WatchInvokedLinkModal />
        <Notifications />
      </Topbar>
    </React.Fragment>
  )
}
const AppWithProvider = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  )
}

export default AppWithProvider
