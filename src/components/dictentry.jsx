import { useEffect, useState } from "react"
import { useTabs, useTabsDispatch } from './TabsContext.js';
import { getComponents, setColorClass } from './utilities'
import { bookmarkLocalStorage, removeLocalStorage } from './utilities.jsx'


//import axios from "axios";
const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';
const wiktionaryapi = 'https://en.wiktionary.org/w/api.php?origin=*&action=parse&formatversion=2&prop=text&format=json&page='

const Caption = ({ title, data }) => {
    return (<div className="flex gap-3 justify">
        <div className="text-neutral-400 select-none basis-16">{title}</div>
        <div className="min-w-20">{data}</div>
    </div>)
}


function DictEntry(kanji) {

    const [kanjiData, setKanjiData] = useState()

    const [components, setComponents] = useState([]);

    useEffect(() => {
        fetch(`${apiurl}/kanji/${kanji.kanji}`)
            .then(response => response.json())
            .then(data => {
                console.log('kanji ' + kanji.kanji);
                console.log(data);
                setKanjiData(data[0] == undefined ? kanjiData : data[0]);
                setComponents(getComponents(data[0]));
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <>
            {kanjiData ?
                <div className="flex flex-col xl:flex-row">

                    <KanjiInfo kanjiData={kanjiData} />
                    <div className="flex justify-around gap-4">
                        {components.map((obj, index) => (
                            <ComponentInfo character={obj.compchar} role={obj.comprole} key={index} />
                        ))}
                        {kanjiData.root_phonetic_search ?
                            <ComponentInfo character={kanjiData.root_phonetic_search} role="Root phonetic" /> :
                            <ComponentInfo character={kanjiData.kanji} role="Root phonetic" />}
                    </div>
                </div>
                : <></>}
        </>
    )
}



const KanjiInfo = ({ kanjiData }) => {
    const dispatch = useTabsDispatch().dispatch;
    const variants = kanjiData ? kanjiData.variants ? kanjiData.variants.split(',') : [] : [];
    const tags = kanjiData ? kanjiData.tags ? kanjiData.tags.split(', ') : [] : [];

    const [wiktionaryextract, setWiktionaryextract] = useState("");

    useEffect(() => {
        fetch(wiktionaryapi + kanjiData.kanji)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let etymsection = data.parse.text.split('<h3 id=\"Glyph_origin\">Glyph origin</h3>')[1].split('<span class="mw-editsection-bracket">]</span>')[1].split('<div class="mw-heading')[0]
                if (!etymsection.includes('<p>')) etymsection = '';
                else {
                    etymsection = etymsection.replace(new RegExp("<table.+?</table>", 's'), '');
                    etymsection = etymsection.replace(new RegExp(".+?(<p>)", 's'), '$1');
                    //etymsection = etymsection.replace(new RegExp("<table.+?</table>", 's'), '');
                    //etymsection = etymsection.replace(new RegExp('<div class="NavHead".+?</div>', 's'), '');
                    //etymsection = etymsection.replace(new RegExp('<div class="NavContent".+?</div>', 's'), '');
                    //etymsection = etymsection.replace(new RegExp('<div class="Nav.+</div>', 's'), '');
                    etymsection = etymsection.replace(new RegExp("<a", 'gs'), '<a class="text-cyan-500 underline hover:text-blue-500" target="_blank"');
                    etymsection = etymsection.replace(new RegExp('href="/', 'gs'), 'href="https://en.wiktionary.org/');

                    etymsection = <div dangerouslySetInnerHTML={{ __html: etymsection }} />
                }
                setWiktionaryextract(etymsection);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])


    return (
        <div className="flex flex-col px-5 py-px min-w-[30rem]">
            <div className="relative">
                <BookmarkButton kanji={kanjiData.kanji} />
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div className="flex flex-col gap-3 items-center">
                        <div className="text-9xl font-black font-serif">
                            {kanjiData.kanji}
                        </div>
                        <div className="">
                            {kanjiData.idc_analysis == "" ? kanjiData.idc_naive : kanjiData.idc_analysis}
                        </div>
                        <Caption title="meaning" data={kanjiData.meaning} />
                    </div>
                    <div className="flex flex-col ml-5">
                        <Caption title="kun" data={kanjiData.kun} />
                        <Caption title="on" data={kanjiData.on} />
                        <Caption title="pinyin" data={kanjiData.pinyin} />
                        <Caption title="jyutping" data={kanjiData.jyutping} />
                        <Caption title="tags" data=
                            {tags.map((e, index) => (
                                <><a onClick={() => {
                                    dispatch({
                                        type: 'search',
                                        title: '#' + e,
                                        text: '#' + e,
                                    });
                                }} key={index}
                                    className="cursor-pointer text-cyan-500 underline hover:text-blue-500"
                                >
                                    #{e} {/*<SearchResult charaobj={kanji} />*/}
                                </a>&nbsp;</>
                            ))}
                        />
                        <Caption title="inclusion" data={<>{kanjiData.inclusion_jomako} (pop culture)<br /> {kanjiData.inclusion_all} (all texts)</>} />
                        <Caption title="variants" data=
                            {variants.map((e, index) => (
                                <>
                                    <a onClick={() => {
                                        dispatch({
                                            type: 'consult',
                                            title: e,
                                            text: e,
                                        });
                                    }} key={index}
                                        className="cursor-pointer text-cyan-500 underline hover:text-blue-500"
                                    >{e}</a>&nbsp;</>
                            ))}
                        />
                        <div className="col-span-2 text-neutral-400 self-center">External search</div>
                        <div className="col-span-2 flex flex-wrap gap-x-3 justify-center">
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://zi.tools/zi/${kanjiData.kanji}`}>zi.tools</a></div>
                            <div>search in <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://jisho.org/search/*${kanjiData.kanji}*`}>jisho.org</a></div>
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://www.wanikani.com/kanji/${kanjiData.kanji}`}>wanikani</a></div>
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://en.wiktionary.org/wiki/${kanjiData.kanji}#Chinese`}>wiktionary</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="mt-2.5 font-bold text-black">Etymology</h2>
            {wiktionaryextract}
        </div>
    )
}

const ComponentInfo = ({ character, role }) => {
    const [compData, setCompData] = useState();
    const dispatch = useTabsDispatch().dispatch;

    useEffect(() => {
        fetch(`${apiurl}/kanji/${character}`)
            .then(response => response.json())
            .then(data => {
                console.log('component ' + character);
                console.log(data);
                setCompData(data[0]);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <>
            <div className="flex flex-col w-1/3">
                <div className={`text-2xl select-none ${setColorClass(role)}`}>{role}</div>
                <div
                    onClick={() => {
                        dispatch({
                            type: 'consult',
                            title: character,
                            text: character,
                        });
                    }}
                    className={`cursor-pointer mt-2.5 text-8xl font-black font-serif ${setColorClass(role)} max-md:text-4xl`}>
                    {character}
                </div>
                {compData == undefined ? <></> : <>
                    <div>{compData.meaning.replace(new RegExp("([^;]*;[^;]*).*"), '$1')}</div>
                    <div> ({compData.on} {compData.pinyin})</div>
                </>}
                <ComponentSeries character={character} role="Phonetic" />
                <ComponentSeries character={character} role="Semantic" />
            </div>
        </>
    )
}


const ComponentSeries = ({ character, role }) => {
    let query = ""
    switch (role) {
        case 'Semantic': query = '意'; break;
        case 'Phonetic': query = '聲'; break;
        case 'Root phonetic': query = 'root_phonetic_search'; break;
        case 'Empty': query = ''; break;
        case 'Form': query = ''; break;
    }
    const [series, setSeries] = useState([])

    useEffect(() => {
        fetch(`${apiurl}/query?freq_jp=__lte(2600)&${query}=${character}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSeries(data);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <>
            <div className={`flex gap-1 justify-between self-stretch pr-2 mt-2.5 ${setColorClass(role)}`}>
                <div class="whitespace-nowrap">{role} Series of {character} </div>v
            </div>
            <div className="flex flex-col justify-center gap-2 w-full">
                {series.map((obj, index) => (
                    <KanjiListItem charobj={obj} key={index} />
                ))}
            </div>
        </>
    )
}

const KanjiListItem = ({ charobj }) => <>
    <div className="flex gap-2 items-center justify-start">
        <div className="text-xl">{charobj.kanji}</div>
        <div className="shrink-0 w-12 tracking-tighter text-ellipsis">
            {charobj.on.replace(new RegExp("、.+$"), '')}
        </div>
        <div className="w-16">{charobj.pinyin}</div>
        <div className="text-center self-stretch">
            {charobj.meaning.replace(new RegExp("[;()].+$"), '')}
        </div>
    </div>

</>

const isBookmarked = (entry) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    return bookmarks.includes(entry);
};

const BookmarkButton = (kanji) => {
    const [bookmarked, setBookmarked] = useState(isBookmarked(kanji.kanji));

    const handleOnClick = (event) => {
        if (bookmarked) {
            removeLocalStorage('bookmarks', kanji.kanji)
        }
        else {
            bookmarkLocalStorage('bookmarks', kanji.kanji)
        }
        setBookmarked(isBookmarked(kanji.kanji))
    }

    

    let addcolor = "bg-cyan-500 hover:bg-cyan-600"
    let removecolor = "bg-yellow-500 hover:bg-yellow-600"



    return (
        <button className={(bookmarked ? removecolor : addcolor) + " absolute right-0 text-white p-1.5 rounded-lg flex flex-col self-stretch"} onClick={handleOnClick}>
            {bookmarked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>}
        </button>
    )
}

export default DictEntry