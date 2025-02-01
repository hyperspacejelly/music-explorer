import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { album, discogsInfo } from "../../../typedefs";
import { discogs_fetch } from "../../../API_ENDPOINT";
import { like_album } from "../../../API_ENDPOINT";

/* The highlight part of the store contains information relating to the highlighted album modal that is selected by clicking on it in the grid
    It is split in 3 parts :
        - album : this is all the information of the specific album from the state.album array we selected
                There is probably a smarter way to do this without having to copy the data.
                🧐 Much to think about
        - discogsInfo : is the information queried from discogs about the highlighted album. It contains its tracklist and the url of the discogs page
        - modalOpen : a simple boolean indicating wether the highlight modal is visible or not
 */
        

type highlightState = {
    album :album,
    discogsInfo :discogsInfo,
    modalOpen: boolean
}

export interface ToggleLikeResponse {
    status: number,
    album_id :number
}

const initialState :highlightState ={
    album: {
        id: 0,
        img_src: "",
        album: "",
        artist: "",
        year: 0,
        liked: false,
        tags: "",
        download: "",
        date_added: ""
    },
    discogsInfo: {
        status: 0,
        tracklist: [],
        url: "",
        query: ""
    },
    modalOpen: false
}

/* 
    This async Thunk updates whether an album is liked by the current user
*/
export const toggleAlbumIsLiked = createAsyncThunk("highlight/toggleAlbumIsLiked", async (albumId :number, thunkAPI) => {
        // This async Thunk, when dispatched, will add or remove an album from the like table of the logged in user

        const state = thunkAPI.getState() as RootState;

        const payload = {
            album_id: albumId,
            uid: state.user.uid,
            like: state.highlight.album?.liked ? false : true
        }
        
        return fetch(like_album, {
            method: 'POST',
            mode:'cors',
            cache: "no-cache",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then( (res) => res.json() );
});

export const fetchDiscogsInfo = createAsyncThunk("highlight/FetchDiscogsInfo", async (search:string) => {
    let url = discogs_fetch + `?search=${encodeURIComponent(search)}&t=${Date.now()}`;
    return fetch(url).then( (res)=>res.json() );
});

const highlightSlice = createSlice(
    {
        name: "highlight",
        initialState,
        reducers:{
            setHighlightAlbum: (state, action :PayloadAction<album>) => {
                state.album = action.payload;
            },
            setModalOpen: (state) => {
                state.modalOpen = true;
            },
            setModalClose: (state) => {
                state.modalOpen = false;
            }
        },
        extraReducers: builder =>{
            builder.addCase(fetchDiscogsInfo.fulfilled, (state, action:PayloadAction<discogsInfo>) =>{
                state.discogsInfo = {...state.discogsInfo, ...action.payload};
            })
            .addCase(fetchDiscogsInfo.rejected, (state)=> {
                state.discogsInfo = {
                    status: 500,
                    tracklist: [],
                    url: "",
                    query: ""
                };
            })
            .addCase(fetchDiscogsInfo.pending, (state)=> {
                state.discogsInfo = {
                    status: 0,
                    tracklist: [],
                    url: "",
                    query: ""
                };
            })
            .addCase(toggleAlbumIsLiked.fulfilled, (state, action :PayloadAction<ToggleLikeResponse>) =>{
                 // If the request succeeds it will update the like boolean in the album part of the state 
                if(action.payload.status === 200){
                    state.album.liked = !state.album.liked;
                }
            })
        }
    }
);

export default highlightSlice.reducer;

export const selectModalInfo = (state :RootState) => state.highlight;

export const selectHighlightIsLiked = (state :RootState) => state.highlight.album?.liked;

export const { setHighlightAlbum, setModalClose, setModalOpen } = highlightSlice.actions;