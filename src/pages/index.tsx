import moment from 'moment'
import 'moment/locale/es'
import React from 'react'
import { Provider } from 'react-redux'
import { animeSearch } from '../../redux/reducers/animeSearch'
import { peek } from '../../redux/reducers/peek'
import { watch } from '../../redux/reducers/watch'
import store, { useAppDispatch } from '../../redux/store'
import AnimePeekModal from '.././components/AnimePeekModal'
import AnimeSearchModal from '.././components/AnimeSearchModal'
import ContinueWatching from '.././components/ContinueWatching'
import FollowedAnimesUpdates from '.././components/FollowedAnimesUpdates'
import RecentAnimes from '.././components/RecentAnimes'
import RecentlyWatchedRecommendations from '.././components/RecentlyWatchedRecommendations'
import Topbar from '.././components/Topbar'
import { VSpace } from '../atoms/Spacing'
import { VideoPlayerModal } from '../components/VideoPlayerModal'
import '../index.less'
import { useInvokedLinks } from '../hooks/useInvokedLinks'
import WatchInvokedLinkModal from '../components/WatchInvokedLinkModal'
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
                <RecentlyWatchedRecommendations />
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
