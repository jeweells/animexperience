import { ActionReducerMapBuilder, AsyncThunk, CaseReducer } from '@reduxjs/toolkit'
import { FStatus } from '../../src/types'

type StateFlowType<Keys extends string> = {
    status: Partial<Record<Keys, FStatus>>
}

export const addFetchFlow = <State extends StateFlowType<any>>(
    addCase: ActionReducerMapBuilder<State>['addCase'],
    reducer: AsyncThunk<any, any, any>,
    name: keyof State['status'],
    fullfiled?: CaseReducer<State, ReturnType<typeof reducer['fulfilled']>>,
) => {
    addCase(reducer.pending, (s) => {
        s.status[name] = 'loading'
    })
    addCase(reducer.fulfilled, (s, p) => {
        s.status[name] = 'succeeded'
        fullfiled?.(s, p)
    })
    addCase(reducer.rejected, (s) => {
        s.status[name] = 'failed'
    })
}
