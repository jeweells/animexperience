import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import { VideoOption } from "../../../src/components/VideoPlayer";
import { RecentAnimeData } from "../../../src/hooks/useRecentAnimes";
import { Optional, Status } from "../../../src/types";
import { addFetchFlow } from "../utils";

// Define a type for the slice state
interface WatchState {
    watching?: Optional<RecentAnimeData>;
    availableVideos?: Optional<VideoOption[]>;
    status: {
        availableVideos?: Status;
    }
}

// Define the initial state using that type
const initialState: WatchState = {
    status: {}
};

const getAvailableVideos = createAsyncThunk(
    "watch/animeEpisode",
    async (arg, api) => {
        const state = api.getState();
        const anime = state.watch.watching;
        if (!anime) {
            return api.rejectWithValue("Needs to be watching to request available videos");
        }
        return (
            await ipcRenderer.invoke("getJKAnimeEpisodeVideos", anime.name, anime.episode)
        ) as Optional<VideoOption[]>;
    }
);

export const slice = createSlice({
    name: "watch",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set (state, { payload }: PayloadAction<Optional<RecentAnimeData>>) {
            state.watching = payload;
        },
        reset () {
            return initialState;
        }
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(addCase, getAvailableVideos, "availableVideos", (
            state,
            { payload }: PayloadAction<Optional<VideoOption[]>>,
        ) => {
            state.availableVideos = payload;
        });
    }
});

export const watch = {
    ...slice.actions,
    getAvailableVideos,
};
export default slice.reducer;
