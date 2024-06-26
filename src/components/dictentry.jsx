import { useEffect, useState } from "react"
//import axios from "axios";
const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';
const wiktionaryapi = 'https://en.wiktionary.org/w/api.php?format=json&action=query&prop=extracts&explaintext&titles='

const Caption = ({ title, data }) => <div className="flex gap-3 justify"><div className="text-neutral-400 select-none basis-16">{title}</div><div className="min-w-20">{data}</div></div>;


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

function getComponents(charaobj) {
    let components = []
    if (charaobj.tags.includes("形聲")) {
        components = [{ compchar: charaobj.意, comprole: "Semantic" }, { compchar: charaobj.聲, comprole: "Phonetic" }];
    }
    else {
        let idc = charaobj.idc_analysis == "" ? charaobj.idc_naive : charaobj.idc_analysis;
        idc = idc.replace(new RegExp("[⿰-⿿]"), '');

        for (let i = 0; i < idc.length; i++) {
            components.push({ compchar: idc.charAt(i), comprole: "Semantic" });
        }
    }
    return components
}

function DictEntry(kanji) {

    //const [reloadFlag, setReloadFlag] = useState(false);
    const [kanjiData, setKanjiData] = useState({
        "codepoint": "U+8584",
        "kanji": "薄",
        "on": "ハク",
        "pinyin": "báo bó",
        "jyutping": "bok6 bok2",
        "kun": "うす.い、うす、うす.める、うす.まる、うす.らぐ、うす.ら、うす.れる、すすき、せま.る",
        "meaning": "dilute;thin",
        "tags": "形聲, 常用",
        "variants": "",
        "JP shinjitai form": "",
        "idc_analysis": "⿱艹溥",
        "idc_naive": "⿱艹⿰氵⿱⿺𤰔丶寸",
        "意": "艹",
        "聲": "溥",
        "原聲": "尃",
        "最原聲": "甫",
        "聲 pinyin": "pǔ",
        "聲 on": "ホ、フ",
        "聲 jyutping": "pou2",
        "components": "艹氵𤰔丶寸溥十丨甫月尃",
        "freq_jp": "874",
        "freq_zh": "1431",
        "inclusion_jomako": "49.50%",
        "inclusion_all": "5.51%",
        "high frequency words": "薄い，薄暗い，薄れる",
        "mid frequency words": null,
        "low frequency words": null,
        "extremely rare words": null,
        "proper nouns": null
    })
    //const [kanji, setKanji] = useState("翻");
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
            <div className="flex flex-col xl:flex-row">
                <KanjiInfo kanjiData={kanjiData} />
                <div className="flex justify-center gap-4">

                    {components.map((obj, index) => (
                        <ComponentInfo character={obj.compchar} role={obj.comprole} key={index} />
                    ))}

                    {kanjiData.原聲 == (undefined || '') ? <>
                        <ComponentInfo character={kanjiData.kanji} role="Root phonetic" />
                    </> : <>
                        <ComponentInfo character={kanjiData.原聲} role="Root phonetic" />
                    </>}
                </div>
            </div>
        </>
    )
}



const KanjiInfo = ({ kanjiData }) => {
    const [wiktionaryextract, setWiktionaryextract] = useState("Phono-semantic compound (形聲／形声, OC *pʰan) : phonetic 番 (OC *paːl, *paːls, *pʰaːn, *pʰan, *ban) + semantic 羽 (“wings”) – to flutter.");

    /*
    useEffect(() => {
        fetch(wiktionaryapi + kanjiData.kanji)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setWiktionaryextract(data.extract);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])*/


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
                        <Caption title="tags" data={kanjiData.tags} />
                        <Caption title="inclusion" data={<>{kanjiData.inclusion_jomako} (pop culture)<br /> {kanjiData.inclusion_all} (all texts)</>} />
                        <Caption title="variants" data={kanjiData.variants} />
                        <div className="col-span-2 text-neutral-400 self-center">External search</div>
                        <div className="col-span-2 flex flex-wrap gap-x-3 justify-center">
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" href={`https://zi.tools/zi/${kanjiData.kanji}`}>zi.tools</a></div>
                            <div>search in <a className="text-cyan-500 underline hover:text-blue-500" href={`https://jisho.org/search/*${kanjiData.kanji}*`}>jisho.org</a></div>
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" href={`https://www.wanikani.com/kanji/${kanjiData.kanji}`}>wanikani</a></div>
                            <div>see in <a className="text-cyan-500 underline hover:text-blue-500" href={`https://en.wiktionary.org/wiki/${kanjiData.kanji}#Chinese`}>wiktionary</a></div>
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
                <div className={`text-2xl ${color(role)}`}>{role}</div>
                <div className={`mt-2.5 text-8xl font-black font-serif ${color(role)} max-md:text-4xl`}>
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