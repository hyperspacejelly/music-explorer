import { useState, useEffect } from 'react';

//Import Components
import AlbumTable from "./components/Table";
import HighlightModal from './components/HighlightModal';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import UserSection from './components/UserSection';

//Import Types
import { album, loginStatus } from './typedefs';

function App() {
  const [loginStatus, setLoginStatus] = useState<loginStatus>({
    isLoggedIn: false,
    email : "",
    display_name: "",
    uid : ""
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [currentAlbumList, setCurrentAlbumList] = useState<album[]>();
  const [currSelectedAlbum, setCurrSelectedAlbum] = useState<album>();
  const [highlightOpen, setHighlightOpen] = useState(false);

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

  function setFullDisplayedAlbum(albumInfo : album){ 
      setCurrSelectedAlbum(albumInfo);
      setHighlightOpen(true);
  }

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

  function updateLoginStatus(status :loginStatus){
    setLoginStatus(status);
  }

  function setNewAlbumList(list :album[] | undefined){
    setCurrentAlbumList(list);
  }

  return (
    <>
      {!loginStatus.isLoggedIn && <LoginForm setLoginStatus={updateLoginStatus} />}
      {loginStatus.isLoggedIn &&<>
        <UserSection loginStatus={loginStatus} />

        <NavBar uid={loginStatus.uid} pageNumber={pageNumber} selectPage={setPageNumberWrapper} 
                 setNewAlbumList={setNewAlbumList}/>
      
        {currSelectedAlbum && 
          <HighlightModal uid={loginStatus.uid} albumInfo={currSelectedAlbum} 
                  open={highlightOpen} toggleModalOff={()=>{setHighlightOpen(false)}}/>}

        {currentAlbumList && 
          <AlbumTable albumList={currentAlbumList} 
                  setSelectedAlbum={setFullDisplayedAlbum}/>}
      </>}
    </>
  );
}

export default App
