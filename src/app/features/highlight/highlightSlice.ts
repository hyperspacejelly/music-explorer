import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { album, discogsInfo } from "../../../typedefs";
import { discogs_fetch } from "../../../API_ENDPOINT";
import { like_album } from "../../../API_ENDPOINT";

type highlightState = {
    album :album,
    discogsInfo :discogsInfo,
    modalOpen: boolean
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

export const toggleAlbumIsLiked = createAsyncThunk("highlight/toggleAlbumIsLiked", async (albumId :number, thunkAPI) => {
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
            .addCase(toggleAlbumIsLiked.fulfilled, (state) =>{
                state.album.liked = !state.album.liked;
            })
        }
    }
);

export default highlightSlice.reducer;

export const selectModalInfo = (state :RootState) => state.highlight;

export const selectHighlightIsLiked = (state :RootState) => state.highlight.album?.liked;

export const { setHighlightAlbum, setModalClose, setModalOpen } = highlightSlice.actions;