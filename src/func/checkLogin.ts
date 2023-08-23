import { loginResponse } from "../typedefs";
import { login_check } from "../API_ENDPOINT";

export async function checkLogin(user :string, pwd :string) :Promise<loginResponse>{
    const payload = {
        user: user,
        pwd: pwd
    }
    
    const loginRes = await fetch(login_check, {
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