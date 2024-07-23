import { useEffect, useState } from "react"
import { useTabs, useTabsDispatch } from './TabsContext.js';
import { getComponents, setColorClass } from './utilities'
import { bookmarkLocalStorage, removeLocalStorage, ConsultLink, shorten, toHalfWidth } from './utilities.jsx'
//import { Accordion } from "./ui";

const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';
const wiktionaryapi = 'https://en.wiktionary.org/w/api.php?origin=*&action=parse&formatversion=2&prop=text&format=json&page='

const Caption = ({ title, data }) => {
    return (<div className="flex gap-3">
        <div className="text-neutral-400 select-none basis-16 shrink-0">{title}</div>
        <div className="min-w-20 grow">{data}</div>
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
            <div className="flex flex-col xl:flex-row w-full h-full overflow-y-auto">
                {kanjiData ? <>
                    <KanjiInfo kanjiData={kanjiData} />
                    <div className="w-full overflow-y-visible xl:overflow-y-hidden">
                        <div className="overflow-x-auto">
                            <div className="w-fit min-w-full flex justify-around gap-4">

                                {components.map((obj, index) => (
                                    <ComponentInfo character={obj.compchar} role={obj.comprole} key={index} />
                                ))}
                                {kanjiData.root_phonetic_search ?
                                    <ComponentInfo character={kanjiData.root_phonetic_search} role="Root phonetic" /> :
                                    <ComponentInfo character={kanjiData.kanji} role="Root phonetic" />}

                            </div>
                        </div>
                    </div>
                </> : <></>}
            </div>
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
        <div className="flex flex-col lg:max-xl:flex-row p-5 xl:max-w-[30rem] relative">
            <BookmarkButton kanji={kanjiData.kanji} />
            <div className="flex gap-5 max-sm:flex-col max-md:gap-0">
                <div className="flex flex-col gap-3 items-center xl:max-w-32">
                    <div className="text-9xl font-bold font-serif hover:font-light hover:font-sans">
                        {kanjiData.kanji}
                    </div>
                    <div className="">
                        {kanjiData.idc_analysis == "" ? kanjiData.idc_naive : kanjiData.idc_analysis}
                    </div>
                    <Caption title="meaning" data={kanjiData.meaning} />
                </div>
                <div className="flex flex-col">
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
                    <div className="flex max-xl:gap-3 xl:flex-col">
                        <div className="text-neutral-400 select-none max-xl:basis-16 shrink-0 xl:self-center">External links</div>
                        <div className="flex flex-wrap gap-x-3 xl:justify-around grow">
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://zi.tools/zi/${kanjiData.kanji}`}>full data</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://jisho.org/search/*${kanjiData.kanji}*`}>word search</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://www.wanikani.com/kanji/${kanjiData.kanji}`}>mnemonics</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=/${kanjiData.kanji}`}>etymology</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://en.wiktionary.org/wiki/${kanjiData.kanji}#Chinese`}>wiktionary</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grow">
                <h2 className="mt-2.5 font-bold text-bold">Etymology</h2>
                <div className="max-w-2xl mr-9">{wiktionaryextract}</div>
            </div>
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
            <div className="flex flex-col w-1/3 grow-0">
                <div className={`text-2xl max-md:text-xl select-none ${setColorClass(role)}`}>{role}</div>
                <div
                    onClick={() => {
                        dispatch({
                            type: 'consult',
                            title: character,
                            text: character,
                        });
                    }}
                    className={`cursor-pointer mt-2.5 text-8xl font-bold font-serif ${setColorClass(role)} max-md:text-6xl`}>
                    {character}
                </div>
                {!compData ? <></> : <>
                    <div>{shorten(compData.meaning)}</div>
                    <div> ({compData.on} {compData.pinyin})</div>
                </>}
                <ComponentSeries character={character} role={role === "Root phonetic" ? "Root phonetic" : "Phonetic"} />
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

    const [open, setOpen] = useState(true)

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

    const toggleAccordion = () => {
        setOpen(!open)
    }

    return (
        <>
            <div className={`flex justify-between self-stretch pr-2 mt-2.5 ${setColorClass(role)}`}>
                <div class="shrink max-lg:tracking-[-0.02em] text-[0.95em]">{role} Series of {character} </div>
                <button onClick={toggleAccordion} className={`hover:bg-gray-100 rounded-lg p-0.5 transition-all ${open ? '' : 'rotate-180'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
            <div className={`flex flex-col gap-1 w-full transition-all duration-300 ${open ? 'overflow-y-auto max-h-full xl:max-h-[calc(100vh-35rem)]' : 'overflow-hidden max-h-0'}`}>
                {!series.length ? <>None</> : <>
                    {series.map((obj, index) => (
                        <KanjiListItem charobj={obj} key={index} />
                    ))}</>}
            </div>
        </>
    )
}

const KanjiListItem = ({ charobj }) => {
    const dispatch = useTabsDispatch().dispatch;
    return (<>
        <button onClick={() => {
            dispatch({
                type: 'consult',
                title: charobj.kanji,
                text: charobj.kanji,
            });
        }}
            className="flex gap-1.5 items-center justify-start text-left tracking-tight hover:bg-gray-100 py-0.5 pl-1">
            <span className="text-xl">{charobj.kanji}</span>
            <span className="w-[6ch] text-sm shrink-0">
                {shorten(charobj.on, true)}
            </span>
            <span className="w-[6ch]">{charobj.pinyin}</span>
            <span className="grow text-ellipsis overflow-hidden text-nowrap">
                {shorten(charobj.meaning, true)}
            </span>
        </button>
    </>)
}



const BookmarkButton = (kanji) => {
    const isBookmarked = (entry) => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        return bookmarks.includes(entry);
    };

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
        <button className={(bookmarked ? removecolor : addcolor) + " absolute right-5 text-white p-1.5 rounded-lg flex flex-col self-stretch"} onClick={handleOnClick}>
            {bookmarked ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>}
        </button>
    )
}

export default DictEntry