import { decodeHTML } from '../func/decodeHTML';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setHighlightAlbum, setModalOpen } from '../app/features/highlight/highlightSlice';

import './css/table.css';
import { selectAllAlbums } from '../app/features/albums/albumsSlice';

function AlbumTable(){
    const dispatch = useAppDispatch();
    const albums = useAppSelector( selectAllAlbums );

    const albumRender = albums.map((album)=>{
        return(
            <div key={"album_"+album.id} className="album-display"
                onClick={()=>{
                    dispatch( setHighlightAlbum(album) );
                    dispatch( setModalOpen() );
                }}>
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
        {albums.length >=1 && albumRender}
    </section>);
}

export default AlbumTable;