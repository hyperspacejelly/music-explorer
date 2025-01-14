import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{}
});

// gets typedef out of store
export type AppStore = typeof store;

//  Infers RootState and AppDispatch types from the store
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
