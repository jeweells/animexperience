import moment from 'moment'
import 'moment/locale/es'
import React from 'react'
import { Provider } from 'react-redux'
import { animeSearch, peek, watch } from '@reducers'

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
    Notifications,
} from '@components'
import { VSpace } from '../atoms/Spacing'
import '../index.less'
import { useInvokedLinks } from '../hooks/useInvokedLinks'
import { useAppDispatch } from '~/redux/utils'

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
                        },
                    }}
                />
                <AnimePeekModal
                    TransitionProps={{
                        onExited: () => {
                            dispatch(peek.setInfo(null))
                        },
                    }}
                />
                <AnimeSearchModal
                    TransitionProps={{
                        onExited: () => {
                            dispatch(animeSearch.setSearching(false))
                        },
                    }}
                />
                <WatchInvokedLinkModal />
                <Notifications />
            </Topbar>
        </React.Fragment>
    )
}

const Index = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

export default Index
