import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ForcedAny } from '@shared/types'

export type Token = ForcedAny

type State = {
  tokens: Token[]
}
export const MAX_TOKENS = 3

export const useTokens = create<State>()(
  immer<State>(() => ({
    tokens: Array(MAX_TOKENS).fill(null)
  }))
)

export const set = useTokens.setState.bind(useTokens)
export const get = useTokens.getState.bind(useTokens)

let nextIndex = 0
export const addToken = (token: Token) => {
  set((state) => {
    state.tokens[nextIndex] = token
    nextIndex = (nextIndex + 1) % MAX_TOKENS
  })
}
