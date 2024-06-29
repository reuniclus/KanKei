import { useEffect, useState, useContext } from "react"

import DictEntry from './dictentry';
import SearchResults from './searchresults';

export default function Tabber(query) {


    const [activeTab, setActiveTab] = useState(0);
    const [tabContentArray, setTabContentArray] = useState([
        { id:0 , title: "某", content: <DictEntry kanji="某" /> }
    ]);

    const [tabid, setTabid] = useState(1);
/*
    useEffect(() => {
        let thissearch = query.query;
        if (thissearch == "") { return }
        setTabContentArray(tabContentArray => [...tabContentArray, {
            id: tabid,
            title: `Search - ${thissearch}`,
            content: <SearchResults query={thissearch} />
        }]
        );
        setTabid(tabid+1);
        console.log('search tab created')
    }, [query])

    useEffect(() => {
        let thissearch = query.query;
        if (thissearch == "") { return }
        setTabContentArray(tabContentArray => [...tabContentArray, {
            id: tabid,
            title: `Search - ${thissearch}`,
            content: <DictEntry kanji={childValue} />
        }]);
        setTabid(tabid+1);
        console.log('dict tab created')
    }, [childValue])
    */
    /*
    const DeleteTab = (index) => {
       setActiveTab(activeTab-1);
       setTabid(tabid-1);
       setTabContentArray(tabContentArray.filter(i => i.id != index))
       console.log('Tab Deleted')
    }

    const CreateTab = () => {
        setTabContentArray(tabContentArray => [...tabContentArray, {
            id: tabid,
            title: `Search`,
            content: <p>pee</p>
        }])
        setTabid(tabid+1);
        console.log('Tab created')
     }
*/

    console.log(tabContentArray)

    return (
        <>

            <button onClick={CreateTab()}>
                create
            </button>

            <div className="grid grid-cols-1 max-w-7xl my-7 mx-auto">
            {sharedObject.text}
                <div className="flex gap-2">

                    {tabContentArray.map((item, index) => (<>
                        <div>
                            <div onClick={() => setActiveTab(index)} className={`${index === activeTab && "bg-white text-black"} cursor-pointer bg-slate-100 border-b-transparent text-blue-600 -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 disabled:opacity-50 disabled:pointer-events-none`} id="card-type-tab-item-1" data-hs-tab="#card-type-tab-preview" aria-controls="card-type-tab-preview" role="tab" key={index}>
                                {item.title}
                                <button onClick={DeleteTab(index)} type="button" className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-red-500">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            


                        </div>
                    </>))}
                </div>

                <div className="flex flex-col justify-center px-4 py-7 border border-gray-200 rounded-lg rounded-tl-none shadow-xl h-full">
                {console.log(tabContentArray)}
                       {//tabContentArray[activeTab].content
                       }
                </div>
            </div>
        </>
    );
}