import { discogs_fetch } from "../API_ENDPOINT";
import { discogsInfo } from "../typedefs";


export async function getTracklist(search: string) :Promise<discogsInfo>{

    let url = discogs_fetch + `?search=${search}&t=${Date.now()}`;
    const response = await fetch(url);

    const tracklist = await response.json();

    return tracklist;
}
