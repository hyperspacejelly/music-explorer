import { configureStore } from "@reduxjs/toolkit";

import albumListReducer from './features/albums/albumsSlice';
import userReducer from "./features/user/userSlice";
import highlightReducer from "./features/highlight/highlightSlice";
import searchReducer from "./features/search/searchSlice"

export const store = configureStore({
    reducer:{
        albumList: albumListReducer,
        user: userReducer,
        highlight: highlightReducer,
        search: searchReducer
    }
});


//  Infers RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store["getState"]>;
export type AppDispatch = typeof store["dispatch"];
