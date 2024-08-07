import { useEffect, useState } from "react";
import { getComponents, setColorClass, processSearchResultArray, ConsultLink, determineVisibility, TimeCounter, Searchlink } from './utilities';
import { fetchSearchResults } from "./utilities_fetch.js";
import { shorten } from "./utilities_strings"


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
    }, [query]);


    if (loading) return <p>Loading... <TimeCounter /></p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
            <SearchResults processedArray={processedArray} />
        </>
    );
};

export const SearchResults = ({ processedArray }) => {
    if (!Array.isArray(processedArray)) return <>{typeof processedArray}</>

    return (
        <div className="columns-lg">
            {/* eslint-disable */
                processedArray.map((obj, index) => (
                    <div key={`${obj.Title}`} className={`flex flex-col items-start w-full ${obj.Array.length <= 6 && 'break-inside-avoid'}`}>
                        <SearchSubtitle text={obj.Title} />
                        {obj.Array.map((o, i) => (
                            <>
                                <SearchResult key={o.codepoint} charaobj={o} exact={obj.Title.includes('Exact')} />
                                {obj.Title === "Exact match" && <Variants charaobj={o} />}
                            </>
                        ))}
                    </div>
                ))
                /* eslint-enable */}
        </div>
    )
}

const SearchSubtitle = ({ text }) => <>
    <div className="text-sm self-center text-neutral-500 ">
        {text}
    </div>
</>

const Variants = ({ charaobj }) => {
    const variants = []
    for (const symbol of charaobj.variants) {
        if (/\p{Script=Han}/u.test(symbol)) variants.push(`${symbol}`)
    }
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


const SearchResult = ({ charaobj, exact }) => {

    const [isVisible, setIsVisible] = useState(determineVisibility(charaobj));

    useEffect(() => {
        const handleStorage = (event) => {
            setIsVisible(determineVisibility(charaobj));
        }
        window.addEventListener('storage', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }, [charaobj])

    if (!charaobj) return
    let components = getComponents(charaobj);

    return (
        <> {(isVisible || exact) &&
            <div className="mx-auto flex bg-slate-50 hover:bg-slate-100 rounded-lg justify-between items-stretch my-1
        p-2 sm:gap-3 max-sm:p-0 w-full max-w-[32rem]">
                <ConsultLink className="rounded-lg flex hover:bg-slate-200 p-2 gap-2.5 items-center min-w-0 grow" text={charaobj.kanji}>
                    <div className="font-medium font-serif table-cell align-middle text-4xl sm:text-[2.5rem]">{charaobj.kanji}</div>
                    <div className="flex flex-col text-sm grow min-w-0 text-left">
                        <div className="w-full min-w-0 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.kun, true)} {shorten(charaobj.on)} {charaobj.pinyin}</div>
                        <div className="w-full min-w-0 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.meaning)}</div>
                    </div>
                </ConsultLink>

                <span className="flex gap-2 justify-center basis-28">
                    {components.map((obj, index) => (
                        <Searchlink className={`rounded-lg hover:bg-slate-200 flex flex-col ${setColorClass(obj.compRole)} justify-center size-[4rem] max-sm:w-[3rem]`} text={obj.compChar} key={index}>
                            <div className="scale-x-[.85] self-center text-sm select-none">{obj.compRole} </div>
                            <div className="max-sm:text-2xl self-center text-3xl font-medium font-serif">{obj.compChar}</div>
                        </Searchlink>
                    ))}
                </span>
            </div>
        } </>
    )
}


export default SearchResults