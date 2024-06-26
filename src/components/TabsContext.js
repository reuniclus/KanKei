import { createContext, useContext, useReducer, useState } from 'react';
import SearchResults from './searchresults';
import DictEntry from './dictentry';

const TabsContext = createContext(null);
const TabsDispatchContext = createContext(null);

export function TabsProvider({ children }) {
  const [tabs, dispatch] = useReducer(
    tabsReducer,
    initialTabs
  );

  const activeTab = activeTabData;

  //const [activeTab, setActiveTab] = useState(activeTabData);

  return (
    <TabsContext.Provider value={{tabs,activeTab}}>
      <TabsDispatchContext.Provider value={{dispatch}}>
        {children}
      </TabsDispatchContext.Provider>
    </TabsContext.Provider>
  );
}

export function useTabs() {
  return useContext(TabsContext);
}

export function useTabsDispatch() {
  return useContext(TabsDispatchContext);
}

function tabsReducer(tabs, action) {
  switch (action.type) {
    case 'search': {
      return [...tabs, {
        id: activeTabData.idcounter++,
        title: `Search - ${action.title}`,
        text: <SearchResults query={action.text}/>,
      }];
    }
    case 'consult': {
      return [...tabs, {
        id: activeTabData.idcounter++,
        title: action.title,
        text: <DictEntry kanji={action.text}/>,
      }];
    }
    case 'deleted': {
      return tabs.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTabs = [
  { id: 0, text: 'Busca algo en la barra de búsqueda', title: '🙂' }
];

const activeTabData = {
  activeTab: 0,
  idcounter: 0
}
