import React, { useState, useEffect, useRef } from 'react';
import { HeaderButton } from './header';
import { ConsultLink } from './utilities';

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setBookmarks(storedBookmarks);
    }, [showBookmarks]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowBookmarks(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleBookmarks = () => {
        setShowBookmarks(!showBookmarks);
    };

    return (<>
        <HeaderButton onClick={toggleBookmarks} title={<>Bookmarks {showBookmarks && (
            <div ref={dropdownRef} className="absolute shadow-lg px-1.5 py-2.5 rounded-md bg-white border z-10 flex flex-col gap-1 min-w-24">
                
                    {bookmarks.map((e, index) => (
                        <ConsultLink key={index} text={e} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"}/>
                    ))}
                
            </div>
        )}</>} path={<path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />} />

        
    </>
    );
};
