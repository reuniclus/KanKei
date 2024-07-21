import { useContext, useState, useEffect } from 'react';
import { useTabs, useTabsDispatch } from './TabsContext.js';


export default function TabList() {
  const tabs = useTabs().tabs;
  //const [activeTab, setActiveTab] = useState(0);
  const dispatch = useTabsDispatch().dispatch;
  const [activeTab, setActiveTab] = useState(useTabs().activeTab.activeTab);


  useEffect(() => {
    setActiveTab(tabs.length-1)
    console.log(`activeTab set to ${tabs.length-1}`)
  }, [useTabs().activeTab.idcounter])

  return (
    <>
      <ul>
        {tabs.map((tab, index) => (
          <li key={index}
          className={`${index === activeTab && "bg-white hover:bg-white text-black"} bg-slate-100 hover:bg-slate-50 text-gray-500 hover:text-gray-700 text-sm font-medium text-center border border-b-transparent inline-flex rounded-t-lg cursor-pointer`} 
          >
            <label>
              <button onClick={() => {setActiveTab(index)}}
              className="h-full pl-3 py-3"
              >
                {tab.title}
              </button>
              <button onClick={() => {
                let curtab = activeTab
                dispatch({
                  type: 'deleted',
                  id: tab.id
                });
                let targetTab = curtab == index ? curtab-1 : curtab;
                targetTab = targetTab < 0 ? targetTab+1 : targetTab;
                setActiveTab(targetTab);
              }}
              className='h-full px-3 py-3" hover:text-red-500'>
                🞫
              </button>
            </label>
          </li>
        ))}
      </ul>

      
      <div className="shadow-xl border bg-white p-6 grow min-h-0 overflow-auto rounded-lg rounded-tl-none">
      {tabs.map((tab, index) => ( 
          index == activeTab ? <>
            {tab.text}
          </> : <></>    
      ))}
      </div>
    </>
  );
}