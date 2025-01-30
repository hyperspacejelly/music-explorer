import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store";
import type { album } from "../../../typedefs";

import type { SearchParams } from "../search/searchSlice";

import { get_albums as getAlbumURL } from "../../../API_ENDPOINT";

interface fetchAlbumResponse {
    status :number,
    albums : album[]
}

type initState = {
    albums :album[]
}

const initialState :initState = {
    albums: []
};

export const fetchAlbumPage = createAsyncThunk("albumList/fetchAlbumPage", async (arg=undefined, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    let queryPart = `?page=${state.search.page}&asc=`;
    queryPart += state.search.order === "asc" ? 1 : 0;
    queryPart += `&uid=${state.user.uid}&likes=${state.search.liked?1:0}`;
    queryPart += state.search.totalResults === undefined ? '' : `&limit=${state.search.totalResults}`;
    queryPart += state.search.filter == "" ? '' : `&search=${state.search.filter}`;
    queryPart += `&sort=${state.search.category}`;
    queryPart += '&t='+Date.now();

    return fetch( getAlbumURL + queryPart).then(res => res.json());
});

const albumsSlice = createSlice({
    name: "albumList",
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder
        .addCase(fetchAlbumPage.fulfilled, ( state , action :PayloadAction<fetchAlbumResponse> ) => {
            if(action.payload.status===200){
                state.albums = action.payload.albums;
            } else {
                state.albums = [];
            }
            
        })
    }
});


export const selectAllAlbums = (state :RootState) => state.albumList.albums;

export default albumsSlice.reducer;
