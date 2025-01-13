import { get_page_count } from "../API_ENDPOINT";

export async function getPageCount(search?: string, uid?: string, limit?: number) {
    let url = get_page_count + `?`;
    url += limit === undefined ? '' : `limit=${limit}&`;
    url += search === undefined ? '' : `search=${search}&`;
    url += uid === undefined ? '' : `uid=${uid}&`;
    url += 't=' + Date.now();

    const response = await fetch(url);

    const pageCount = await response.json();

    if (pageCount.status != 200) {
        return undefined;
    }

    return pageCount["page_count"];
}