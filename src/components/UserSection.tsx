import { useState, useEffect } from "react";
import { loginStatus, UserInfo } from "../typedefs";

import { user_info, user_info_update } from "../API_ENDPOINT";

import './css/usersection.css';

type UserSectionProps = {
    loginStatus :loginStatus
}

async function getUserInfo(user :string, uid :string) :Promise<UserInfo>{
    const payload = {
        user: user,
        uid: uid
    }
    
    const loginRes = await fetch(user_info, {
        method: 'POST',
        mode:'cors',
        cache: "no-cache",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await loginRes.json();

    return data;
}

async function updateUserInfo(user :string, uid :string, newDisplayName :string, newsletterStatus :boolean) {
    const payload = {
        user: user,
        uid: uid,
        display_name: newDisplayName,
        newsletter: newsletterStatus
    }

    const loginRes = await fetch(user_info_update, {
        method: 'POST',
        mode:'cors',
        cache: "no-cache",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const res = await loginRes.json();

    return res;
}

function UserSection({loginStatus} :UserSectionProps){
    const [newsletterStatus, setNewsletterStatus] = useState<boolean>();
    const [displayName, setDisplayName]=useState(loginStatus.isGuest ? "Guest" : loginStatus.display_name);
    const [editMode, setEditMode] = useState(false);
    const [displayNameEdit, setDisplayNameEdit] = useState("");
    
    useEffect(()=>{
        if(!loginStatus.isGuest){
            getUserInfo(loginStatus.email, loginStatus.uid)
            .then((response)=>{
                setNewsletterStatus(response.newsletter);
                if(response.display_name!=displayName){
                    setDisplayName(response.display_name);
                }
            });
        }
    },[]);

    function handleUpdateUserInfo(newsletter :boolean, newDisplayName? :string){
        updateUserInfo(loginStatus.email, loginStatus.uid, newDisplayName??displayName ,newsletter)
        .then((res)=>{
            if(res.status === 200){
                getUserInfo(loginStatus.email, loginStatus.uid)
                .then((response)=>{
                    setNewsletterStatus(response.newsletter);
                    if(response.display_name!=displayName){
                        setDisplayName(response.display_name);
                    }
                });
            }
        })
    }

    function cancelEditMode(){
        setEditMode(false);
        setDisplayNameEdit("");
    }

    return (<div id="user-section" style={{display:"flex"}}>
        <div>
            <h3 className="mobile-hidden">Hello,&nbsp;</h3>
            <h3 className="mobile-displayed">Hi,&nbsp;</h3>
            { (!editMode) && <>
                <h3>{displayName}</h3>
                { !loginStatus.isGuest && <div className="user-name-button user-name-edit" onClick={()=>setEditMode(true)}></div>}
                </>}
            {(editMode && !loginStatus.isGuest) && <>
                <input id="display-name-input" 
                    type="text" placeholder={displayName} 
                    value={displayNameEdit} 
                    onChange={(e)=>setDisplayNameEdit(e.target.value)}
                    onKeyDown={(e)=>{
                        if(typeof newsletterStatus === 'boolean' && e.key === "Enter"){
                            handleUpdateUserInfo(newsletterStatus, displayNameEdit);
                            cancelEditMode();
                        }
                    }}/>
                <div className="user-name-button user-name-ok" 
                    onClick={()=>{
                            if(typeof newsletterStatus === 'boolean'){
                                handleUpdateUserInfo(newsletterStatus, displayNameEdit);
                                cancelEditMode();
                            }
                        }}></div>
                <div className="user-name-button user-name-cancel" onClick={()=>cancelEditMode()}></div>
                </>}
        </div>
        <div id="newsletter-select">
            <h3>
                {!loginStatus.isGuest && <>
                <span className="mobile-hidden">Receive&nbsp;</span>newsletter?&nbsp; 
                <span className={"user-opt-select "+ (newsletterStatus? "user-opt-selected":"none")}
                    onClick={()=>{
                        if(newsletterStatus)return;
                        handleUpdateUserInfo(true);
                    }}>
                        Yes</span>
                &nbsp;/&nbsp;
                <span className={"user-opt-select "+ (newsletterStatus? "none":"user-opt-selected")}
                     onClick={()=>{
                        if(!newsletterStatus)return;
                        handleUpdateUserInfo(false);
                    }}>
                        No</span>
                </>}
                {loginStatus.isGuest && <>Newsletter unavailable in guest mode</>}
            </h3>
        </div>
    </div>);
}

export default UserSection;