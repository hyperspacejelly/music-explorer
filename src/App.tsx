import { useState, useEffect } from 'react';

//Import Components
import AlbumTable from "./components/Table";
import HighlightModal from './components/HighlightModal';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import UserSection from './components/UserSection';

import { useAppSelector, useAppDispatch} from './app/hooks';
import { selectUserInfo } from './app/features/user/userSlice';

import { getPageCount, selectAllSearchParams } from './app/features/search/searchSlice';

//Import Types
import { album } from './typedefs';
import { selectModalInfo } from './app/features/highlight/highlightSlice';
import { fetchAlbumPage } from './app/features/albums/albumsSlice';

function App() {

  // State pulled from Redux Store
  const loginStatus = useAppSelector( selectUserInfo );
  const highlightOpen = useAppSelector((state) => state.highlight.modalOpen);
  const searchParams = useAppSelector( selectAllSearchParams );

  const dispatch = useAppDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const [currentAlbumList, setCurrentAlbumList] = useState<album[]>();
  const currSelectedAlbum = useAppSelector(selectModalInfo);

  // Prevents background scrolling when modal open
  useEffect(()=>{
    if(highlightOpen){
      document.body.style.overflow="hidden";
      // document.getElementsByTagName("main")[0].style.overflowY="auto";
    }
    else{
      document.body.style.overflow="auto";
      // document.getElementsByTagName("main")[0].style.overflowY="auto";
    }
  },[highlightOpen]);

  // Gets page count whenever a parameter affecting it changes
  useEffect(()=>{
    dispatch( getPageCount() );
  },[searchParams.filter, searchParams.category, searchParams.liked, searchParams.totalResults]);

  // init fetch
  useEffect(()=>{
    dispatch( fetchAlbumPage() );
  }, []);

  // get album list when change in search params 
  useEffect(()=>{
    dispatch( fetchAlbumPage() );
  }, [searchParams]);

  function setPageNumberWrapper(num :number){
    
    if(num === 0){
      return;
    }

    if(num < pageNumber){
      setPageNumber(num);
      return;
    }

    if(typeof currentAlbumList === "undefined") return;

    if(num > pageNumber && currentAlbumList.length < 25){
      return;
    }

    setPageNumber(num);
  }

  function setNewAlbumList(list :album[] | undefined){
    setCurrentAlbumList(list);
  }

  return (
    <>
      {!loginStatus.isLoggedIn && <LoginForm />}
      {loginStatus.isLoggedIn &&<>
        <UserSection/>
        <NavBar/>
        {currSelectedAlbum && 
          <HighlightModal/>}
        <AlbumTable />
      </>}
    </>
  );
}

export default App
