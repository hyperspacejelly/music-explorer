import {useEffect, useRef} from 'react';
import { decodeHTML } from '../func/decodeHTML';

import './css/highlightModal.css';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchDiscogsInfo, selectHighlightIsLiked, selectModalInfo, setModalClose, toggleAlbumIsLiked } from "../app/features/highlight/highlightSlice";
import { selectGuestStatus } from "../app/features/user/userSlice";


function HighlightModal(){
    const dispatch = useAppDispatch();
    const tracklistRef = useRef<HTMLOListElement>(null);
    const isLiked = useAppSelector(selectHighlightIsLiked);

    const isGuest = useAppSelector(selectGuestStatus);

    const { album, modalOpen, discogsInfo } = useAppSelector(selectModalInfo);

    // This function generates and returns a Youtube Search URL with the album's name, artist, and realease year 
    const ytQuery = () => {
        const albumNameSplit = album.album.replaceAll(/(&\S+;+)/g, " ").split(' ');
        const artistNameSplit = album.artist.replaceAll(/(&\S+;+)/g, " ").split(' ');

        let query="";

        albumNameSplit.forEach((elem, key) => {
            query += key > 0 ? `+${elem}` : elem;
        });

        artistNameSplit.forEach((elem)=>{
            query += `+${elem}`;
        });

        query+=`+${album.year}`;

        return query;
    };
    
    // If the highlight part of the store has an album stored and an user is Logged in, we dispatch the thunk getting the tracklist info
    useEffect(()=>{
        if(album.album != "" && !isGuest){
            const discogSearch = decodeHTML(album.album)+" "+decodeHTML(album.artist);
            dispatch( fetchDiscogsInfo(discogSearch) );  
        }
    }, [album.id]);

    // Returns the JSX for displaying the tracklist
    function renderTracklist(){
        if(discogsInfo.status === 0){return <p>Fetching tracklist...</p>}

        if(discogsInfo.tracklist.length === 0){return<p>Couldn't fetch tracklist</p>}

        const tracklist = discogsInfo.tracklist.map((track, index)=>{
            return <li key={album.album+"_"+index}>{decodeHTML(track)}</li>;
        });

        return tracklist;
    }

    return(<>
        <div id="highlight-cont" className={modalOpen ? "visible" : "hidden"} 
            onClick={()=>dispatch( setModalClose() )}>
                {album && <>
                <div id="highlight-modal" onClick={(e)=>{e.stopPropagation()}}>
                    <figure className="hl-image">
                        <img src={album.img_src} alt={album.album+" by "+album.artist}/>
                    </figure>
                    <div className="hl-text-section">
                        <div className="hl-album">
                            <h2>{decodeHTML(album.album.replace("\\",""))+" "} 
                                <span>({album.year})</span>
                            </h2> 
                            {(!isGuest) &&
                            <div className={"hl-btn "+(isLiked?"hl-liked":"hl-like-default")} onClick={ ()=>dispatch(toggleAlbumIsLiked(album.id)) }></div>}
                        </div>
                        <h3 className="hl-artist">{decodeHTML(album.artist.replace("\\",""))}</h3>
                        <section className="hl-link-cont">
                            <a className="hl-link hl-youtube" 
                                href={"https://www.youtube.com/results?search_query="+ytQuery()} 
                                target="_blank">Find on YouTube</a>
                            <div className="hl-separator"></div>
                            { !isGuest &&
                                <a className="hl-link hl-download" href={album.download} target="_blank">Download</a>
                            }
                            { isGuest &&
                                <p className="hl-link hl-download disabled">Download</p>
                            }
                        </section>
                        <h3 className="hl-tracklist-title">
                                Tracklist &nbsp; 
                                {(discogsInfo && !isGuest) && <span>
                                    (
                                <a href={discogsInfo.url == "" ? `https://www.discogs.com/search?q=${album.artist}&type=artist` : discogsInfo.url } 
                                    target="_blank">
                                        Discogs {discogsInfo.url !== "" ? "page" : "artist search results"}
                                    </a>
                                    )</span>
                                }  
                        </h3>
                        <section className="hl-discogs-info">
                            <ol ref={tracklistRef}>
                                {(discogsInfo && !isGuest) &&
                                    renderTracklist()
                                }
                                {(!discogsInfo && !isGuest) &&
                                    <p>
                                        Fetching Tracklist...
                                    </p>
                                }
                                {(isGuest) &&
                                    <p>
                                        Tracklist unavailable in guest mode.
                                    </p>
                                }
                            </ol>
                        </section>
                        <p className="hl-tags">{decodeHTML(album.tags)}</p>
                    </div>
                </div>
            </>}
        </div>
    </>);
}

export default HighlightModal;