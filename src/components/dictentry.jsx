import { useEffect, useState } from "react"
import { useTabs, useTabsDispatch } from './TabsContext.js';
import getComponents from "./getcomponents.js";

//import axios from "axios";
const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';
const wiktionaryapi = // 'https://en.wiktionary.org/w/api.php?origin=*&format=json&action=query&prop=extracts&explaintext&titles='
    'https://en.wiktionary.org/w/api.php?origin=*&action=parse&formatversion=2&prop=text&format=json&page='

const Caption = ({ title, data }) => {
    return (<div className="flex gap-3 justify">
        <div className="text-neutral-400 select-none basis-16">{title}</div>
        <div className="min-w-20">{data}</div>
    </div>)
}


function color(role) {
    var color = "";
    switch (role) {
        case 'Semantic': color = 'text-cyan-700'; break;
        case 'Phonetic': color = 'text-red-700'; break;
        case 'Root phonetic': color = 'text-red-900'; break;
        case 'Empty': color = 'text-purple-600'; break;
        case 'Form': color = 'text-orange-400'; break;
    }
    return color
}

function hovercolor(role) {
    var color = "";
    switch (role) {
        case 'Semantic': color = 'text-cyan-800'; break;
        case 'Phonetic': color = 'text-red-800'; break;
        case 'Root phonetic': color = 'text-red-950'; break;
        case 'Empty': color = 'text-purple-700'; break;
        case 'Form': color = 'text-orange-500'; break;
    }
    return "hover:" + color
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
            <div>
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
                <div className={`text-2xl select-none ${color(role)}`}>{role}</div>
                <div
                    onClick={() => {
                        dispatch({
                            type: 'consult',
                            title: character,
                            text: character,
                        });
                    }}
                    className={`cursor-pointer mt-2.5 text-8xl font-black font-serif ${color(role)}  ${hovercolor(role)} max-md:text-4xl`}>
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
            <div className={`flex gap-1 justify-between self-stretch pr-2 mt-2.5 ${color(role)}`}>
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

export default DictEntry