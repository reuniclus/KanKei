import { useEffect, useState } from "react"
import {matchSorter} from 'match-sorter'

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
        let idc = charaobj.idc_analysis == "" ? charaobj.idc_naive : charaobj.idc_analysis;
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
                components.push(`*${symbol}*`)
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


export function Search(query) {

    const [searchresults, setSearchResults] = useState([]);
    const [extraresults, setExtraResults] = useState([]);
    const [kanjiobj, setKanjiobj] = useState();

    useEffect(() => {
        fetch(`${apiurl}${processQuery(query)}&freq_jp=__lte(2600)`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setSearchResults = data;
            })
            .catch(error => { console.log(error) })
    }, [])
    return searchresults
}


export function processSearchResultArray(inputarray = [], querystring = '') {
    inputarray = inputarray.sort((a, b) => a.freq_jp - b.freq_jp);
    if(querystring.length>1) inputarray = matchSorter(inputarray, querystring, {keys: ['meaning', 'romaji_search']})

    let output = []
    function pushobj(title, array) {
        output.push({ Title: title, Array: array })
        inputarray = inputarray.filter(a => !array.map(b => b.kanji).includes(a.kanji))
    }


    let exactmatches = inputarray.filter(obj => querystring.includes(obj.kanji))
    pushobj('Exatch match' + (querystring.length > 1 ? 'es' : ''), exactmatches)

    inputarray = inputarray.filter(obj => obj.freq_jp <= 2600)

    if (querystring.length == 1) {
        let phon_series = inputarray.filter(obj =>
            obj.root_phonetic_search == querystring ||
                exactmatches[0] ? obj.root_phonetic_search == exactmatches[0].root_phonetic_search : false)
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
                switch(term) {
                    case '#常用': tags.push('joyo'); break;
                    case '#人名用': tags.push('jinmeiyou'); break;
                    case '#形声': tags.push('phono-semantic'); break;
                    case '#会意': tags.push('ideogrammic'); break;
                    case '#象形': tags.push('pictographic'); break;
                    case '#新字体': tags.push('shinjitai'); break;
                    case '#旧字体': tags.push('kyuujitai'); break;
                    case '#簡体': tags.push('simplified'); break;
                }
            }
            else if(/[ぁ-ゖァ-ヺāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ1-6]/.test(term)){
                pronunciations.push(term)
            }
            else {
                for (const symbol of term) {
                    if(/\p{Script=Han}/u.test(symbol)) components.push(`${symbol}`)
                }
            }
            if (/[A-z]/.test(term)) {
                romaji.push(term)
            }
        })
        let desc = ""
        if(tags.length>0) desc+=`${tags.join(' ')} `
        desc+='characters'
        if(pronunciations.length>0) desc+=` pronounced ${pronunciations.join(',')}`
        if(components.length>0) desc+=` using ${components.join(', ')} as component${components.length>1?'s':''}`
        if(romaji.length>0) desc+=` matching "${romaji.join(' ')}"`
        pushobj(desc, inputarray)
    }

    pushobj('Other matches', inputarray)
    return output
    }
