import { useState, useRef } from "react";

import './css/loginform.css';
import './css/accountform.css';
import { createUser } from "../func/createUser";


function CreateAccountForm() {
    const [userEmailInput, setUserEmailInput] = useState("");
    const [userPwdInput, setUserPwdInput] = useState("");
    const [userPwd2Input, setUserPwd2Input] = useState("");
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userPwdRef = useRef<HTMLInputElement>(null);
    const userPwd2Ref = useRef<HTMLInputElement>(null);

    const [adminEmailInput, setAdminEmailInput] = useState("");
    const [adminPwdInput, setAdminPwdInput] = useState("");
    const adminEmailRef = useRef<HTMLInputElement>(null);
    const adminPwdRef = useRef<HTMLInputElement>(null);

    function clearInputs(){
        setUserEmailInput("");
        setUserPwdInput("");
        setUserPwd2Input("");
        setAdminEmailInput("");
        setAdminPwdInput("");
    }

    function setInputClasses(error :boolean){
        if(userEmailRef.current !== null){
            userEmailRef.current.className = error ? "input-error" : "";
        }
        if(userPwdRef.current !== null){
            userPwdRef.current.className = error ? "input-error" : "";
        }
        if(userPwd2Ref.current !== null){
            userPwd2Ref.current.className = error ? "input-error" : "";
        }
        if(adminEmailRef.current !== null){
            adminEmailRef.current.className = error ? "input-error" : "";
        }
        if(adminPwdRef.current !== null){
            adminPwdRef.current.className = error ? "input-error" : "";
        }
    }
    

    function handleSubmit(){
        let fieldsOK = true;
        if(userEmailRef.current !== null){
            fieldsOK = userEmailInput === "" ? false : true;
            userEmailRef.current.className= userEmailInput === "" ? "input-error" : "";
        }
        if(adminEmailRef.current !== null){
            fieldsOK = adminEmailInput === "" ? false : true;
            adminEmailRef.current.className= adminEmailInput === "" ? "input-error" : "";
        }
        if(adminPwdRef.current !== null){
            fieldsOK = adminPwdInput === "" ? false : true;
            adminPwdRef.current.className= adminPwdInput === "" ? "input-error" : "";
        }

        if(userPwdInput !== "" && userPwdInput !== userPwd2Input){
            fieldsOK = false;

            if(userPwdRef.current !== null){
                userPwdRef.current.className = "input-error";
            }
            if(userPwd2Ref.current !== null){
                userPwd2Ref.current.className =  "input-error";
            }

            setUserPwdInput("");
            setUserPwd2Input("");
        }

        if(!fieldsOK) return;    

        createUser(userEmailInput, userPwdInput, adminEmailInput, adminPwdInput)
        .then((res)=>{
            if(res.status === 200){
                clearInputs();
                setInputClasses(false);
            }
            else{
                clearInputs();
                setInputClasses(true);
            }
        });

    }



    return (
        <div className="account-form" id="login-outer-cont">
            <div className="account-form" id="login-cont">
                <h2>Create Account</h2>
                <form id="login-form" className="account-form" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <section>
                            <label htmlFor="user-email">User e-mail</label>
                            <input type="email" id="user-email"
                                placeholder="required"
                                ref={userEmailRef}
                                value={userEmailInput}
                                onChange={(e) => setUserEmailInput(e.target.value)} />
                        </section>
                        <section>
                            <label htmlFor="user-pwd">User password</label>
                            <input type="password" id="user-pwd"
                                placeholder="required"
                                ref={userPwdRef}
                                value={userPwdInput}
                                onChange={(e) => setUserPwdInput(e.target.value)}
                                onKeyDown={(e => {
                                    if (e.key === "Enter") {
                                        //handleSubmit();
                                    }
                                })} />
                        </section>
                        <section>
                            <label htmlFor="user-pwd2">Re-enter password</label>
                            <input type="password" id="user-pwd2"
                                placeholder="required"
                                ref={userPwd2Ref}
                                value={userPwd2Input}
                                onChange={(e) => setUserPwd2Input(e.target.value)}
                                onKeyDown={(e => {
                                    if (e.key === "Enter") {
                                        //handleSubmit();
                                    }
                                })} />
                        </section>
                    </div>
                    <div className="form-separator"></div>
                    <div>
                        <section>
                            <label htmlFor="admin-email">Admin e-mail</label>
                            <input type="email" id="admin-email"
                                placeholder="required"
                                ref={adminEmailRef}
                                value={adminEmailInput}
                                onChange={(e) => setAdminEmailInput(e.target.value)} />
                        </section>
                        <section>
                            <label htmlFor="admin-pwd">Admin password</label>
                            <input type="password" id="admin-pwd"
                                placeholder="required"
                                ref={adminPwdRef}
                                value={adminPwdInput}
                                onChange={(e) => setAdminPwdInput(e.target.value)}
                                onKeyDown={(e => {
                                    if (e.key === "Enter") {
                                        //handleSubmit();
                                    }
                                })} />
                        </section>
                    </div>
                </form>
                <button type="submit" onClick={handleSubmit}>Create Account</button>
            </div>
        </div>);
}

export default CreateAccountForm;