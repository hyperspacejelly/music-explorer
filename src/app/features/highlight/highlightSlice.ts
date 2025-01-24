import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { album, discogsInfo } from "../../../typedefs";

type highlightState = {
    album :album | undefined,
    discogsInfo :discogsInfo | undefined,
    modalOpen: boolean
}

const initialState :highlightState ={
    album: undefined,
    discogsInfo: undefined,
    modalOpen: false
}

const highlightSlice = createSlice(
    {
        name: "highlight",
        initialState,
        reducers:{}
    }
);

export default highlightSlice.reducer;