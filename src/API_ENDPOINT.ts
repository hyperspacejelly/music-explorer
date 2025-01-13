// the real one is private. C'mon.

const baseURL = "http://127.0.0.1/musex-api";

export const get_albums = baseURL+"/data/get_albums.php";
export const get_page_count = baseURL+"/data/get_page_count.php";
export const like_album = baseURL+"/data/like_album.php";
export const discogs_fetch = baseURL+"/data/get_discogs_info.php";
export const login_check = baseURL+"/user/login.php";
export const user_info = baseURL+"/user/get_user_info.php";
export const user_info_update = baseURL+"/user/update_user_info.php";
export const create_user = baseURL+"/user/create_user.php";