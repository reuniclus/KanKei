import React, { useState, useEffect, useRef } from 'react';
import { HeaderButton } from './header';
import { ConsultLink, Searchlink } from './utilities';

const History = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [consultHistory, setConsultHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const storedConsultHistory = JSON.parse(localStorage.getItem('consultHistory')) || [];
        setSearchHistory(storedSearchHistory);
        setConsultHistory(storedConsultHistory);
    }, [!showHistory]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowHistory(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    return (<>
        <HeaderButton onClick={toggleHistory} title={<>History {showHistory && (
            <div ref={dropdownRef} className="absolute shadow-lg px-1.5 py-2.5 rounded-md bg-white border z-10 flex flex-col gap-1 min-w-24">
                <h2>Search History</h2>
                {searchHistory.map((search, index) => (
                    <Searchlink key={index} text={search} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"} />
                ))}
                <h2>Consult History</h2>
                {consultHistory.map((item, index) => (
                <ConsultLink key={index} text={item} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"}/>
                ))}
            </div>
        )}</>} path={<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />} />


    </>
    );
};

export default History;