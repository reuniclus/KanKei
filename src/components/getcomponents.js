export default function getComponents(charaobj) {
    let components = []
    if (charaobj.tags.includes("形聲")) {
        components = [{ compchar: charaobj.意, comprole: "Semantic" }, { compchar: charaobj.聲, comprole: "Phonetic" }];
    }
    else if (charaobj.tags.includes("象形")) {
        components = [{ compchar: charaobj.kanji, comprole:"Form" }];
    }
    else if (/書|偏旁置換|省略/.test(charaobj.tags)) {
        components = [{ compchar: charaobj.kanji, comprole:"Empty" }];
    }
    else {
        let idc = charaobj.idc_analysis == "" ? charaobj.idc_naive : charaobj.idc_analysis;
        idc = idc.replace(new RegExp("[⿰-⿿ ]",'gu'), '');
        console.log(idc)
        
        for (const symbol of idc) {
            components.push({compchar:symbol,comprole:"Semantic"})
        }
        /*
        for (let i = 0; i < idc.length; i++) {
            console.log(idc.codePointAt((i)))
            components.push({ compchar: idc.charAt(i), comprole: "Semantic" });
        }*/
    }
    console.log(components)
    return components
}