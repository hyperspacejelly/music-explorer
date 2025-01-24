import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

import { loginResponse } from "../../../typedefs";

import { login_check } from "../../../API_ENDPOINT";

type userState = {
    isLoggedIn :boolean,
    isGuest: boolean,
    email :string,
    display_name: string,
    uid :string,
    status :number | undefined
}

const initialState :userState = {
    isLoggedIn: false,
    isGuest: true,
    email: "",
    display_name: "Guest",
    uid: "",
    status: undefined
}

type checkLoginPayload = {
    email :string,
    pwd: string
}

export const checkLogin = createAsyncThunk("user/checkLogin", async ( payload :checkLoginPayload ) => {
    const { pwd, email } = payload;
    
    const loginPayload = {
            user: email,
            pwd: pwd
    }
        
    return await fetch(login_check, {
            method: 'POST',
            mode:'cors',
            cache: "no-cache",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginPayload)
    }).then( res => res.json() );

})

const userSlice = createSlice(
    {
        name: "user",
        initialState,
        reducers:{
            logAsGuest: (state) => {
                    state.display_name = "Guest";
                    state.uid = "";
                    state.email = "";
                    state.isGuest = true;
                    state.isLoggedIn = true;
                }
            }
        ,
        extraReducers: builder => {
            builder.addCase(checkLogin.fulfilled, (state, action:PayloadAction<loginResponse>) => {
                if(action.payload.status === 200){
                    state.display_name = action.payload.display_name;
                    state.uid = action.payload.uid;
                    state.email = action.payload.email;
                    state.isGuest = false;
                    state.isLoggedIn = true;
                    state.status = 200;
                } else {
                    state.status = action.payload.status;
                }
            })
            .addCase(checkLogin.pending, (state)=>{
                state.display_name = "Guest";
                state.uid = "";
                state.email = "";
                state.isGuest = false;
                state.isLoggedIn = false;
            })
            .addCase(checkLogin.rejected, (state) => {
                state.display_name = "Guest";
                state.uid = "";
                state.email = "";
                state.isGuest = false;
                state.isLoggedIn = false;
                state.status = 503;
            })
        }
    }
);

export default userSlice.reducer;

export const selectUserInfo = (state :RootState) => state.user;

export const selectStatus = (state :RootState) => state.user.status;

export const { logAsGuest } = userSlice.actions;