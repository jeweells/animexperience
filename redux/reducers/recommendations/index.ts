import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RecommendationInfo } from '../../../globals/types'
import { FStatus } from '../../../src/types'
import { rendererInvoke } from '../../../src/utils'

// Define a type for the slice state
interface RecommendationsState {
    [name: string]: Partial<{
        status: FStatus
        recommendations: RecommendationInfo[]
    }>
}

const fetchRecommendations = createAsyncThunk(
    'recommendations/fetchRecommendations',
    async (animeName: string, api) => {
        api.dispatch(recommendations.setStatus({ name: animeName, status: 'loading' }))
        const recs = await rendererInvoke('getAnimeRecommendations', animeName)
        if (Array.isArray(recs)) {
            api.dispatch(
                recommendations.setRecommendations({
                    name: animeName,
                    recommendations: recs,
                }),
            )
            api.dispatch(
                recommendations.setStatus({ name: animeName, status: 'succeeded' }),
            )
        } else {
            api.dispatch(recommendations.setStatus({ name: animeName, status: 'failed' }))
        }
    },
)

// Define the initial state using that type
const initialState: RecommendationsState = {}

export const slice = createSlice({
    name: 'recommendations',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setStatus(state, { payload }: PayloadAction<{ name: string; status: FStatus }>) {
            if (!state[payload.name]) {
                state[payload.name] = {}
            }
            state[payload.name].status = payload.status
        },
        setRecommendations(
            state,
            {
                payload,
            }: PayloadAction<{ name: string; recommendations: RecommendationInfo[] }>,
        ) {
            if (!state[payload.name]) {
                state[payload.name] = {}
            }
            state[payload.name].recommendations = payload.recommendations
        },
    },
})

export const recommendations = {
    ...slice.actions,
    fetchRecommendations,
}
export default slice.reducer
