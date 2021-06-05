// Defining createAsyncThunk types for this store
import { AsyncThunk, AsyncThunkPayloadCreator, SerializedError } from '@reduxjs/toolkit'
import { AnyAction, Dispatch } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { RootState } from './store'

declare module '@reduxjs/toolkit' {
    type AsyncThunkConfig = {
        state?: unknown
        dispatch?: Dispatch
        extra?: unknown
        rejectValue?: unknown
        serializedErrorType?: unknown
    }
    class RejectWithValue<RejectValue> {
        readonly payload: RejectValue
        name: string
        message: string
        constructor(payload: RejectValue)
    }
    type BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined> = {
        dispatch: D
        getState: () => S
        extra: E
        requestId: string
        signal: AbortSignal
        rejectWithValue(value: RejectedValue): RejectWithValue<RejectedValue>
    }
    type IsAny<T, True, False = never> = true | false extends (
        T extends never ? true : false
    )
        ? True
        : False
    type IsUnknown<T, True, False = never> = unknown extends T
        ? IsAny<T, False, True>
        : False
    type FallbackIfUnknown<T, Fallback> = IsUnknown<T, Fallback, T>
    type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
        dispatch: infer Dispatch
    }
        ? FallbackIfUnknown<
              Dispatch,
              ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>
          >
        : ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>
    type GetState<ThunkApiConfig> = ThunkApiConfig extends {
        state: infer State
    }
        ? State
        : unknown
    type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
        rejectValue: infer RejectValue
    }
        ? RejectValue
        : unknown
    type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
        extra: infer Extra
    }
        ? Extra
        : unknown

    type GetThunkAPI<ThunkApiConfig> = BaseThunkAPI<
        GetState<ThunkApiConfig>,
        GetExtra<ThunkApiConfig>,
        GetDispatch<ThunkApiConfig>,
        GetRejectValue<ThunkApiConfig>
    >
    type GetSerializedErrorType<ThunkApiConfig> = ThunkApiConfig extends {
        serializedErrorType: infer GetSerializedErrorType
    }
        ? GetSerializedErrorType
        : SerializedError
    interface AsyncThunkOptions<
        ThunkArg = void,
        ThunkApiConfig extends AsyncThunkConfig = {}
    > {
        /**
         * A method to control whether the asyncThunk should be executed. Has access to the
         * `arg`, `api.getState()` and `api.extra` arguments.
         *
         * @returns `false` if it should be skipped
         */
        condition?(
            arg: ThunkArg,
            api: Pick<GetThunkAPI<ThunkApiConfig>, 'getState' | 'extra'>,
        ): boolean | undefined
        /**
         * If `condition` returns `false`, the asyncThunk will be skipped.
         * This option allows you to control whether a `rejected` action with `meta.condition == false`
         * will be dispatched or not.
         *
         * @default `false`
         */
        dispatchConditionRejection?: boolean
        serializeError?: (x: unknown) => GetSerializedErrorType<ThunkApiConfig>
    }

    function createAsyncThunk<
        Returned,
        ThunkArg = void,
        ThunkApiConfig extends AsyncThunkConfig = {
            state: RootState
        }
    >(
        typePrefix: string,
        payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
        options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>,
    ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
}
