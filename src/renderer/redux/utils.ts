import { ThunkDispatch } from 'redux-thunk'
import { RootState } from './state'
import { AnyAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ForcedAny } from '@shared/types'

export type AppDispatch = ThunkDispatch<RootState, ForcedAny, AnyAction>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = useDispatch as () => AppDispatch
