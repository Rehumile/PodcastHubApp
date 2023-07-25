import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedEpisode: null
}

export const playerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        selectedEpisode: (state, action) => {
            state.selectedEpisode= action.payload
        }
    }
})

export const { selectedEpisode } = playerSlice.actions
export default playerSlice.reducer