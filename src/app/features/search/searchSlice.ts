import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { get_page_count } from "../../../API_ENDPOINT";

/* The slice contains most (all except the userID) of the information related to the fetching of album data.
    That way it can be easily updated from multiple parts of the app 
    Any changes to it can then be used to trigger a request to the API 
*/

// Both of these string literal directly match the values found in dropdown selectors
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

export const getPageCount = createAsyncThunk("search/getPageCount", async(_, thunkAPI)=>{
        // Arg is undefined and unused because I needed access to that 2nd argument (the thunkAPI) to get access to the entire state
        const state = thunkAPI.getState() as RootState;

        /* The request to get the page count is a simple get request with some parameters.
             I think The API could be reworked so that it sends a page count with every get_album response as opposed to a separate query
            🧐 Much to think about 
        */

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
            // Prevents from going over the max amount of pages
            if(state.pageCount !== undefined){
                state.page = state.page < state.pageCount ? (state.page + 1) : state.page;
            }
        },
        prevPage: (state) => {
            // prevents from going lower than page 1
            state.page = state.page === 1 ? state.page : (state.page - 1);
        },
        changePage: (state, action: PayloadAction<number>) =>{
            // Same here, when directly inputing a page number to nav to, we prevent going over the last an first pages
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
            // Made the decision to not reset the result amount between normal and liked results
            // But otherwise when switching between the 2 sets of data all other sort and nav params are reset
            state.page = 1;
            state.category = initialState.category;
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
            // Made the decision to not reset the result amount
            state.page = initialState.page;
            state.category = initialState.category;
            state.filter = initialState.filter;
            state.liked = initialState.liked;
            state.order= initialState.order;
        }
    },
    extraReducers: builder => {
        builder.addCase(getPageCount.fulfilled, (state, action :PayloadAction<pageCountResponse>)=>{
            // If the page count query gives us anything other than 200, there are no results.
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