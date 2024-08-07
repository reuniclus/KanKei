import { useEffect, useState } from "react"
import { Searchlink, setColorClass, bookmarkLocalStorage, removeLocalStorage, ConsultLink, determineVisibility, TimeCounter, mergeAndRemoveDuplicates, defaultsettings } from './utilities'
import { fetchKanjiObject } from "./utilities_fetch"
import { toPercentage, shorten } from "./utilities_strings"

const wiktionaryapi = 'https://en.wiktionary.org/w/api.php?origin=*&action=parse&formatversion=2&prop=text&format=json&page='

const Caption = ({ title, data, className }) => {
    return (<div className={`flex gap-3 ${className}`}>
        <div className="text-neutral-400 select-none basis-16 shrink-0">{title}</div>
        <div className={`min-w-20 grow`}>{data}</div>
    </div>)
}


export function DictEntryContainer({ kanji }) {
    const [entryObj, setEntryObj] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const data = await fetchKanjiObject(kanji)
            console.log('entryObj');
            console.log(data);
            setEntryObj(data);
            setLoading(false);
        };

        fetchData();
    }, [kanji]);


    if (loading) return <p>Loading... <TimeCounter /></p>
    if (error) return <p>Error: {error}</p>
    return (
        <>
            <DictEntry EntryObj={entryObj} />
        </>
    );
}


export function DictEntry({ EntryObj }) {
    if (!EntryObj) return
    let componentArray = EntryObj.componentArray;
    return (
        <>
            <div className="flex flex-col xl:flex-row max-xl:gap-2 w-full h-full overflow-y-auto">
                <KanjiInfo charObj={EntryObj.consultedKanjiObj} />

                <div className="w-full h-full overflow-y-visible xl:overflow-y-hidden flex min-w-0 transform ">
                    <div className="overflow-x-auto h-full flex w-full transform">
                        <div className="px-5 
                            h-full w-full justify-evenly
                            flex gap-4">
                            {componentArray.map((obj, index) => (
                                <ComponentInfo key={index} compObj={obj} />
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

function processWiktionaryHTML(wiktionaryJSON) {
    let etymsection = ''
    etymsection = wiktionaryJSON.parse.text
    try {
        // eslint-disable-next-line
        etymsection = etymsection.split('<h3 id=\"Glyph_origin\">Glyph origin</h3>')[1].split('<div class="mw-heading')[0]
    }
    catch {
        etymsection = ''
    }

    if (etymsection.includes("<p")) etymsection = etymsection.replace(new RegExp(".*?(<p>.+?<\/p>).*?", 'gs'), '$1');
    else etymsection = ''

    /*
        etymsection = etymsection.replace(new RegExp('<span class="mw-editsection">.*?edit.*?</span></a><span class="mw-editsection-bracket">]</span></span>', 'mgs'), '')
        etymsection = etymsection.replace(new RegExp("<table.+?</table>", 'gs'), '');
        etymsection = etymsection.replace(new RegExp('<div class="NavHead".+?</div>', 's'), '');
        etymsection = etymsection.replace(new RegExp('<div class="NavContent".+?</div>', 's'), '');
        etymsection = etymsection.replace(new RegExp('<div class="NavFrame".+?</div>', 'gs'), '');
    */

    etymsection = etymsection.replace(new RegExp("<a", 'gs'), '<a class="text-cyan-500 underline hover:text-blue-500" target="_blank"');
    etymsection = etymsection.replace(new RegExp('href="/', 'gs'), 'href="https://en.wiktionary.org/');

    if (!etymsection.trim()) etymsection = 'Not found in Wiktionary.'

    let dangerouslySetInnerHTML = <div dangerouslySetInnerHTML={{ __html: etymsection }} />
    return dangerouslySetInnerHTML
}


const KanjiInfo = ({ charObj }) => {
    const variants = []
    for (const symbol of charObj.variants) {
        if (/\p{Script=Han}/u.test(symbol)) variants.push(`${symbol}`)
    }

    const tags = charObj ? charObj.tags ? charObj.tags.split(', ') : [] : [];

    const [wiktionaryextract, setWiktionaryextract] = useState("");

    const [savedSettings, setSavedSettings] = useState(JSON.parse(localStorage.getItem('settings')) || defaultsettings);

    useEffect(() => {
        const handleStorage = (event) => {
            setSavedSettings(JSON.parse(localStorage.getItem('settings')));
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, []);


    useEffect(() => {
        fetch(wiktionaryapi + charObj.kanji)
            .then(response => response.json())
            .then(data => {
                setWiktionaryextract(processWiktionaryHTML(data));
            })
            .catch(error => {
                console.log(error)
            })
    }, [charObj.kanji])

    return (
        <div className="flex flex-col lg:max-xl:flex-row p-5 pb-0 xl:max-w-[30rem] 
        gap-3 lg:gap-5 xl:gap-0 relative">
            <BookmarkButton kanji={charObj.kanji} />
            <div className="flex max-sm:flex-col gap-3">
                <div className="flex flex-col gap-3 items-center xl:max-w-32">
                    <div className="text-9xl font-medium font-serif hover:font-light hover:font-sans">
                        {charObj.kanji}
                    </div>
                    <div className="">
                        {charObj.idc_analysis === "" ? charObj.idc_naive : charObj.idc_analysis}
                    </div>
                </div>
                <div className="flex flex-col">
                    <Caption className="xl:max-w-[87%]" title="kun" data={charObj.kun} />
                    <Caption title="on" data={charObj.on} />
                    {savedSettings.show_pinyin && <Caption title="pinyin" data={charObj.pinyin} />}
                    {savedSettings.show_jyutping && <Caption title="jyutping" data={charObj.jyutping} />}
                    {savedSettings.show_tags && <Caption title="tags" data=
                        {tags.map((e, index) => (
                            <><Searchlink key={index} text={'#' + e} />&nbsp;</>
                        ))}
                    />}

                    <Caption title="inclusion" data={<><span title="Anime, manga, VNs, videogames">{toPercentage(charObj.inclusion_jomako)} (op culture)</span><br /> {toPercentage(charObj.inclusion_all)} (all texts)</>} />

                    {savedSettings.show_variants && <Caption title="variants" data=
                        {variants.map((e, index) => (
                            <>
                                <ConsultLink key={index} text={e} />&nbsp;</>
                        ))}
                    />}

                    <div className="flex max-xl:gap-3 xl:flex-col">
                        <div className="text-neutral-400 select-none max-xl:basis-16 shrink-0 xl:self-center">External links</div>
                        <div className="columns-2">
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" rel="noreferrer" href={`https://zi.tools/zi/${charObj.kanji}`}>full data</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" rel="noreferrer" href={`https://jisho.org/search/*${charObj.kanji}*`}>word search</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" rel="noreferrer" href={`https://www.wanikani.com/kanji/${charObj.kanji}`}>mnemonics</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" rel="noreferrer" href={`https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=${charObj.kanji}`}>etymology</a></div>
                            <div><a className="text-cyan-500 underline hover:text-blue-500" target="_blank" rel="noreferrer" href={`https://en.wiktionary.org/wiki/${charObj.kanji}#Chinese`}>wiktionary</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full grow overflow-auto">
                <h2 className="font-bold text-bold">Meaning</h2>
                {charObj.meaning}
                <h2 className="font-bold text-bold">Etymology</h2>
                <div className="max-w-2xl mr-9">{wiktionaryextract}</div>
                {charObj.Notes && <>
                    <h2 className="font-bold text-bold mt-2">Notes</h2>
                    <div className="max-w-2xl">
                        <TextWithLineBreaks text={charObj.Notes} />
                    </div>
                </>
                }
            </div>
        </div>
    )
}

function TextWithLineBreaks({ text }) {
    return (
        <div>
            {text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
}

const ComponentInfo = ({ compObj }) => {
    const [savedSettings, setSavedSettings] = useState(JSON.parse(localStorage.getItem('settings')) || defaultsettings);

    useEffect(() => {
        const handleStorage = (event) => {
            setSavedSettings(JSON.parse(localStorage.getItem('settings')));
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, []);


    return (
        <>
            <div className="flex flex-col basis-0 grow max-sm:max-w-52 sm:min-w-0 justify-start">
                <div className={`text-2xl max-md:text-xl select-none ${setColorClass(compObj.role)}`}>{compObj.role}</div>
                <ConsultLink text={compObj.charObj.kanji} className={`cursor-pointer mt-2.5 text-8xl font-bold font-serif text-left ${setColorClass(compObj.role)} max-md:text-6xl`} />
                <div>{shorten(compObj.charObj.meaning)}</div>
                <div>({compObj.charObj.on}{savedSettings.show_pinyin && ` ${compObj.charObj.pinyin}`}{savedSettings.show_jyutping && ` ${compObj.charObj.jyutping}`})</div>

                <ComponentSeries character={compObj.charObj.kanji}
                    role={compObj.role === "root_phonetic" ? "Root phonetic" : "Phonetic"}
                    seriesArray={compObj.role === "root_phonetic" ? compObj.series.root_phonetic : compObj.series.phonetic}
                />
                <ComponentSeries character={compObj.charObj.kanji} role="Semantic"
                    seriesArray={mergeAndRemoveDuplicates(compObj.series.semantic, compObj.series.form)} />
            </div>
        </>
    )
}


const ComponentSeries = ({ character, role, seriesArray }) => {

    const [open, setOpen] = useState(true)

    const toggleAccordion = () => {
        setOpen(!open)
    }
    if (!seriesArray) return

    return (
        <>
            <div className={`flex justify-between self-stretch pr-2 mt-2.5 ${setColorClass(role)}`}>
                <div className="shrink max-lg:tracking-[-0.02em] text-[0.95em]">{role} Series of {character} </div>
                <button onClick={toggleAccordion} className={`hover:bg-gray-100 rounded-lg p-0.5 transition-all ${open ? '' : 'rotate-180'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
            <div className={`flex flex-col gap-1 w-full transition-all duration-300 
                ${open ? 'overflow-y-auto max-h-full min-h-8' : 'overflow-hidden max-h-0 min-h-0'}`}>
                {seriesArray.every((obj) => !determineVisibility(obj)) ?
                    <button className="flex gap-1.5 items-center justify-start text-left tracking-tight hover:bg-gray-100 py-0.5 pl-1 rounded-md">None</button> :
                    <>{seriesArray.map((obj, index) => (
                        <SeriesListItem charobj={obj} key={index} />
                    ))}</>}
            </div>
        </>
    )
}

const SeriesListItem = ({ charobj }) => {
    const [isVisible, setIsVisible] = useState(determineVisibility(charobj));
    const [savedSettings, setSavedSettings] = useState(JSON.parse(localStorage.getItem('settings')) || defaultsettings);

    useEffect(() => {
        const handleStorage = (event) => {
            setSavedSettings(JSON.parse(localStorage.getItem('settings')));
            setIsVisible(determineVisibility(charobj));
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, [charobj])

    return (<> {isVisible &&
        <ConsultLink className="flex gap-1.5 items-center justify-start text-left tracking-tight hover:bg-gray-100 py-0.5 pl-1 rounded-md" text={charobj.kanji}>
            <span className="text-xl">{charobj.kanji}</span>
            <span className="w-[6ch] text-sm shrink-0">
                {shorten(charobj.on, true)}
            </span>
            {savedSettings.show_pinyin && <span className="w-[6ch]">{charobj.pinyin}</span>}
            {savedSettings.show_jyutping && <span className="w-[6ch]">{charobj.jyutping.replace(/ .+$/, '')}</span>}
            <span className="grow text-ellipsis overflow-hidden text-nowrap" title={charobj.meaning}>
                {shorten(charobj.meaning, true)}
            </span>
        </ConsultLink >
    }</>)
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

