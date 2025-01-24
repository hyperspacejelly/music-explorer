import { loginStatus } from "../typedefs";
import { useState, useRef, useEffect } from "react";
// import { checkLogin } from "../func/checkLogin";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logAsGuest, checkLogin, selectStatus } from "../app/features/user/userSlice";

import './css/loginform.css';

function LoginForm(){
    const dispatch = useAppDispatch();

    const errorStatus = useAppSelector( selectStatus );

    const [userInput, setUserInput] = useState("");
    const [pwdInput, setPwdInput] = useState("");

    const userRef = useRef<HTMLInputElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(errorStatus !== undefined && errorStatus !== 200){
            setUserInput("");
            setPwdInput("");
        }
    }, [errorStatus]);

    function handleSubmit(){
        if(userRef.current === null || pwdRef.current === null) return;

        userRef.current.className = userInput === "" ? "input-error" : "";
        userRef.current.placeholder = userInput === ""? "Cannot be empty" : "";
        pwdRef.current.className = pwdInput === "" ? "input-error" : "";
        pwdRef.current.placeholder = pwdInput === ""? "Cannot be empty" : "";

        if(userInput === "" || pwdInput ==="") return;

        try{
            dispatch( checkLogin({pwd:pwdInput, email:userInput})).unwrap();
        } catch(error) {
            console.log(error);
        }
    }

    return(
        <div id="login-outer-cont">
            <div id="login-cont">
                <h2>Music Explorer</h2>
                <form id="login-form" onSubmit={(e)=>e.preventDefault()}>
                    <section>
                        <label htmlFor="login-user">E-mail</label>
                        <input type="email" id="login-user" 
                            className = {errorStatus === 404 ? "input-error" : ""}
                            placeholder = {errorStatus === 404 ? "User doesn't exist" : ""}
                            ref={userRef}
                            value={userInput}
                            onChange={(e)=>setUserInput(e.target.value)}/>
                    </section>
                    <section>
                        <label htmlFor="login-pwd">Password</label>
                        <input type="password" id="login-pwd"
                            ref={pwdRef}
                            value={pwdInput}
                            className = {errorStatus === 500 ? "input-error" : ""}
                            placeholder = {errorStatus === 500 ? "Incorrect password" : ""}
                            onChange={(e)=>setPwdInput(e.target.value)}
                            onKeyDown={(e=>{
                                if(e.key === "Enter"){
                                    handleSubmit();
                                }
                            })}/>
                    </section>
                    <section className="login-btns">
                        <button onClick={()=> dispatch( logAsGuest() )}>Browse as guest</button>
                        <button type="submit" onClick={handleSubmit}>Login</button>
                    </section>
                </form>
            </div>
        </div>
    );
}


export default LoginForm;