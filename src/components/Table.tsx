import { album } from '../typedefs';

import { decodeHTML } from '../func/decodeHTML';

import './css/table.css';

type AlbumTableProps ={
    albumList: album[],
    isGuest: boolean,
    setSelectedAlbum: (albumInfo : album)=>void
}

function AlbumTable({albumList, setSelectedAlbum} :AlbumTableProps){

    const albumRender = albumList.map((album)=>{
        return(
            <div key={"album_"+album.id} className="album-display"
                onClick={()=>setSelectedAlbum(album)}>
                <span>{album.tags}</span>
                <img src={album.img_src} alt={album.album} 
                    className={album.liked ? "album-like" : ""} />
                <figcaption>
                    <h2>{decodeHTML(album.album.replace("\\",""))}</h2>
                    <h3>{decodeHTML(album.artist.replace("\\",""))}</h3>
                </figcaption>
            </div>);
    });

    return(<section id="album-cont">
        {albumRender}
    </section>);
}

export default AlbumTable;