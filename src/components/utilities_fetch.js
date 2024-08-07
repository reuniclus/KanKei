const apiurl = 'https://script.google.com/macros/s/AKfycbwFJt2fr7D80frXd9mSD1sI1rZlktJVcjJYIWzqtCcfZVZQHfH4ZeRVFdtpAEdQWASfJw/exec?'

export const fetchKanjiObject = async (kanji) => {
    try {
        const searchResponse = await fetch(`${apiurl}&consult=${kanji}&action=getData`);
        const searchResultArray = await searchResponse.json();
        return searchResultArray;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return null;
    }
}

export const fetchSearchResults = async (queryString) => {
    queryString = processQuery(queryString)
    console.log(queryString)
    try {
        const searchResponse = await fetch(`${apiurl}${queryString}&action=getData`);
        const searchResultArray = await searchResponse.json();
        return searchResultArray;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}


function parseTerms(queryString) {
    let queryObject = {
        'search': [],
        'kanji': [],
        'kun': [],
        'on': [],
        'tags': [],
        'components': []
    }

    const terms = queryString.split(' ');
    terms.forEach(term => {
        if (term.includes('#')) {
            queryObject.tags.push(term.replace(/#/, ''));
        }
        else if (/[ぁ-ゖ]/.test(term)) {
            queryObject.kun.push(term);
        }
        else if (/[ァ-ヺ]/.test(term)) {
            queryObject.on.push(term);
        }
        else if (/\p{Script=Han}/u.test(term)) {
            for (const symbol of term) {
                if (/\p{Script=Han}/u.test(symbol)) queryObject.kanji.push(symbol);
                if (/\p{Script=Han}/u.test(symbol)) queryObject.components.push(symbol)
            }
        }
        else {
            queryObject.search.push(term)
        }
    })

    for (let key in queryObject) {
        if (queryObject[key].length < 1) delete queryObject[key]
    }

    return queryObject
}


function processQuery(queryString) {
    let queryObject = parseTerms(queryString);
    let terms = []

    for (const key in queryObject) {
        if (!Array.isArray(queryObject[key])) continue
        queryObject[key].forEach(value => {
            terms.push(`${key}=${value}`)
        }
        )
    }
    return terms.join('&')
}