import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { get_page_count } from "../../../API_ENDPOINT";

export type SortCategories = "year" | "album" | "artist" | "date_added";
export type SortOrder = "asc" | "desc";

export type SearchParams = {
    page: number,
    pageCount :number,
    totalResults: number,
    liked: boolean,
    category :SortCategories,
    order :SortOrder,
    filter :string,
}

interface pageCountResponse {
    status: number,
    page_count: number
}

const initialState :SearchParams = {
    page: 1,
    pageCount: 0,
    totalResults: 25,
    liked: false,
    category: "date_added",
    order: "desc",
    filter: ""
}

export const getPageCount = createAsyncThunk("search/getPageCount", async(arg = undefined, thunkAPI)=>{
        const state = thunkAPI.getState() as RootState;
        let url = get_page_count + `?`;
        url += state.search.totalResults  === undefined ? '' : `limit=${state.search.totalResults}&`;
        url += state.search.filter === "" ? '' : `search=${state.search.filter}&`;
        url += (state.search.liked && state.user.uid !== "") ? `uid=${state.user.uid}&` : '';
        url += 't=' + Date.now();
    
        return await fetch(url).then( (response)=>response.json() );
});

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers:{
        nextPage: (state) => {
            if(state.pageCount !== undefined){
                state.page = state.page < state.pageCount ? (state.page + 1) : state.page;
            }
        },
        prevPage: (state) => {
            state.page = state.page === 1 ? state.page : (state.page - 1);
        },
        changePage: (state, action: PayloadAction<number>) =>{
            if(action.payload > state.pageCount){
                state.page = state.pageCount;
            } else if(action.payload < 1) {
                state.page = 1;
            }
            else{
                state.page = action.payload;
            }
        },
        toggleLikedFilter: (state) => {
            state.page = 1;
            state.category = initialState.category;
            state.totalResults = initialState.totalResults;
            state.order= initialState.order;
            state.filter = initialState.filter;
            
            state.liked = !state.liked;
        },
        setCategory: (state, action :PayloadAction<SortCategories>)=>{
            state.page = 1;
            state.category = action.payload;
        },
        setFilter: (state, action :PayloadAction<string>)=>{
            state.page = 1;
            state.filter = action.payload;
        },
        setOrder: (state, action :PayloadAction<SortOrder>)=> {
            state.page = 1;
            state.order = action.payload;
        },
        setTotalDisplayedResults: (state, action :PayloadAction<number>) => {
            state.totalResults = action.payload;
        },
        resetSearchParams: (state) => {
            state.page = initialState.page;
            state.category = initialState.category;
            state.filter = initialState.filter;
            state.liked = initialState.liked;
            state.totalResults = initialState.totalResults;
            state.order= initialState.order;
        }
    },
    extraReducers: builder => {
        builder.addCase(getPageCount.fulfilled, (state, action :PayloadAction<pageCountResponse>)=>{
            if(action.payload.status === 200){
                state.pageCount = action.payload.page_count;
            } else {
                state.pageCount = 0;
            }
        })
    }
});

export const selectAllSearchParams = (state :RootState) => state.search;

export default searchSlice.reducer;

export const { nextPage, prevPage, changePage, toggleLikedFilter, setCategory, setFilter, setOrder, setTotalDisplayedResults, resetSearchParams } = searchSlice.actions;