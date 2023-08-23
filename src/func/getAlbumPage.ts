import { album } from "../typedefs";
import { get_albums } from "../API_ENDPOINT";

export async function getAlbumPage(page:number, asc: boolean, uid :string, likes :boolean, search?:string, sort?:string,  limit?: number) :Promise<album[] | undefined> {

    let url = get_albums + `?page=${page}&asc=`;
    url += asc ? 1 : 0;
    url += `&uid=${uid}&likes=${likes?1:0}`;
    url += limit === undefined ? '' : `&limit=${limit}`;
    url += search === undefined ? '' : `&search=${search}`;
    url += sort === undefined ? '': `&sort=${sort}`;
    url += '&t='+Date.now();
  
    const response = await fetch(url);
  
    const albums = await response.json();

    if(albums.status === 204){
        return undefined;
    }
  
    return albums;
}

