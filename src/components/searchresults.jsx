import { useEffect, useState, useContext } from "react";
import { useTabs, useTabsDispatch } from './TabsContext.js';
import { getComponents, setColorClass, processQuery, processSearchResultArray, shorten } from './utilities';

const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';

function SearchResults(searchresults) {
    let query = searchresults.searchresults

    const [searchresultsarray, setSearchResultArray] = useState([{ Title: '', Array: [] }]);

    useEffect(() => {
        fetch(`${apiurl}${processQuery(query)}`)
            .then(response => response.json())
            .then(data => {
                setSearchResultArray(processSearchResultArray(data, query));
            })
            .catch(error => { console.log(error) })
    }, [])

    return (
        <>
            <div className="flex flex-col gap-3 items-start">
                {searchresultsarray.map((obj, index) => (
                    <>
                        {!obj.Array.length ? <></> : <>
                            <SearchSubtitle text={obj.Title} />
                            {obj.Array.map((o, index) => (
                                <>
                                    <SearchResult charaobj={o} key={index} />
                                    {obj.Title != "Exatch match" ? <></> : <Variants charaobj={o} />}
                                </>
                            ))}
                        </>}
                    </>
                ))}
            </div>
        </>
    )
}


const SearchSubtitle = ({ text }) => <>
    <div className="text-sm self-center text-neutral-500 ">
        {text}
    </div>
</>

const Variants = ({ charaobj }) => {
    const variants = charaobj ? charaobj.variants ? charaobj.variants.split(',') : [] : ['undefined'];
    const dispatch = useTabsDispatch().dispatch;
    console.log(variants)
    return (
        <>
            {variants.length > 0 ? <>
                <SearchSubtitle text="Character variants" />
                <div className="rounded-lg w-full  self-center flex justify-evenly">
                    {variants.map((e, index) => (
                        <button className="text-4xl font-medium font-serif p-4 rounded-lg flex gap-2 bg-slate-100 hover:bg-slate-200"
                            onClick={() => {
                                dispatch({
                                    type: 'consult',
                                    title: e,
                                    text: e,
                                });
                            }} key={index}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </> : <></>}
        </>
    )
}



const SearchResult = ({ charaobj }) => {

    const dispatch = useTabsDispatch().dispatch;
    if (!charaobj) { return }
    let components = getComponents(charaobj)

    return (
        <div className="mx-auto flex bg-slate-50 hover:bg-slate-100 rounded-lg justify-between items-stretch
        p-2 sm:gap-3 max-sm:p-0 w-full max-w-[32rem]">
            <button className="rounded-lg flex hover:bg-slate-200 p-2 gap-2.5 items-center min-w-0 grow"
                onClick={() => {
                    dispatch({
                        type: 'consult',
                        title: charaobj.kanji,
                        text: charaobj.kanji,
                    });
                }}>
                <div className="font-medium font-serif table-cell align-middle text-4xl sm:text-[2.5rem]">{charaobj.kanji}</div>
                <div className="flex flex-col text-sm grow min-w-0 text-left">
                    <div className="w-full min-w-0 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.kun, true)} {shorten(charaobj.on)} {charaobj.pinyin}</div>
                    <div className="w-full min-w-0 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.meaning)}</div>
                </div>
            </button>

            <span className="flex gap-2 justify-center basis-28">
                {components.map((obj, index) => (
                    <button
                        onClick={() => {
                            dispatch({
                                type: 'search',
                                title: obj.compchar,
                                text: obj.compchar,
                            });
                        }}
                        className={`rounded-lg hover:bg-slate-200 flex flex-col ${setColorClass(obj.comprole)} justify-center size-[4rem] max-sm:w-[3rem]`} key={index}>
                        <div className="scale-x-[.85] self-center text-sm select-none">{obj.comprole} </div>
                        <div className="max-sm:text-2xl self-center text-3xl font-medium font-serif">{obj.compchar}</div>
                    </button>
                ))}
            </span>
        </div>
    )
}


export default SearchResults