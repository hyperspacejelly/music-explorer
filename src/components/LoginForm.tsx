import { loginStatus } from "../typedefs";
import { useState, useRef } from "react";
import { checkLogin } from "../func/checkLogin";

import './css/loginform.css';

type LoginFormProps = {
    setLoginStatus :(login :loginStatus)=>void
}

function LoginForm({setLoginStatus} :LoginFormProps){
    const [userInput, setUserInput] = useState("");
    const [pwdInput, setPwdInput] = useState("");

    const userRef = useRef<HTMLInputElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    function handleSubmit(){
        if(userRef.current === null || pwdRef.current === null) return;

        userRef.current.className = userInput === "" ? "input-error" : "";
        userRef.current.placeholder = userInput === ""? "Cannot be empty" : "";
        pwdRef.current.className = pwdInput === "" ? "input-error" : "";
        pwdRef.current.placeholder = pwdInput === ""? "Cannot be empty" : "";

        if(userInput === "" || pwdInput ==="") return;

        checkLogin(userInput, pwdInput).then((response)=>{
            if(response.status === 200){
                const loginStatus :loginStatus = {
                    isLoggedIn : true,
                    email: response.email,
                    display_name: response.display_name,
                    uid: response.uid
                }
                
                setLoginStatus(loginStatus);
            }
            if(response.status === 404){
                if(userRef.current){
                    setUserInput("");
                    setPwdInput("");
                    userRef.current.className="input-error";
                    userRef.current.placeholder="User doesn't exist";
                }
            }
            if(response.status === 500){
                if(pwdRef.current){
                    setPwdInput("");
                    pwdRef.current.className="input-error";
                    pwdRef.current.placeholder="Incorrect password";
                }
            }
        });

        
    }

    return(
        <div id="login-outer-cont">
            <div id="login-cont">
                <h2>Music Explorer</h2>
                <form id="login-form" onSubmit={(e)=>e.preventDefault()}>
                    <section>
                        <label htmlFor="login-user">E-mail</label>
                        <input type="email" id="login-user" 
                            ref={userRef}
                            value={userInput}
                            onChange={(e)=>setUserInput(e.target.value)}/>
                    </section>
                    <section>
                        <label htmlFor="login-pwd">Password</label>
                        <input type="password" id="login-pwd"
                            ref={pwdRef}
                            value={pwdInput}
                            onChange={(e)=>setPwdInput(e.target.value)}
                            onKeyDown={(e=>{
                                if(e.key === "Enter"){
                                    handleSubmit();
                                }
                            })}/>
                    </section>
                    <button type="submit" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </div>
    );
}


export default LoginForm;