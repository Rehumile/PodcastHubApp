import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../features/AudioPlayer/audioPlayerReducers";

export const store = configureStore({
    reducer: rootReducer
    
})