import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

import { loginResponse } from "../../../typedefs";

import { login_check } from "../../../API_ENDPOINT";
import { user_info_update } from "../../../API_ENDPOINT";



type userState = {
    isLoggedIn :boolean,
    isGuest: boolean,
    email :string,
    display_name: string,
    uid :string,
    status :number,
    newsletter: boolean
}

const initialState :userState = {
    isLoggedIn: false,
    isGuest: true,
    email: "",
    display_name: "Guest",
    uid: "",
    newsletter: false,
    status: 0
}

type checkLoginPayload = {
    email :string,
    pwd: string
}

interface UserInfoUpdateRes {
    status :number,
    display_name: string,
    newsletter: boolean
}

type UserInfoUpdate = {
    display_name: string,
    newsletter: boolean
}

/*
    This async Thunk sends the inputted password and email and sends back whether the user exists and if the passwords match in th DB
    If the match if made, we get back extra info like the user's UID and whether they sub to the newsletter
    We can then consider the user Logged In.

    If there is no match, the status :number in the response gives us information on whether the email or pwd is incorrect
    there is probably a better way and more standard way of doing this. Maybe an error property otherwise empty ?
    🧐 Much to think about
*/

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

});

/*
    This async Thunk sends a payload containing a display_name :string and a newsletter :boolean alongside the user's email and UID to the API
    These will overwrite update the current display_name and newsletter bool for the user in the database.

    The API sends back the updated display_name and newsletter bool is the request is sucessful
*/

export const updateUserInfo = createAsyncThunk("user/updateUserInfo", async (update :UserInfoUpdate, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    const payload = {
        user: state.user.email,
        uid: state.user.uid,
        display_name: update.display_name,
        newsletter: update.newsletter
    }
    
    return await fetch(user_info_update, {
            method: 'POST',
            mode:'cors',
            cache: "no-cache",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
    }).then( (res)=>res.json() );

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
                    state.newsletter = action.payload.newsletter;
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
                state.newsletter = false;
            })
            .addCase(checkLogin.rejected, (state) => {
                state.display_name = "Guest";
                state.uid = "";
                state.email = "";
                state.isGuest = false;
                state.isLoggedIn = false;
                state.newsletter = false;
                state.status = 503;
            })
            .addCase(updateUserInfo.fulfilled, (state, action :PayloadAction<UserInfoUpdateRes>) =>{
            // We only update the display_name and newsletter properties if the ones sent back by the API are different than the ones currently stored
                if(action.payload.status === 200){
                    if(state.display_name != action.payload.display_name){
                        state.display_name = action.payload.display_name;
                    }
                    if(state.newsletter != action.payload.newsletter){
                        state.newsletter = action.payload.newsletter;
                    }
                }
            })
        }
    }
);

export default userSlice.reducer;

export const selectUserInfo = (state :RootState) => state.user;

export const selectStatus = (state :RootState) => state.user.status;

export const selectGuestStatus = (state :RootState) => state.user.isGuest;

export const { logAsGuest } = userSlice.actions;