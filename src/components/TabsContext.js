import { createContext, useContext, useReducer, useState } from 'react';
import SearchResults from './searchresults';
import DictEntry from './dictentry';

const TabsContext = createContext(null);
const TabsDispatchContext = createContext(null);

export function TabsProvider({ children }) {

  initialTabs[0].text = <>
  <p>KanKei is a Kanji/Hanzi lookup tool focused on the breaking down Kanji into components and displaying the etymological relationships between multiple kanji.</p>
  <p>The purpose of component-based kanji learning is to help learners create mental connections between kanji to make them intuitive to learn without rote memorization.</p>
  <p>Similar resources already exist, such as <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://hanzicraft.com/`}>HanziCraft</a> and <a className="text-cyan-500 underline hover:text-blue-500" target="_blank" href={`https://zi.tools`}>zi.tools</a>, however those are more targetted towards Chinese learning. This site is more focused towards Japanese Kanji, although it still displays data for Mandarin or Cantonese.</p>

  <p>To search for a Kanji, you can enter any combination of kanji, components,  pronunciations, or meanings. For example:</p>
  <ul><li>English search: <Searchlink text="house"/></li>
    <li>Component search: <Searchlink text="釆田羽"/> </li>
    <li>Kanji search: <Searchlink text="門"/> </li>
    <li>Tag search: <Searchlink text="#常用"/> </li>
    <li>Combined search: <Searchlink text="#常用 各 ラク"/>   (joyo kanji that include 各 and are pronounced raku)  </li>
  </ul>
</>;

  const [tabs, dispatch] = useReducer(
    tabsReducer,
    initialTabs
  );

  const activeTab = activeTabData;

  return (
    <TabsContext.Provider value={{ tabs, activeTab }}>
      <TabsDispatchContext.Provider value={{ dispatch }}>
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
        text: <SearchResults query={action.text} />,
      }];
    }
    case 'consult': {
      return [...tabs, {
        id: activeTabData.idcounter++,
        title: action.title,
        text: <DictEntry kanji={action.text} />,
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
  {
    id: 0, text: <></>, title: '🙂'
  }
];


const Searchlink = ({ text }) => {
  const dispatch = useTabsDispatch().dispatch;
  return (<>
    <a
      onClick={() => {
        dispatch({
          type: 'search',
          title: text,
          text: text,
        });
      }}
      className="text-cyan-500 underline hover:text-blue-500 cursor-pointer">
      {text}
    </a>
  </>)
}

const activeTabData = {
  activeTab: 0,
  idcounter: 0
}
