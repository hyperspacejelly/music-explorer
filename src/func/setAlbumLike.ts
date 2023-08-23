import { like_album } from "../API_ENDPOINT";

type AlbumLikeRes = {
    status :number;
}

export async function setAlbumLike(albumID :number, uid :string, action :"like"|"unlike") :Promise<AlbumLikeRes>{
    
    const payload = {
        album_id: albumID,
        uid: uid,
        like: action === "like" ? true : false
    }
    
    const setAlbumLikeRes = await fetch(like_album, {
        method: 'POST',
        mode:'cors',
        cache: "no-cache",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await setAlbumLikeRes.json();

    return data;
}