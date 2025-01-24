import { configureStore } from "@reduxjs/toolkit";

import albumListReducer from './features/albums/albumsSlice';
import userReducer from "./features/user/userSlice";
import highlightReducer from "./features/highlight/highlightSlice";

export const store = configureStore({
    reducer:{
        albums: albumListReducer,
        user: userReducer,
        highlight: highlightReducer
    }
});


//  Infers RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store["getState"]>;
export type AppDispatch = typeof store["dispatch"];
