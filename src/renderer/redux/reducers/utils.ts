import {
  ActionReducerMapBuilder,
  AsyncThunk,
  CaseReducer,
  createAsyncThunk,
  createSlice as _createSlice,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers
} from '@reduxjs/toolkit'
import { ForcedAny, FStatus } from '@shared/types'
import { initialState, RootState } from '../state'
import { AppDispatch } from '../utils'

type StateFlowType<Keys extends string> = {
  status: Partial<Record<Keys, FStatus>>
}

type ThunkApiConfig = {
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
  extra: { s: string; n: number }
}
export const asyncAction = createAsyncThunk.withTypes<ThunkApiConfig>()
export type AsyncAction = AsyncThunk<ForcedAny, ForcedAny, ThunkApiConfig>
export const addFetchFlow = <State extends StateFlowType<ForcedAny>>(
  addCase: ActionReducerMapBuilder<State>['addCase'],
  reducer: AsyncAction,
  name: keyof State['status'],
  fulfilled?: CaseReducer<State, ReturnType<(typeof reducer)['fulfilled']>>
) => {
  addCase(reducer.pending, (s) => {
    s.status[name] = 'loading'
  })
  addCase(reducer.fulfilled, (s, p) => {
    s.status[name] = 'succeeded'
    fulfilled?.(s, p)
  })
  addCase(reducer.rejected, (s) => {
    s.status[name] = 'failed'
  })
}

export const createSlice = <
  Name extends keyof RootState,
  CaseReducers extends SliceCaseReducers<RootState[Name]>
>(
  options: Omit<CreateSliceOptions<RootState[Name], CaseReducers, Name>, 'initialState'>
): Slice<RootState[Name], CaseReducers, Name> => {
  return _createSlice({
    ...options,
    initialState: initialState[options.name]
  })
}
