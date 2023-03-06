import { configureStore } from '@reduxjs/toolkit'
import animeSearch from './reducers/animeSearch'
import followedAnimes from './reducers/followedAnimes'
import peek from './reducers/peek'
import player from './reducers/player'
import playerOptions from './reducers/playerOptions'
import recommendations from './reducers/recommendations'
import topView from './reducers/topView'
import watch from './reducers/watch'
import watched from './reducers/watched'
import watchHistory from './reducers/watchHistory'
import invokedLink from './reducers/invokedLink'
import notifications from './reducers/notifications'

export default configureStore({
    reducer: {
        watch,
        player,
        watched,
        recommendations,
        watchHistory,
        peek,
        topView,
        playerOptions,
        animeSearch,
        followedAnimes,
        invokedLink,
        notifications,
    },
})
