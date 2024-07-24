import { useEffect, useState } from "react";
import { useTabsDispatch } from './TabsContext.js';
import { getComponents, setColorClass, processQuery, fetchSearchResults, processSearchResultArray, shorten, ConsultLink, determineVisibility } from './utilities';

const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';



export const SearchContainer = ({ query }) => {
    const [processedArray, setProcessedArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const searchresults = await fetchSearchResults(query);
            const processedArr = processSearchResultArray(searchresults, query)

            setProcessedArray(processedArr);
            setLoading(false);
        };

        fetchData();
    }, []);


    if(loading) return  <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    return (
        <>
            <SearchResults processedArray={processedArray} />
        </>
    );
};

export const SearchResults = ({ processedArray }) => {
    if (!Array.isArray(processedArray)) return <>{typeof processedArray}</>

    return (
        <>
            <div className="columns-lg">
                {processedArray.map((obj, index) => (
                    <>
                        {!!obj.Array.length && <div className={/*`bg-[hsla(${30 * index},100%,95%,0.50)]*/`flex flex-col items-start w-full ${obj.Array.length <= 6 && 'break-inside-avoid'}`}>
                            <SearchSubtitle key={index} text={obj.Title} />
                            {obj.Array.map((o, i) => (
                                <>
                                    <SearchResult charaobj={o} key={i} exact={obj.Title.includes('Exact')} />
                                    {obj.Title === "Exact match" && <Variants charaobj={o} />}
                                </>
                            ))}
                        </div>}
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
    const variants = charaobj ? charaobj.variants ? charaobj.variants.split(',') : [] : [];
    return (
        <>
            {!!variants.length && <>
                <SearchSubtitle text="Character variants" />
                <div className="rounded-lg w-full  self-center flex justify-evenly">
                    {variants.map((e, index) => (
                        <ConsultLink key={index} text={e} className="text-4xl font-medium font-serif p-4 rounded-lg flex gap-2 bg-slate-100 hover:bg-slate-200" />
                    ))}
                </div>
            </>}
        </>
    )
}



const SearchResult = ({ charaobj , exact}) => {

    const [isVisible, setIsVisible] = useState(determineVisibility(charaobj));

    useEffect(() => {
        const handleStorage = (event) => {
            setIsVisible(determineVisibility(charaobj));
        }

        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    const dispatch = useTabsDispatch().dispatch;
    if (!charaobj) return
    let components = getComponents(charaobj)

    return (
        <> {(isVisible || exact) &&
            <div className="mx-auto flex bg-slate-50 hover:bg-slate-100 rounded-lg justify-between items-stretch my-1
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
        } </>
    )
}


export default SearchResults