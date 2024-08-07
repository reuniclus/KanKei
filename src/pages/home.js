import React from "react";
import Header from '../components/header.jsx';
import { TabsProvider } from "../components/TabsContext.js";
import TabList from "../components/TabList.js";

const Home = () =>
    <>
        <TabsProvider>
            <div className="flex flex-col h-dvh">
                <Header />

                <div className="flex flex-col self-center min-h-0 h-full 
        w-full md:p-8 max-w-[95rem]">
                    <TabList />
                </div>

            </div>
        </TabsProvider>
    </>


export default Home;