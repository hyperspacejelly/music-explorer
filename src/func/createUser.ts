import { create_user } from "../API_ENDPOINT";

export interface createUserRes {
    status :number
}

export async function createUser(userEmail :string, userPwd :string, adminEmail :string, adminPwd :string) :Promise<createUserRes>{
    
    const payload = {
        user_email: userEmail,
        user_pwd: userPwd,
        admin_email: adminEmail,
        admin_pwd: adminPwd
    }
    
    const createUserRes = await fetch(create_user, {
        method: 'POST',
        mode:'cors',
        cache: "no-cache",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await createUserRes.json();

    return data;
}