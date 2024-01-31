import { album, discogsInfo } from "../typedefs";
import { getTracklist } from "../func/discogs";
import {useEffect, useState, useRef} from 'react';
import { decodeHTML } from '../func/decodeHTML';
import { setAlbumLike } from "../func/setAlbumLike";

import './css/highlightModal.css';

type HighlightModalProps = {
    uid :string,
    albumInfo :album,
    open :boolean,
    toggleModalOff :()=>void
}

function HighlightModal({uid, albumInfo, open, toggleModalOff} :HighlightModalProps){
    const [discogsInfos, setDiscogsInfo]=useState<discogsInfo>();
    const tracklistRef = useRef<HTMLOListElement>(null);
    const [isLiked, setIsLiked] = useState(albumInfo.liked);

    useEffect(()=>{
        setIsLiked(albumInfo.liked);
    },[albumInfo]);

    const ytQuery = () => {
        const albumNameSplit = albumInfo.album.replaceAll(/(&\S+;+)/g, " ").split(' ');
        const artistNameSplit = albumInfo.artist.replaceAll(/(&\S+;+)/g, " ").split(' ');

        let query="";

        albumNameSplit.forEach((elem, key) => {
            query += key > 0 ? `+${elem}` : elem;
        });

        artistNameSplit.forEach((elem)=>{
            query += `+${elem}`;
        });

        query+=`+${albumInfo.year}`;

        console.log({
            album: albumInfo.album,
            artist: albumInfo.artist,
            query: query
        })

        return query;
    };
    
    useEffect(()=>{
        if(open){
            const discogSearch = decodeHTML(albumInfo.album)+" "+decodeHTML(albumInfo.artist);
            getTracklist(discogSearch)
            .then((info)=>setDiscogsInfo(info));
            if(tracklistRef.current !== null){
                tracklistRef.current.scrollTop = 0;
            }
        }else{
            setDiscogsInfo(undefined);
        }
    },[open]);

    function handleLike(){
        const action = isLiked ? "unlike" : "like";
        setAlbumLike(albumInfo.id, uid, action).then((res)=>{
            if(res.status === 200){
                setIsLiked(prev=>!prev);
            }
        });
    }

    function renderTracklist(){
        if(typeof discogsInfos === "undefined"){ return <></>}

        if(discogsInfos.tracklist.length === 0){return<p>Couldn't fetch tracklist</p>}

        const tracklist = discogsInfos.tracklist.map((track, index)=>{
            return <li key={albumInfo.album+"_"+index}>{decodeHTML(track)}</li>;
        });

        return tracklist;
    }

    return(
    <div id="highlight-cont" className={open ? "visible" : "hidden"} 
        onClick={toggleModalOff}>
        <div id="highlight-modal" onClick={(e)=>{e.stopPropagation()}}>
            <figure className="hl-image">
                <img src={albumInfo.img_src} alt={albumInfo.album+" by "+albumInfo.artist}/>
            </figure>
            <div className="hl-text-section">
                <div className="hl-album">
                    <h2>{decodeHTML(albumInfo.album.replace("\\",""))+" "} 
                        <span>({albumInfo.year})</span>
                    </h2> 
                    <div className={"hl-btn "+(isLiked?"hl-liked":"hl-like-default")} onClick={handleLike}></div>
                </div>
                <h3 className="hl-artist">{decodeHTML(albumInfo.artist.replace("\\",""))}</h3>
                <section className="hl-link-cont">
                    <a className="hl-link hl-youtube" 
                        href={"https://www.youtube.com/results?search_query="+ytQuery()} 
                        target="_blank">Find on YouTube</a>
                    <div className="hl-separator"></div>
                    <a className="hl-link hl-download" href={albumInfo.download} target="_blank">Download</a>
                </section>
                <h3 className="hl-tracklist-title">
                        Tracklist &nbsp; 
                        {discogsInfos && <span>
                            (
                        <a href={discogsInfos.url === "https://www.discogs.com" ? 
                                `https://www.discogs.com/search?q=${albumInfo.artist}&type=artist` 
                                : discogsInfos.url} 
                            target="_blank">
                                Discogs {discogsInfos.url === "https://www.discogs.com" ? "artist search results" : "page"}
                            </a>
                            )</span>
                        }  
                </h3>
                <section className="hl-discogs-info">
                    <ol ref={tracklistRef}>
                        {discogsInfos && 
                            renderTracklist()
                        }
                        {!discogsInfos &&
                            <p>
                                Fetching Tracklist...
                            </p>
                        }
                     </ol>
                </section>
                <p className="hl-tags">{decodeHTML(albumInfo.tags)}</p>
            </div>
        </div>
    </div>);
}

export default HighlightModal;