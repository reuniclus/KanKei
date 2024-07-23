import { useState, createContext, useContext } from "react";
import SearchResults from "./searchresults.jsx";


import SearchBar from './SearchBar.js';
import TabList from './TabList.js';
import { TabsProvider } from './TabsContext.js';

export default function App({ children }) {
  return (
    <>
      <TabsProvider>
        <div className="flex flex-col h-dvh ">

        <div className="flex flex-col justify-center py-3 px-6 shadow-xl">
          <div className="flex justify-end  gap-5 text-sm text-cyan-500">
            <div className="underline">About</div>
            <div className="underline">Contribute</div>
            <div className="underline">Disclaimer</div>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-5 justify-between items-center max-md:flex-wrap">
              <SearchBar />
            </div>
          </div>
        </div>
 
        <div className="flex flex-col p-8 max-w-7xl self-center h-full min-h-0 ">
        <TabList/>
        </div>

        </div>
      </TabsProvider>
    </>
  );
}