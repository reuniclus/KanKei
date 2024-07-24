import { matchSorter } from 'match-sorter'
import { useTabsDispatch } from './TabsContext.js';
//import { useEffect, useState } from "react"
const apiurl = 'https://sheet.best/api/sheets/1000dcf2-2fe7-428c-9be3-2a50656c18c0/tabs/cjkvi-ids-analysis';

export function getComponents(charaobj) {
    if (!charaobj) return []
    let components = []
    if (charaobj.tags.includes("形声")) {
        components = [{ compchar: charaobj.意, comprole: "Semantic" }, { compchar: charaobj.聲, comprole: "Phonetic" }];
    }
    else if (charaobj.tags.includes("象形")) {
        components = [{ compchar: charaobj.kanji, comprole: "Form" }];
    }
    else if (/書|偏旁置換|省略/.test(charaobj.tags)) {
        components = [{ compchar: charaobj.kanji, comprole: "Empty" }];
    }
    else {
        let idc = charaobj.idc_analysis === "" ? charaobj.idc_naive : charaobj.idc_analysis;
        idc = idc.replace(new RegExp("[⿰-⿿ ]", 'gu'), '');
        for (const symbol of idc) {
            components.push({ compchar: symbol, comprole: "Semantic" })
        }
    }
    return components
}

export function setColorClass(role) {
    var classname = "";
    switch (role) {
        case 'Semantic': classname = 'text-cyan-700 hover:text-cyan-800'; break;
        case 'Phonetic': classname = 'text-red-700 hover:text-red-800'; break;
        case 'Root phonetic': classname = 'text-red-900 hover:text-red-950'; break;
        case 'Empty': classname = 'text-purple-600 hover:text-purple-700'; break;
        case 'Form': classname = 'text-orange-400 hover:text-orange-500'; break;
        default: classname = '';
    }
    return classname
}

export function processQuery(query) {
    let finalquery = '/query?'
    let components = []

    const terms = query.split(' ');
    let tags = [];
    terms.forEach(term => {
        if (term.includes('#')) {
            tags.push(`*${term.replace('#', '')}*`)
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
            finalquery += `romaji_search=*${term}*&`
        }
        else {
            for (const symbol of term) {
                if (/\p{Script=Han}/u.test(symbol)) components.push(`*${symbol}*`)
            }
        }

    });
    ///\p{Script=Han}/u.test(symbol)

    if (tags.length > 0) finalquery += `tags=${tags.join('')}&`
    if (components.length > 0) finalquery += `components=${components.sort().join('')}&`
    //&freq_jp=__lte(2600)
    console.log(finalquery)
    return finalquery
}

export const fetchSearchResults = async (query) => {
    if (!query) return [];
    try {
        const searchResponse = await fetch(`${apiurl}${processQuery(query)}`);
        const searchResultArray = await searchResponse.json();

        const characterstolookup = [];
        const terms = query.split(' ');
        terms.forEach(term => {
            if (!term.includes('#')) {
                for (const symbol of term) {
                    if (/\p{Script=Han}/u.test(symbol)) characterstolookup.push(`${symbol}`);
                }
            }
        });

        const promises = characterstolookup.map(async (char) => {
            const response = await fetch(`${apiurl}/kanji/${char}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ${char}`);
            return response.json();
        });

        let exactMatches = await Promise.all(promises);
        exactMatches = exactMatches.map(result => result[0]);

        const concat = exactMatches.concat(searchResultArray)
        return concat;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};


export function processSearchResultArray(inputarray, querystring) {
    let output = [{ Title: '', Array: [] }]
    if (!Array.isArray(inputarray)) return output
    if (!querystring) return output

    //validate and remove duplicates
    const seenKanji = new Set();
    inputarray = inputarray.filter(item => {
        try {
            if (item === null || item.constructor !== Object) return false;
            if (seenKanji.has(item.kanji)) return false;
            seenKanji.add(item.kanji);
            return true
        } catch {
            return false;
        }
    });


    function pushobj(title, array) {
        try {
            output.push({ Title: title, Array: array })
            inputarray = inputarray.filter(a =>
                !array.map(b => b.kanji).includes(a.kanji)
            )
        } catch (error) {
            console.error(error);
            console.log('inputarray');
            console.log(inputarray);

            console.log('pushedarray');
            console.log(array);
        }
    }

        
    inputarray = inputarray.sort((a, b) => a.freq_jp - b.freq_jp);
    const matchsorted = matchSorter(inputarray, querystring, { keys: ['kanji', 'on', 'kun', '聲', 'root_phonetic_search', 'idc_analysis', 'idc_naive', 'components', 'kun_romaji', 'on_romaji', 'meaning', 'pinyin', 'jyutping', 'codepoint', 'tags'] })
    inputarray = matchsorted.concat(inputarray.filter(a => !matchsorted.map(b => b.kanji).includes(a.kanji)))


    let exactmatches = inputarray.filter(obj => querystring.includes(obj.kanji))
    pushobj('Exact match' + (querystring.length > 1 ? 'es' : ''), exactmatches)

    //const savedsettings = JSON.parse(localStorage.getItem('settings'));

    /*inputarray = inputarray.filter(obj =>
        //by default, only frequent and joyo kanji
        (obj.freq_jp <= (savedsettings?.freqthreshold || 2600)) ||
        (obj.tags.includes('常用')) ||
        (savedsettings?.include_jmy && obj.tags.includes('人名用')) ||
        (savedsettings?.include_sc && obj.freq_zh <= 8000) ||
        (savedsettings?.include_rare && obj.inclusion_all > 0) ||
        (savedsettings?.include_all)
    )*/

    if (querystring.length === 1) {
        let root_phonetic = exactmatches[0]?.root_phonetic_search || querystring;
        let phon_series = inputarray.filter(obj =>
            obj.root_phonetic_search && (
                obj.root_phonetic_search === root_phonetic ||
                obj.root_phonetic_search === querystring))
        pushobj('Characters in the same phonetic series', phon_series)

        let direct = inputarray.filter(obj => obj.idc_analysis.includes(querystring) || obj.idc_naive.includes(querystring))
        pushobj(`Characters directly using ${querystring} as a component`, direct)

        pushobj(`Characters including ${querystring} anywhere`, inputarray)
    }
    else {
        const terms = querystring.split(' ');
        let tags = [];
        let pronunciations = [];
        let components = []
        let romaji = []
        terms.forEach(term => {
            if (term.includes('#')) {
                switch (term) {
                    case '#常用': tags.push('joyo'); break;
                    case '#人名用': tags.push('jinmeiyou'); break;
                    case '#形声': tags.push('phono-semantic'); break;
                    case '#会意': tags.push('ideogrammic'); break;
                    case '#象形': tags.push('pictographic'); break;
                    case '#新字体': tags.push('shinjitai'); break;
                    case '#旧字体': tags.push('kyuujitai'); break;
                    case '#簡体': tags.push('simplified'); break;
                    default: tags.push(term);
                }
            }
            else if (/[ぁ-ゖァ-ヺāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ1-6]/.test(term)) {
                pronunciations.push(term)
            }
            else {
                for (const symbol of term) {
                    if (/\p{Script=Han}/u.test(symbol)) components.push(`${symbol}`)
                }
            }
            if (/[A-z]/.test(term)) {
                romaji.push(term)
            }
        })
        let desc = ""
        if (tags.length > 0) desc += `${tags.join(' ')} `
        desc += 'characters'
        if (pronunciations.length > 0) desc += ` pronounced ${pronunciations.join(',')}`
        if (components.length > 0) desc += ` using ${components.join(', ')} as component${components.length > 1 ? 's' : ''}`
        if (romaji.length > 0) desc += ` matching "${romaji.join(' ')}"`
        pushobj(desc, inputarray)
    }

    pushobj('Other matches', inputarray)

    return output
}


export function determineVisibility(charaobj) {
    const savedsettings = JSON.parse(localStorage.getItem('settings'));
    return (charaobj.freq_jp <= (savedsettings?.freqthreshold || 2600)) ||
        (charaobj.tags.includes('常用')) ||
        (savedsettings?.include_jmy && charaobj.tags.includes('人名用')) ||
        (savedsettings?.include_sc && charaobj.freq_zh <= 8000) ||
        (savedsettings?.include_rare && charaobj.inclusion_all > 0) ||
        (savedsettings?.include_all);
}

export function pushSearchTabSessionStorage(tab) {
    let tabs = JSON.parse(sessionStorage.getItem('tabs')) || [];
    tabs.push(tab);
    sessionStorage.setItem('tabs', JSON.stringify(tabs));
}

export function saveSearchArrayToSessionStorageTab(array, tabid) {
    let tabs = JSON.parse(sessionStorage.getItem('tabs')) || [];
    let index = tabs.findIndex((e)=> e.id === tabid);
    tabs[index].processedArray = array;
    sessionStorage.setItem('tabs', JSON.stringify(tabs));    
}



export function getTabsFromSessionStorage() {
    const tabsJson = sessionStorage.getItem('tabs');
    return tabsJson ? JSON.parse(tabsJson) : [];
};

export function pushLocalStorage(key, value) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    if (items.includes(value)) return
    if (items.length >= 9) items.shift();
    items.push(value);
    localStorage.setItem(key, JSON.stringify(items));
}

export function bookmarkLocalStorage(key, value) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    if (items.includes(value)) return
    if (items.length >= 18) items.shift();
    items.push(value);
    localStorage.setItem(key, JSON.stringify(items));
}

export function removeLocalStorage(key, value) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items = items.filter(item => item !== value)
    localStorage.setItem(key, JSON.stringify(items));
}

/*
//dont work, idk why
export const NewSearch = (text) => {
    const dispatch = useTabsDispatch().dispatch;
    dispatch({
        type: 'search',
        title: text,
        text: text,
    })
}

export const NewConsult = (text) => {
    const dispatch = useTabsDispatch().dispatch;
    dispatch({
        type: 'consult',
        title: text,
        text: text,
    })
}*/

export const Searchlink = ({ text, className }) => {
    const dispatch = useTabsDispatch().dispatch;
    return (<>
        <button
            onClick={() => {
                dispatch({
                    type: 'search',
                    title: text,
                    text: text,
                });
            }}
            className={className ? className : "text-cyan-500 underline hover:text-blue-500 cursor-pointer"}>
            {text}
        </button>
    </>)
}

export const ConsultLink = ({ text, className }) => {
    const dispatch = useTabsDispatch().dispatch;
    return (<>
        <button
            onClick={() => {
                dispatch({
                    type: 'consult',
                    title: text,
                    text: text,
                });
            }}
            className={className ? className : "text-cyan-500 underline hover:text-blue-500 cursor-pointer"}>
            {text}
        </button>
    </>)
}

export function shorten(string, more = false) {
    if (more) return string.replace(new RegExp("[、;].+$", ''), '')
    else return string.replace(new RegExp("([^、;]*[、;][^、;]*).*", 'g'), '$1')
}



export function toHalfWidth(input) {
    const fullwidthToHalfwidthMap = {
        'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
        'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ',
        'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
        'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
        'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
        'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
        'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
        'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
        'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
        'ワ': 'ﾜ', 'ヲ': 'ｦ', 'ン': 'ﾝ',
        'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
        'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ',
        'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
        'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
        'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
        'ヴ': 'ｳﾞ', '゛': 'ﾞ', '゜': 'ﾟ', '。': '｡', '、': '､', '・': '･', '「': '｢', '」': '｣', 'ー': 'ｰ',
    };

    return input.split('').map(char => fullwidthToHalfwidthMap[char] || char).join('');
}
