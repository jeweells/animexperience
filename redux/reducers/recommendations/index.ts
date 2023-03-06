import { PayloadAction } from '@reduxjs/toolkit'
import { RecommendationInfo } from '../../../globals/types'
import { FStatus } from '../../../src/types'
import { rendererInvoke } from '../../../src/utils'
import { asyncAction, createSlice } from '../utils'

const fetchRecommendations = asyncAction(
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

export const slice = createSlice({
    name: 'recommendations',
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
