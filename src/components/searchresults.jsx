import { useEffect, useState, useContext } from "react";
import { useTabs, useTabsDispatch } from './TabsContext.js';
import { getComponents, setColorClass, processQuery, processSearchResultArray } from './utilities';

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
    <div className="text-sm self-center text-neutral-400 ">
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
                <div className="rounded-lg w-[30rem]  self-center flex justify-around">
                    {variants.map((e, index) => (
                        <button onClick={() => {
                            dispatch({
                                type: 'consult',
                                title: e,
                                text: e,
                            });
                        }} key={index}
                            className="text-4xl font-black font-serif p-4 rounded-lg flex gap-2 bg-slate-100 hover:bg-slate-200"
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </> : <></>}
        </>
    )
}


function shorten(string, more = false) {
    if (more) return string.replace(new RegExp("[、;].+$", ''), '')
    else return string.replace(new RegExp("([^、;]*[、;][^、;]*).*", 'g'), '$1')
}


const SearchResult = ({ charaobj }) => {

    const dispatch = useTabsDispatch().dispatch;
    if (!charaobj) { return }
    let components = getComponents(charaobj)

    return (
        <div className="mx-auto w-[32rem] flex gap-3 items-center bg-slate-50 hover:bg-slate-100 rounded-lg p-2 justify-stretch">
            <button className="p-4 rounded-lg flex gap-2 hover:bg-slate-200 w-1/2"
                onClick={() => {
                    dispatch({
                        type: 'consult',
                        title: charaobj.kanji,
                        text: charaobj.kanji,
                    });
                }}>
                <div className="text-4xl font-black font-serif">{charaobj.kanji}</div>
                <div className="flex flex-col text-sm shrink-0 grow">
                    <div className="max-w-40 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.kun, true)} {shorten(charaobj.on)} {charaobj.pinyin}</div>
                    <div className="max-w-40 overflow-hidden text-ellipsis text-nowrap">{shorten(charaobj.meaning)}</div>
                </div>
            </button>

            <span className="flex w-1/2 gap-2 justify-center">
                {components.map((obj, index) => (
                    <button
                        onClick={() => {
                            dispatch({
                                type: 'search',
                                title: obj.compchar,
                                text: obj.compchar,
                            });
                        }}
                        className={`rounded-lg p-2 hover:bg-slate-200 flex flex-col ${setColorClass(obj.comprole)}`} key={index}>
                        <div className="text-sm select-none">{obj.comprole} </div>
                        <div className="self-center text-3xl font-black font-serif">{obj.compchar}</div>
                    </button>
                ))}
            </span>
        </div>
    )
}

const fallback = {
    "codepoint": "U+67D0",
    "kanji": "某",
    "on": "ボウ",
    "pinyin": "mǒu",
    "jyutping": "mau5",
    "kun": "それがし、なにがし",
    "meaning": "so-and-so;a certain",
    "tags": "會意, 常用",
    "variants": "厶",
    "JP shinjitai form": "",
    "idc_analysis": "",
    "idc_naive": "⿱甘木",
    "意": "",
    "聲": "",
    "原聲": "",
    "最原聲": "",
    "root_phonetic_search": "",
    "聲 pinyin": "",
    "聲 on": "",
    "聲 jyutping": "",
    "components": "甘木曰",
    "freq_jp": "1918",
    "freq_zh": "517",
    "inclusion_jomako": "16.00%",
    "inclusion_all": "1.31%",
    "high frequency words": "",
    "mid frequency words": "某",
    "low frequency words": null,
    "extremely rare words": null,
    "proper nouns": null
}

export default SearchResults