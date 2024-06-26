import { useEffect, useState, useContext } from "react"
import { globalContext } from "./globalProvider.jsx";
import { useTabs, useTabsDispatch } from './TabsContext.js';


const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';

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

const randkanji = ["神", "監", "奇", "寶", "貝", "哦", "我", "會", "納", "入", "阿", "爸", "能", "沒", "有", "反"];

const fakeapi = [
    {
        "codepoint": "U+6E0B",
        "kanji": "渋",
        "on": "ジュウ",
        "pinyin": "sè",
        "jyutping": "gip3",
        "kun": "しぶ、しぶ.い、しぶ.る",
        "meaning": "astringent;not going smoothly",
        "tags": "新字体, 常用, 形聲",
        "variants": "澁,澀,濇",
        "JP shinjitai form": "",
        "idc_analysis": "",
        "idc_naive": "⿰氵⿱止⿱丷八",
        "意": "氵",
        "聲": "歰",
        "原聲": "",
        "最原聲": "",
        "root_phonetic_search": "歰",
        "聲 pinyin": "sè",
        "聲 on": "シュウ、ソウ",
        "聲 jyutping": "sap1 saap3",
        "components": "氵止丷八刃𣥖",
        "freq_jp": "1466",
        "freq_zh": "9000",
        "inclusion_jomako": "27.00%",
        "inclusion_all": "3.61%",
        "high frequency words": "渋い",
        "mid frequency words": "渋々",
        "low frequency words": "",
        "extremely rare words": "",
        "proper nouns": "渋谷(シブヤ)"
    },
    {
        "codepoint": "U+76E3",
        "kanji": "監",
        "on": "カン",
        "pinyin": "jiān",
        "jyutping": "gaam1 gaam3",
        "kun": "かんがみ.る、み.る、しら.べる",
        "meaning": "oversee",
        "tags": "常用, 會意",
        "variants": "监",
        "JP shinjitai form": "",
        "idc_analysis": "⿱臥血",
        "idc_naive": "⿱⿰臣⿱𠂉一皿",
        "意": "",
        "聲": "",
        "原聲": "",
        "最原聲": "",
        "root_phonetic_search": "",
        "聲 pinyin": "",
        "聲 on": "",
        "聲 jyutping": "",
        "components": "臣𠂉一皿臥血",
        "freq_jp": "687",
        "freq_zh": "9000",
        "inclusion_jomako": "49.25%",
        "inclusion_all": "14.43%",
        "high frequency words": "監視，監督，監禁",
        "mid frequency words": "監獄",
        "low frequency words": "監査",
        "extremely rare words": null,
        "proper nouns": null
    },
    {
        "codepoint": "U+95C7",
        "kanji": "闇",
        "on": "アン、オン",
        "pinyin": "àn",
        "jyutping": "am2 ngam2 am1 ngam1 am3 ngam3",
        "kun": "やみ、くら.い",
        "meaning": "pitch dark",
        "tags": "形聲, 常用",
        "variants": "𬮴",
        "JP shinjitai form": "",
        "idc_analysis": "",
        "idc_naive": "⿵門音",
        "意": "門",
        "聲": "音",
        "原聲": "",
        "最原聲": "",
        "聲 pinyin": "yīn",
        "聲 on": "オン、イン",
        "聲 jyutping": "jam1",
        "components": "門音𠁣𠃛言一立日",
        "freq_jp": "746",
        "freq_zh": "9000",
        "inclusion_jomako": "57.50%",
        "inclusion_all": "3.10%",
        "high frequency words": "闇，暗闇",
        "mid frequency words": "None",
        "low frequency words": "None",
        "extremely rare words": "None",
        "proper nouns": "None"
    },
    {
        "codepoint": "U+9589",
        "kanji": "閉",
        "on": "ヘイ",
        "pinyin": "bì",
        "jyutping": "bai3",
        "kun": "と.じる、と.ざす、し.める、し.まる、た.てる",
        "meaning": "closed",
        "tags": "會意, 常用",
        "variants": "闭",
        "JP shinjitai form": "",
        "idc_analysis": "",
        "idc_naive": "⿵門才",
        "意": "",
        "聲": "",
        "原聲": "",
        "最原聲": "",
        "聲 pinyin": "",
        "聲 on": "",
        "聲 jyutping": "",
        "components": "門才𠁣𠃛",
        "freq_jp": "704",
        "freq_zh": "9000",
        "inclusion_jomako": "55.00%",
        "inclusion_all": "7.75%",
        "high frequency words": "閉じる，閉める，閉じ込める，閉ざす，閉まる，閉鎖，閉店",
        "mid frequency words": "閉じこめる",
        "low frequency words": "閉廷",
        "extremely rare words": "None",
        "proper nouns": "None"
    }
    ,
    {
        "codepoint": "U+5FB4",
        "kanji": "徴",
        "on": "チョウ",
        "pinyin": "zhēng",
        "jyutping": "zing1",
        "kun": "しるし、め.す",
        "meaning": "indications;levy;symptom",
        "tags": "新字体, 常用, 會意",
        "variants": "徵,征",
        "JP shinjitai form": "",
        "idc_analysis": "",
        "idc_naive": "⿲彳㞷攵",
        "意": "",
        "聲": "",
        "原聲": "",
        "最原聲": "",
        "聲 pinyin": "",
        "聲 on": "",
        "聲 jyutping": "",
        "components": "彳㞷攵㞢土山王",
        "freq_jp": "901",
        "freq_zh": "9000",
        "inclusion_jomako": "43.50%",
        "inclusion_all": "9.84%",
        "high frequency words": "特徴，象徴",
        "mid frequency words": null,
        "low frequency words": null,
        "extremely rare words": null,
        "proper nouns": null
    }
]

function SearchResults(query) {
    let quer = query.query;

    if(quer.charCodeAt(0) < 0x4e00){ // - 9faf
        quer = randkanji[query.query.length % 15];
    }
    
    const dispatch = useTabsDispatch().dispatch;
    const activeTab = useTabs().activeTab;

    const [kanji, setKanji] = useState();
    const variants = kanji ? kanji.variants ? kanji.variants.split(',') : [] : [];
    const [searchresults, setSearchResults] = useState([]);

    //exact match
    useEffect(() => {
        if (query) {
            fetch(`${apiurl}/kanji/${quer}`)
                .then(response => response.json())
                .then(data => {
                    console.log(quer);
                    console.log(data[0]);
                    setKanji(data[0]);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [])

    //component query
    useEffect(() => {
        if (quer) {
            fetch(`${apiurl}/query?freq_jp=__lte(2600)&components=*${quer}*`)
                .then(response => response.json())
                .then(data => {
                    console.log(quer);
                    console.log(data)
                    setSearchResults(data);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [])

    if (!query) { return }
    if (!kanji) { return (<>Kanji {quer} not found</>) }
    return (
        <>
            <div className="flex flex-col gap-3 items-start">

                <SearchResult charaobj={kanji} />

                {variants.length > 0 ? <>
                    <SearchSubtitle text="Character variants" />
                    {variants.map((e, index) => (
                        <button onClick={() => {
                            dispatch({
                                type: 'consult',
                                title: e,
                                text: e,
                            });
                        }} key={index}>
                            {e} {/*<SearchResult charaobj={kanji} />*/}
                        </button>
                    ))}</> : <></>}

                {searchresults.length > 0 ? <>
                    <SearchSubtitle text={`Characters with the component ${kanji.kanji}`} />
                    {searchresults.map((obj, index) => (
                        <SearchResult charaobj={obj} key={index} />
                    ))}</> : <></>}

            </div>
        </>
    )
}


const SearchSubtitle = ({ text }) => <>
    <div className="text-sm self-center text-neutral-400 ">
        {text}
    </div>
</>

function getComponents(charaobj) {
    let components = []
    if (!charaobj) { return components }
    console.log(charaobj)
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
    return components;
}

const SearchResult = ({ charaobj }) => {
    if (!charaobj) { return }
    const dispatch = useTabsDispatch().dispatch;
    let components = getComponents(charaobj)

    return (
        <div className="flex gap-3 justify-between items-center bg-slate-50 p-2 hover:bg-slate-100">
            <button className="flex gap-2 w-1/2 min-w-56"
                onClick={() => {
                    dispatch({
                        type: 'consult',
                        title: charaobj.kanji,
                        text: charaobj.kanji,
                    });
                }}
            >
                <div className="text-4xl font-black font-serif">{charaobj.kanji}</div>
                <div className="flex flex-col text-sm shrink-0">
                    <div>{charaobj.kun.replace(new RegExp("、.+$"), '')} {charaobj.on} {charaobj.pinyin}</div>
                    <div>{charaobj.meaning.replace(new RegExp("([^;]*;[^;]*).*"), '$1')}</div>
                </div>
            </button>

            <span className="flex gap-2 w-1/2">
                {components.map((obj, index) => (
                    <button 
                    onClick={() => {
                        dispatch({
                            type: 'search',
                            title: obj.compchar,
                            text: obj.compchar,
                        });
                    }}
                    className={`flex flex-col ${color(obj.comprole)}`} key={index}>
                        <div className="text-sm select-none">{obj.comprole} </div>
                        <div className="self-center text-3xl font-black font-serif">{obj.compchar}</div>
                    </button>
                ))}
            </span>
        </div>
    )
}

export default SearchResults