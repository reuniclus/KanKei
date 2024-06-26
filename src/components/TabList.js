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
      {console.log(useTabs().activeTab)}
      <ul>
        {tabs.map((tab, index) => (
          <li key={index}>
            <label>
              <button onClick={() => {
                setActiveTab(index)
              }}>
                {tab.title} id {tab.id} index {index} active {activeTab}
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
              }}>
                Delete
              </button>
            </label>
          </li>
        ))}
      </ul>

      {tabs.map((tab, index) => (
        <div key={index}>
          {index == activeTab ? <>
            {tab.text}
          </> : <></>}
        </div>
      ))}
    </>
  );
}

/*
function Tab({ tab }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTabsDispatch();
  let tabContent = tab.text;
  let tabTitle = tab.title;

  return (
    <label>
      {console.log(tab)}
      {tab.title}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: tab.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}*/
