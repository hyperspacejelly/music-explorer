import { useState, useEffect } from 'react';

import { getAlbumPage } from '../func/getAlbumPage';

import { album } from '../typedefs';

import './css/navbar.css';
import { getPageCount } from '../func/getPageCount';

type NavBarProps = {
    uid :string,
    pageNumber: number,
    selectPage: (num: number) => void,
    setNewAlbumList: (list: album[] | undefined) => void
}

type SortParams = {
    sortColumn: string | undefined,
    isAsc: boolean
}

function resetScroll() {
    document.getElementsByTagName("main")[0].scrollTop = 0;
}

function NavBar({uid, pageNumber, selectPage, setNewAlbumList }: NavBarProps) {
    const [totalPageCount, setTotalPageCount] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const [filterLikes, setFilterLikes] = useState(false)
    const [savedSearchInput, setSaveSearchInput] = useState("");
    const [sortInput, setSortInput] = useState<string>("");
    const [currSort, setCurrSort] = useState<SortParams>({sortColumn:undefined, isAsc:true});
    const [pageNumInput, setPageNumInput] = useState<string>();
    const [toggleMobile, setToggleMobile] = useState(false);

    useEffect(() => {
        getAlbumPage(pageNumber, currSort.isAsc, uid, filterLikes, savedSearchInput, currSort.sortColumn)
            .then((value) => setNewAlbumList(value));
        resetScroll();

        if(toggleMobile){setToggleMobile(false);}

    }, [pageNumber, savedSearchInput, currSort, filterLikes]);

    useEffect(()=>{
        getPageCount(savedSearchInput).then((res)=>setTotalPageCount(res));
    }, [savedSearchInput]);

    function handleSearchInput() {
        setSaveSearchInput(searchInput)
        selectPage(1);
    }

    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") { return; }
        handleSearchInput();
    }

    function handleEnterKeyPageNum(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") { return; }
        const newNum = pageNumInput === undefined ? 1 : parseInt(pageNumInput);
        selectPage(newNum);
    }

    function handleSort(sort :string){
        let likes = false;

        let res :SortParams ={ 
             sortColumn : undefined,
             isAsc : true
        }

        if(sort === "likes"){
            likes = true;
            setSaveSearchInput("");
            setSearchInput("");
        }
        else if (sort !== "") {
            const sortArray = sort.split("+");
            res.isAsc = sortArray[1] === "asc" ? true : false;
            res.sortColumn = sortArray[0];
        }

        selectPage(1);
        setPageNumInput("");
        setFilterLikes(likes);
        setCurrSort(res);
    }

    function handleReset() {
        selectPage(1);
        setSortInput("");
        setCurrSort({sortColumn:undefined, isAsc:true});
        setFilterLikes(false);
        setSearchInput("");
        setSaveSearchInput("");
        setPageNumInput("");
    }

    return (<>
        <nav id='navbar' className={toggleMobile?"mobile-open" : ""}>
            <section id="nav-page-section">
                <div className='nav-button nav-prev' onClick={() => {
                    setPageNumInput("");
                    selectPage(pageNumber - 1);
                }}></div>
                <h2 className="nav-header nav-pagenum">Page
                    <input className='nav-numInput' type='number'
                        placeholder={`${pageNumber}`}
                        value={pageNumInput} onChange={(e) => setPageNumInput(e.target.value)}
                        onKeyDown={handleEnterKeyPageNum}></input>
                        &nbsp;/{totalPageCount ?? 0}
                </h2>
                <div className='nav-button nav-next' onClick={() => {
                    setPageNumInput("");
                    selectPage(pageNumber + 1);
                }}></div>

            </section>
            <section id="nav-filter-section">
                <h2 className='nav-header nav-filter'>
                    <span>Filter: </span>
                    <span className='current-filter'>{savedSearchInput}</span></h2>
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
                <h2 className="nav-header">Sort By</h2>
                <select value={sortInput} 
                        onChange={(e) => 
                            {
                                handleSort(e.target.value);
                                setSortInput(e.target.value);
                            }}>
                    <option value="">Latest added</option>
                    <option value="likes">Liked albums 💜</option>
                    <optgroup label='Release year'>
                        <option className='nav-asc' value="year+asc">Ascending</option>
                        <option className='nav-desc' value="year+desc">Descending</option>
                    </optgroup>
                    <optgroup label='Album name'>
                        <option className='nav-asc' value="album+asc">Ascending</option>
                        <option className='nav-desc' value="album+desc">Descending</option>
                    </optgroup>
                    <optgroup label='Artist name'>
                        <option className='nav-asc' value="artist+asc">Ascending</option>
                        <option className='nav-desc' value="artist+desc">Descending</option>
                    </optgroup>
                </select>
            </section>
        </nav>
    </>);
}

export default NavBar;