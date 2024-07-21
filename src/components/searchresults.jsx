import { useEffect, useState, useContext } from "react"
import { useTabs, useTabsDispatch } from './TabsContext.js';
import getComponents from "./getcomponents.js";

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

function Search(query) {
    console.log(query);
    const terms = query.split(' ');
    console.log(terms);

    let finalquery = '/query?'
    let components = []

    terms.forEach(term => {
        if (term.includes('#')) {
            finalquery += `tags=*${term.replace('#', '')}*&`
        }
        else if (/[ぁ-ゖ]/.test(term)) {
            finalquery += `kun=*${term}*&`
        }
        else if (/[ァ-ヺ]/.test(term)) {
            finalquery += `on=*${term}*&`
        }
        else if (/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(term)) {
            finalquery += `pinyin=*${term}*&`
        }
        else if (/[1-6]/.test(term)) {
            finalquery += `jyutping=*${term}*&`
        }
        else if (/[A-z]/.test(term)) {
            finalquery += `meaning=*${term}*&`
        }
        else {
            for (const symbol of term) {
                components.push(`*${symbol}*`)
            }
        }
    });



    if (components.length > 0) finalquery += `components=${components.sort().join('')}&`
    console.log(finalquery)
    return finalquery;
}

function SearchResults(query) {
    let quer = query.query;
    console.log(quer)
    console.log(Search(quer))
    const dispatch = useTabsDispatch().dispatch;
    const activeTab = useTabs().activeTab;

    const [kanjiobj, setKanjiobj] = useState();
    const variants = kanjiobj ? kanjiobj.variants ? kanjiobj.variants.split(',') : [] : [];
    const [searchresults, setSearchResults] = useState([]);
    const [extraresults, setExtraResults] = useState([]);

    //component query
    useEffect(() => {
        if (quer) {
            fetch(`${apiurl}${Search(quer)}&freq_jp=__lte(2600)`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    let kanji = data.find(obj => quer == obj.kanji)
                    data = data.filter(obj => quer != obj.kanji)
                    setKanjiobj(kanji)
                    if (!kanji && quer.length == 1) {
                        fetch(`${apiurl}/kanji/${quer}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data[0]);
                                setKanjiobj(data[0]);
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }

                    let firsthalf = data.filter(obj => obj.idc_naive.includes(quer) || obj.idc_analysis.includes(quer)).sort((a, b) => a.kanji.localeCompare(b.kanji));
                    let secondhalf = data.filter(obj => !(obj.idc_naive.includes(quer) || obj.idc_analysis.includes(quer))).sort((a, b) => a.kanji.localeCompare(b.kanji));
                    /*if (firsthalf.length == 0 && !quer.includes(" ")) {
                        for (const symbol of quer) {
                            if (/\p{Script=Han}/u.test(symbol)) {
                                fetch(`${apiurl}/kanji/${symbol}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data[0]);
                                        firsthalf.push(data[0])
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }                            
                        }
                    }*/
                    setSearchResults(firsthalf)
                    setExtraResults(secondhalf)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [])

    let desc = `Characters with ${quer} anywhere`

    if (quer.includes('#')) {
        desc = `Characters tagged ${quer}`
    }
    else if (/[ぁ-ゖ]/.test(quer)) {
        desc = `Characters with kun yomi ${quer}`
    }
    else if (/[ァ-ヺ]/.test(quer)) {
        desc = `Characters with on yomi ${quer}`
    }
    else if (/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(quer)) {
        desc = `Characters with pinyin ${quer}`
    }
    else if (/[1-6]/.test(quer)) {
        desc = `Characters with jyutping ${quer}`
    }
    else if (/[A-z]/.test(quer)) {
        desc = `Characters with meaning ${quer}`
    }
    else if (quer.length > 1) {
        desc = `Characters with components ${quer}`
    }
    if (quer.includes(' ')) {
        desc = `Characters matching ${quer}`
    }


    if (!query) { return }
    return (
        <>
            <div className="flex flex-col gap-3 items-start">
                {kanjiobj ? <>
                    <SearchResult charaobj={kanjiobj} />

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
                    :
                    quer.length == 1 ? <>Kanji {quer} not found</> : <></>
                }



                {searchresults.length > 0 ? <>
                    <SearchSubtitle text={`Characters directly including ${quer}`} />
                    {searchresults.map((obj, index) => (
                        <SearchResult charaobj={obj} key={index} />
                    ))}</> : <></>}

                {extraresults.length > 0 ? <>
                    <SearchSubtitle text={desc} />
                    {extraresults.map((obj, index) => (
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
                        className={`rounded-lg p-2 hover:bg-slate-200 flex flex-col ${color(obj.comprole)}`} key={index}>
                        <div className="text-sm select-none">{obj.comprole} </div>
                        <div className="self-center text-3xl font-black font-serif">{obj.compchar}</div>
                    </button>
                ))}
            </span>
        </div>
    )
}

export default SearchResults