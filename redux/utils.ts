import { ThunkDispatch } from 'redux-thunk'
import { RootState } from './state'
import { AnyAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = useDispatch as () => AppDispatch
