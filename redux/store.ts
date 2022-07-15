import './store.types'
import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Optional, FStatus } from '../src/types'
import animeSearch from './reducers/animeSearch'
import followedAnimes from './reducers/followedAnimes'
import peek from './reducers/peek'
import player from './reducers/player'
import playerOptions from './reducers/playerOptions'
import recommendations from './reducers/recommendations'
import test from './reducers/test'
import topview from './reducers/topview'
import watch from './reducers/watch'
import watched from './reducers/watched'
import watchHistory from './reducers/watchHistory'
import invokedLink from './reducers/invokedLink'

const store = configureStore({
    reducer: {
        test,
        watch,
        player,
        watched,
        recommendations,
        watchHistory,
        peek,
        topview,
        playerOptions,
        animeSearch,
        followedAnimes,
        invokedLink,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export interface TypedUseRelaySelectorHook<TState> {
    <TSelected>(
        dataSelector: (state: TState) => TSelected,
        statusSelector: (state: TState) => Optional<FStatus>,
        equalityFn?: (left: TSelected, right: TSelected) => boolean,
    ): TSelected
}

export const useRelaySelector: TypedUseRelaySelectorHook<RootState> = (
    dataSelector,
    statusSelector,
    equalityFn,
) => {
    const data = useAppSelector(dataSelector, equalityFn)
    const status = useAppSelector(statusSelector)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = React.useRef<Promise<any>>()
    if (status === 'idle' || status === 'loading') {
        if (ref.current) {
            throw ref.current
        }
        ref.current = new Promise((resolve, reject) => {
            const unsub: { unsubscribe?(): void } = {}
            unsub.unsubscribe = store.subscribe(() => {
                const status = statusSelector(store.getState())
                if (status === 'failed') {
                    unsub.unsubscribe?.()
                    reject(status)
                } else if (status === 'succeeded') {
                    unsub.unsubscribe?.()
                    resolve()
                }
            })
        })
        throw ref.current
    } else {
        ref.current = undefined
    }
    return data
}

export default store
