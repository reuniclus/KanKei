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
        <div>
            <HeaderButton onClick={toggleHistory} title="History" img="https://cdn.builder.io/api/v1/image/assets/TEMP/4bc70949dbf3f0f7f88a8527c3f78dbb5929fb598ce91c308f604f984fc96f68?" />

            {showHistory && (
                <div ref={dropdownRef} className="absolute shadow-md p-2.5 rounded-md bg-white border z-10">
                    <h2>Search History</h2>
                    <ul>
                        {searchHistory.map((search, index) => (
                            <li key={index}><Searchlink text={search}/></li>
                        ))}
                    </ul>

                    <h2>Consult History</h2>
                    <ul>
                        {consultHistory.map((item, index) => (
                            <li key={index}><ConsultLink text={item}/></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </>
    );
};

export default History;