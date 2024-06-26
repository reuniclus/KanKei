import { useState, createContext, useContext } from "react";
import SearchResults from "./searchresults.jsx";
import Header from "./header";
import Tabber from "./tabber";
import { ContextProvider } from './globalProvider';

import AddTab from './AddTab.js';
import TabList from './TabList.js';
import { TabsProvider } from './TabsContext.js';

export default function App({ children }) {
  return (
    <>
      <TabsProvider>
        <h1>Day off in Kyoto</h1>
        <AddTab />
        <TabList />
      </TabsProvider>
    </>
  );
}

/*
        <ContextProvider>
      <Header/>
      <Tabber/>
      </ContextProvider>
       <ContextProvider>
      <Header onSubmit={(value) => setMyValue(value)} />
      <Tabber query={myValue} />
      </ContextProvider>
*/

//<SearchResults query={myValue} />

/*


export default function TabApp() {
  return (
    <TabsProvider>
      <h1>Day off in Kyoto</h1>
      <AddTab />
      <TabList />
    </TabsProvider>
  );
}
*/