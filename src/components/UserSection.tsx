import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { selectUserInfo, updateUserInfo } from "../app/features/user/userSlice";

import { toggleLikedFilter } from "../app/features/search/searchSlice";

import './css/usersection.css';

function UserSection(){
    const [editMode, setEditMode] = useState(false);
    const [displayNameEdit, setDisplayNameEdit] = useState("");

    const likeFilter = useAppSelector((state)=>state.search.liked);
    const userInfo = useAppSelector( selectUserInfo );
    const dispatch = useAppDispatch();

    function cancelEditMode(){
        setEditMode(false);
        setDisplayNameEdit("");
    }

    return (<div id="user-section" style={{display:"flex"}}>
         {!userInfo.isGuest && <>
                <h3 id="likes-tab" className={"mobile-displayed user-section-tab user-like-toggle "+(likeFilter?"active":"")} 
                    onClick={()=>{
                        dispatch( toggleLikedFilter() );   
                    }}>
                    My Likes <span>💜</span>
                </h3>
            </>}
        <div className="mobile-user-section user-section-group">
            <div id="user-section-display-name" className="user-section-group">
                <h3 className="mobile-hidden">Hello,&nbsp;</h3>
                <h3 className="mobile-displayed">Hi,&nbsp;</h3>
                { (!editMode) && <>
                    <h3>{userInfo.display_name}</h3>
                    { !userInfo.isGuest && <div className="user-name-button user-name-edit" onClick={()=>setEditMode(true)}></div>}
                    </>}
                {(editMode && !userInfo.isGuest) && <>
                    <input id="display-name-input" 
                        type="text" placeholder={userInfo.display_name} 
                        value={displayNameEdit} 
                        onChange={(e)=>setDisplayNameEdit(e.target.value)}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter"){
                                dispatch( updateUserInfo({ display_name: displayNameEdit, newsletter: userInfo.newsletter }) );
                                cancelEditMode();
                            }
                        }}/>
                    <div className="user-name-button user-name-ok" 
                        onClick={()=>{
                                dispatch( updateUserInfo({ display_name: displayNameEdit, newsletter: userInfo.newsletter }) );
                                cancelEditMode();
                            }}></div>
                    <div className="user-name-button user-name-cancel" onClick={()=>cancelEditMode()}></div>
                    </>}
                </div>
                <h3 id="newsletter-select">
                {!userInfo.isGuest && <>
                    <span className="mobile-hidden">Receive&nbsp;</span>newsletter?&nbsp; 
                    <span className={"user-opt-select "+ (userInfo.newsletter? "user-opt-selected":"none")}
                        onClick={()=>{
                            if(userInfo.newsletter)return;
                                dispatch(updateUserInfo({display_name: userInfo.display_name, newsletter:true}));
                        }}>
                            Yes</span>
                    &nbsp;/&nbsp;
                    <span className={"user-opt-select "+ (userInfo.newsletter? "none":"user-opt-selected")}
                        onClick={()=>{
                            if(!userInfo.newsletter)return;
                                dispatch(updateUserInfo({display_name: userInfo.display_name, newsletter:false}));
                        }}>
                            No
                    </span>
                </>}
            </h3>
        </div>

            {!userInfo.isGuest && <>
                <h3 id="likes-tab" className={"mobile-hidden user-section-tab user-like-toggle "+(likeFilter?"active":"")} 
                    onClick={()=>{
                        dispatch( toggleLikedFilter() );   
                    }}>
                    My Likes <span>💜</span>
                </h3>
            </>}

    </div>);
}

export default UserSection;