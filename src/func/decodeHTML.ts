export function decodeHTML(str :string) :string | null{
    let txt = new DOMParser().parseFromString(str, "text/html");

    return txt.documentElement.textContent;
}
