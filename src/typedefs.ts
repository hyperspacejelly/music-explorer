export interface discogsInfo{
    url :string,
    tracklist :string[]
}

export interface album {
    id :number,
    img_src :string,
    artist :string,
    album :string,
    year :number,
    tags :string,
    download :string,
    date_added :string,
    liked :boolean
}

export interface loginResponse {
    status: number,
    email: string,
    display_name: string,
    uid :string
}

export type FullAlbumInfo = discogsInfo & album;

export type loginStatus = {
    isLoggedIn :boolean,
    email :string,
    display_name: string,
    uid :string
}

export type UserInfo = {
    display_name: string,
    newsletter :boolean
}