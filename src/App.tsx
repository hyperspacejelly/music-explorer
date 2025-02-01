import { useEffect } from 'react';

//Import Components
import AlbumTable from "./components/Table";
import HighlightModal from './components/HighlightModal';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import UserSection from './components/UserSection';

import { useAppSelector, useAppDispatch} from './app/hooks';
import { selectUserInfo } from './app/features/user/userSlice';

import { getPageCount, selectAllSearchParams, nextPage, prevPage } from './app/features/search/searchSlice';

//Import Types
import { fetchAlbumPage } from './app/features/albums/albumsSlice';

function App() {

  // State pulled from Redux Store
  const loginStatus = useAppSelector( selectUserInfo );
  const highlightOpen = useAppSelector((state) => state.highlight.modalOpen);
  const searchParams = useAppSelector( selectAllSearchParams );

  const dispatch = useAppDispatch();

  useEffect(()=>{
    // Global Keyboard Navigation
    // Loads next or previous page with arrow keys
    // Prevents keyboard navigation if a text input is focused
    document.addEventListener("keydown", (e)=>{
      e.stopImmediatePropagation();
      let activeInput = document.activeElement?.tagName ?? "";
      if( activeInput.toLowerCase() !== "input"){
        switch(e.key){
          case "ArrowRight" :
              dispatch( nextPage() );
            break;
          case "ArrowLeft" :
              dispatch( prevPage() );
            break;
        }
      }
    })
  }, []);

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
    if(loginStatus.isLoggedIn){
      dispatch( getPageCount() );
    }
  },[searchParams.filter, searchParams.category, searchParams.liked, searchParams.totalResults, loginStatus.isLoggedIn]);

  // get album list when change in search params 
  useEffect(()=>{
    if(loginStatus.isLoggedIn){
      dispatch( fetchAlbumPage() );
    }
  }, [searchParams,  loginStatus.isLoggedIn]);

  return (
    <>
      {!loginStatus.isLoggedIn && <LoginForm />}
      {loginStatus.isLoggedIn &&<>
        <UserSection/>
        <NavBar/>
        <HighlightModal/>
        <AlbumTable />
      </>}
    </>
  );
}

export default App
