import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store";
import type { album } from "../../../typedefs";

import { get_albums as getAlbumURL } from "../../../API_ENDPOINT";

type albumSliceState = {
    albumList :album[] | undefined,
    totalResults: number,
    sort : {
        liked: boolean,
        category :string,
        order: "asc" | "desc",
    }
    filter :string,
    page: number
}

const initialState :albumSliceState = {
    albumList : [],
    totalResults: 25,
    sort:{
        liked: false,
        category: "",
        order: "desc"
    },
    filter: "",
    page: 1
};

export const fetchAlbumPage = createAsyncThunk< album[], void, {dispatch : AppDispatch, state: RootState} >("albums/fetchAlbumPage", async(arg, thunkApi) => {
    const state = thunkApi.getState();

    console.log(state);

    let queryPart = `?page=${state.albums.page}&asc=`;
    queryPart += state.albums.sort.order === "asc" ? 1 : 0;
    queryPart += `&uid=${state.user.uid}&likes=${state.albums.sort.liked?1:0}`;
    queryPart += state.albums.totalResults === undefined ? '' : `&limit=${state.albums.totalResults}`;
    queryPart += state.albums.filter !== "" ? '' : `&search=${state.albums.filter}`;
    queryPart += state.albums.sort.category !== "" ? '': `&sort=${state.albums.sort.category}`;
    queryPart += '&t='+Date.now();

    return fetch( getAlbumURL + queryPart ).then(res => res.json());
});

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers:{

    },
    extraReducers: builder => {
        builder
        .addCase(fetchAlbumPage.pending, () => {
            console.log("googoo")
        } )
        .addCase(fetchAlbumPage.fulfilled, ( state , action :PayloadAction<album[]> ) => {
            state.albumList = action.payload;
        })
        .addCase(fetchAlbumPage.rejected, () => {

        })
    }
});


export const selectAllAlbums = (state :RootState) => state.albums.albumList;

export default albumsSlice.reducer;
