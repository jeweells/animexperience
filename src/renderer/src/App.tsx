import { ThemeProvider } from '@mui/material/styles'
import moment from 'moment'
import 'moment/locale/es'
import * as React from 'react'
import { Provider } from 'react-redux'
import { animeSearch, peek, watch } from '@reducers'

import CssBaseline from '@mui/material/CssBaseline'
import store from '~/redux/store'
import AnimeSearchModal from '@components/AnimeSearchModal'
import FollowedAnimesUpdates from '@components/FollowedAnimesUpdates'
import ContinueWatching from '@components/ContinueWatching'
import RecentAnimes from '@components/RecentAnimes'
import Topbar from '@components/Topbar'
import VideoPlayerModal from '@components/VideoPlayerModal'
import WatchInvokedLinkModal from '@components/WatchInvokedLinkModal'
import Notifications from '@components/Notifications'
import AnimePeekModal from '@components/AnimePeekModal'
import { VSpace } from './atoms/Spacing'
import { useInvokedLinks } from './hooks/useInvokedLinks'
import { useAppDispatch } from '~/redux/utils'
import theme from './theme'
import { Suspense } from 'react'

const Dev = React.lazy(() => import('~/src/dev'))

moment.locale('es')

const App = () => {
  const dispatch = useAppDispatch()
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
  const isDevWindow = location.hash.includes('dev')
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isDevWindow ? (
          <Suspense fallback={null}>
            <Dev />
          </Suspense>
        ) : (
          <App />
        )}
      </ThemeProvider>
    </Provider>
  )
}

export default AppWithProvider
