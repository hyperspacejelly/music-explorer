import { useState, useEffect } from 'react';

import './css/navbar.css';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { nextPage, prevPage, changePage, setCategory, setFilter, setOrder, setTotalDisplayedResults, selectAllSearchParams, resetSearchParams } from '../app/features/search/searchSlice';

import type { SortCategories, SortOrder } from '../app/features/search/searchSlice';


function NavBar() {
    // State pulled from the Redux Store
    const searchParams = useAppSelector( selectAllSearchParams );
    const dispatch = useAppDispatch();

    const [searchInput, setSearchInput] = useState("");
    const [pageNumInput, setPageNumInput] = useState<string>();
    const [toggleMobile, setToggleMobile] = useState(false);

    // When switching back and forth between the like and normal set of albums we reset the search bar input
    useEffect(()=>{
        setSearchInput("");
    }, [searchParams.liked])

    function handleSearchInput() {
        dispatch( setFilter(searchInput) );
    }

    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") { return; }
        handleSearchInput();
    }

    function handleEnterKeyPageNum(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") { return; }
        const newNum = pageNumInput === undefined ? searchParams.page : parseInt(pageNumInput);
        dispatch( changePage(newNum) ); 
        setPageNumInput("");
    }

    function handleSortOrder(order :SortOrder){
        if(searchParams.order === order) return;
        dispatch( setOrder(order) );
    }

    function handleReset() {
        dispatch( resetSearchParams() );
        setSearchInput("");
        setPageNumInput("");
    }

    return (<>
        <nav id='navbar' className={toggleMobile?"mobile-open" : ""}>
            <section id="nav-page-section">
                <div className='nav-button nav-prev' onClick={() => {
                    setPageNumInput("");
                    dispatch( prevPage() );
                }}></div>
                <h2 className="nav-header" style={{margin: "0px"}}>Page</h2>
                <div id="nav-pagenum" className="nav-header">
                    <input className='nav-numInput' type='number'
                        placeholder={`${searchParams.page}`}
                        value={pageNumInput} onChange={(e) => {
                            let value = e.target.value;
                            if(value.length > 3) return;
                            setPageNumInput(value);
                        }}
                        onKeyDown={handleEnterKeyPageNum}></input>
                    <label>&nbsp;/{ searchParams.pageCount ?? 0 }</label> 
                </div>
                <div className='nav-button nav-next' onClick={() => {
                    setPageNumInput("");
                    dispatch( nextPage() );
                }}></div>

            </section>
            <section id="nav-filter-section">
                <h2 className='nav-header nav-filter '>
                    <span >Filter: </span>
                    <span className='current-filter'>{searchParams.filter}</span></h2>
            </section>
            <section id="nav-mobile-toggle">
                <div
                    className={"nav-button " + (toggleMobile ? "menu-close" : "menu-open")} 
                    onClick={()=>setToggleMobile(prev=>!prev)}>    
                </div>
            </section>
            <section id='nav-input-section'>
                <input className='nav-textInput'
                    type="text"
                    value={searchInput}
                    onKeyDown={handleEnterKey}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }} />
                <div className='nav-button nav-search'
                    onClick={() => handleSearchInput()}></div>
                <div className='nav-button nav-reset'
                    onClick={handleReset}></div>
            </section>
            <section id='nav-sort-section'>
                {/* <div className="nav-sort-group nav-mobile-like-toggle" >
                    <h2 className="nav-header">
                        My likes
                    </h2>
                    <div className={'nav-button '+(searchParams.liked ? "active" : "")}
                        onClick={()=>{ dispatch(toggleLikedFilter()) }}
                    ></div>
                </div> */}
                <div className="nav-sort-group">
                    <h2 className="nav-header">
                        <span>Sort By&nbsp;</span>
                    </h2>
                    <select value={searchParams.category} 
                            onChange={(e) => 
                                {
                                    // setSortInput(e.target.value as SortCategories);  
                                    dispatch(setCategory(e.target.value as SortCategories)); 
                                }}>
                        <option value="date_added">Date added</option>
                        {/* { !isGuest &&<option value="likes">Liked albums 💜</option>} */}
                        <option className='nav-asc' value="year">Release Year</option>
                        <option className='nav-asc' value="album">Album Name</option>
                        <option className='nav-asc' value="artist">Artist Name</option>

                    </select>
                    <select value={searchParams.order}
                        onChange={(e)=>{
                            handleSortOrder(e.target.value as SortOrder);
                        }}>
                            <option value="desc">Desc.</option>
                            <option value="asc">Asc.</option>
                    </select>
                    {/* <div id="nav-sort-order">
                        <span
                            onClick={()=>handleSortOrder("desc")} 
                            className={'sort-button descending '+ (searchParams.order==="desc"?"selected":"")}></span>
                        <span 
                            onClick={()=>handleSortOrder("asc")} 
                            className={'sort-button ascending ' + (searchParams.order==="asc"?"selected":"")}></span>
                    </div> */}
                </div>
                <div className="nav-sort-group">
                    <select 
                        value={searchParams.totalResults}
                        onChange={(e)=>{
                            dispatch( setTotalDisplayedResults(parseInt(e.target.value)) );
                            // setTotalResultSelect( parseInt(e.target.value) );
                        }}>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </section>
        </nav>
    </>);
}

export default NavBar;