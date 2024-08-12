import { useState, useEffect } from 'react';
import { useTabs, useTabsDispatch } from './TabsContext.js';


export default function TabList() {
  const tabs = useTabs().tabs;
  const dispatch = useTabsDispatch().dispatch;
  const [activeTab, setActiveTab] = useState(useTabs().activeTab.activeTab);

  const { idcounter } = useTabs().activeTab;

  useEffect(() => {
    setActiveTab(tabs.length - 1)
  }, [tabs.length, idcounter])

  return (
    <>
      <div className='flex flex-wrap gap-1'>
        {tabs.map((tab, index) => (
          <label key={index}
            className={`${index === activeTab && "bg-white hover:bg-white text-black"} bg-slate-100 hover:bg-slate-50 text-gray-500 hover:text-gray-700 
            border border-b-transparent rounded-t-lg font-medium text-sm cursor-pointer
            text-center flex h-10`}
          >
            <button className="min-w-14 pl-2 pr-1" onClick={() => { setActiveTab(index) }}>
              {tab.title}
            </button>
            <button className='text-lg pl-1 pr-2 hover:text-red-500'
              onClick={() => {
                let curtab = activeTab
                dispatch({
                  type: 'deleted',
                  id: tab.id
                });
                let targetTab = curtab === index ? curtab - 1 : curtab;
                targetTab = targetTab < 0 ? targetTab + 1 : targetTab;
                setActiveTab(targetTab);
              }}>
              ⨯
            </button>
          </label>
        ))}
      </div>


      <div className="shadow-xl border w-full min-h-0 overflow-hidden rounded-lg rounded-tl-none bg-white h-full flex justify-stretch
      lg:p-6 lg:pb-0" >
        {tabs.map((tab, index) => (
          <div className={`w-full flex flex-col overflow-y-auto ${index === activeTab ? '' : 'hidden'}`} key={index}>
            {tab.text}
          </div>
        ))}
      </div>
    </>
  );
}