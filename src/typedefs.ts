export interface discogsInfo{
    status: number,
    url :string,
    tracklist :string[],
    query: string
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
    uid :string;
    newsletter :boolean
}

export type loginStatus = {
    isLoggedIn :boolean,
    isGuest: boolean,
    email :string,
    display_name: string,
    uid :string
}
