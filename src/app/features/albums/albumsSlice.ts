import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import type { album } from "../../../typedefs";

type initStateType = {
    albumList :album[],
    highlight :album | undefined
}

const initialState :initStateType = {
    albumList : [],
    highlight : undefined
};

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers:{}
});


export const selectAllAlbums = (state :RootState) => state.albums.albumList;
export const selectHighlightedAlbum = (state :RootState) => state.albums.highlight;
