import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import type { album } from "../../../typedefs";

import { get_albums as getAlbumURL } from "../../../API_ENDPOINT";
import { toggleAlbumIsLiked, ToggleLikeResponse } from "../highlight/highlightSlice";

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

/*  
    This async Thunk gets an array of albums from the API

    The part of the API that serves a list of albums responds to a simple GET request with a set of parameters
    most of which are stored in the "search" part of the redux store, excluding the userID
    The query URL is then built according to the current values stored in the state 

*/
export const fetchAlbumPage = createAsyncThunk("albumList/fetchAlbumPage", async (_, thunkAPI) => {
    // Arg is undefined and unused because I needed access to that 2nd argument (the thunkAPI) to get access to the entire state

    const state = thunkAPI.getState() as RootState; // Lets us access the entire redux store

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
            // If the query is successful and the response contains any album data we update the state with it
            // Otherwise we empty the album array
            if( action.payload.status === 200 ){
                state.albums = action.payload.albums;
            } else {
                state.albums = [];
            }
            
        })
        .addCase(toggleAlbumIsLiked.fulfilled, (state, action :PayloadAction<ToggleLikeResponse>) => {
            // Updates the like property of the album that was liked in the highlight modal if the request is successful
            if(action.payload.status === 200){
                let album = state.albums.findIndex((album)=>album.id === action.payload.album_id) ;
                if ( album ) {
                    state.albums[album].liked = !state.albums[album].liked;
                }
            }
        })
    }
});

export const selectAllAlbums = (state :RootState) => state.albumList.albums;
export default albumsSlice.reducer;