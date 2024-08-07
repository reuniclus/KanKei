import { matchSorter } from 'match-sorter'
import { useEffect, useState } from "react"
import { useTabsDispatch } from './TabsContext.js';

export function getComponents(charaobj) {
    if (!charaobj) return []
    let components = []

    function pushComponent(cell, role) {
        if (!cell) return
        for (const char of cell) {
            let component = {
                compRole: role,
                compChar: char,
            }
            components.push(component)
        }
    }

    pushComponent(charaobj.semantic, 'semantic')
    pushComponent(charaobj.phonetic, 'phonetic')
    pushComponent(charaobj.form, 'form')
    pushComponent(charaobj.empty, 'empty')
    //pushComponent(charaobj.root_phonetic, 'root_phonetic')    
    return components
}

export function setColorClass(role) {
    var classname = "";
    switch (role.replace(/[^A-Za-z]/g, "").toLowerCase()) {
        case 'semantic': classname = 'text-cyan-700 hover:text-cyan-800'; break;
        case 'phonetic': classname = 'text-red-700 hover:text-red-800'; break;
        case 'rootphonetic': classname = 'text-red-900 hover:text-red-950'; break;
        case 'empty': classname = 'text-purple-600 hover:text-purple-700'; break;
        case 'form': classname = 'text-orange-400 hover:text-orange-500'; break;
        default: classname = '';
    }
    return classname
}

export function setColor(role, hover=false) {
    var classname = "";
    switch (role.replace(/[^A-Za-z]/g, "").toLowerCase()) {
        case 'semantic': classname = hover ? 'cyan-800' : 'cyan-700'; break;
        case 'phonetic': classname = hover ? 'red-700' : 'red-800'; break;
        case 'rootphonetic': classname = hover ? 'red-900' : 'red-950'; break;
        case 'empty': classname = hover ? 'purple-600' : 'purple-700'; break;
        case 'form': classname = hover ? 'orange-400' : 'orange-500'; break;
        default: classname = '';
    }
    return classname
}


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
        if (array.length < 1) return

        output.push({ Title: title, Array: array })
        inputarray = inputarray.filter(a =>
            !array.map(b => b.kanji).includes(a.kanji)
        )
    }


    inputarray = inputarray.sort((a, b) => a.freq_jp - b.freq_jp);
    const matchsorted = matchSorter(inputarray, querystring, { keys: ['kanji', 'on', 'kun', 'phonetic', 'root_phonetic', 'idc_analysis', 'idc_naive', 'components', 'kun_romaji', 'on_romaji', 'meaning', 'pinyin', 'jyutping', 'codepoint', 'tags'] })
    inputarray = matchsorted.concat(inputarray.filter(a => !matchsorted.map(b => b.kanji).includes(a.kanji)))


    let exactmatches = inputarray.filter(obj => querystring.includes(obj.kanji))
    pushobj('Exact match' + (querystring.length > 1 ? 'es' : ''), exactmatches)

    if ([...querystring].length === 1) {
        let root_phonetic = exactmatches[0]?.root_phonetic_search || querystring;
        let phon_series = inputarray.filter(obj =>
            obj.root_phonetic && (
                obj.root_phonetic === root_phonetic ||
                obj.root_phonetic === querystring))
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

export function checkSettings(settingName) {
    const savedsettings = JSON.parse(localStorage.getItem('settings'));
    return savedsettings?.[settingName] || false;
}


export function determineVisibility(charaobj) {
    const savedsettings = JSON.parse(localStorage.getItem('settings'));
    return (charaobj.freq_jp <= (savedsettings?.freqthreshold || 2600)) ||
        (charaobj.tags.includes('常用')) ||
        (savedsettings?.include_jmy && charaobj.tags.includes('人名用')) ||
        (savedsettings?.include_sc && charaobj.freq_zh <= 8000) ||
        (savedsettings?.include_rare)
}

export function pushSearchTabSessionStorage(tab) {
    let tabs = JSON.parse(sessionStorage.getItem('tabs')) || [];
    tabs.push(tab);
    sessionStorage.setItem('tabs', JSON.stringify(tabs));
}

export function saveSearchArrayToSessionStorageTab(array, tabid) {
    let tabs = JSON.parse(sessionStorage.getItem('tabs')) || [];
    let index = tabs.findIndex((e) => e.id === tabid);
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
    window.dispatchEvent(new Event('storage'));
}

export function bookmarkLocalStorage(key, value) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    if (items.includes(value)) return
    if (items.length >= 18) items.shift();
    items.push(value);
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
}

export function removeLocalStorage(key, value) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items = items.filter(item => item !== value)
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
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

export const defaultsettings = {
    show_tags:false,
    show_variants:false,

    show_pinyin:true,
    show_jyutping:false,

    include_jmy: true,
    include_sc: false,
    include_rare: false,
}

export const Searchlink = ({ text, className, children }) => {
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
            {!children && text}
            {children}
        </button>
    </>)
}

export const ConsultLink = ({ text, className, children }) => {
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
            {!children && text}
            {children}
        </button>
    </>)
}

export function mergeAndRemoveDuplicates(array1, array2) {
    const combinedArray = [...array1, ...array2];
    const uniqueObjectsMap = new Map();

    combinedArray.forEach(item => {
        uniqueObjectsMap.set(item.kanji, item);
    });

    return Array.from(uniqueObjectsMap.values());
}


export const TimeCounter = () => {
    const [time, setTime] = useState({ seconds: 0, deciseconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => {
                const newDeciseconds = prevTime.deciseconds + 1;
                const newSeconds = prevTime.seconds + Math.floor(newDeciseconds / 10);
                return {
                    seconds: newSeconds,
                    deciseconds: newDeciseconds % 10
                };
            });
        }, 100);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <span>
            {time.seconds}.{time.deciseconds}s
        </span>
    );
};