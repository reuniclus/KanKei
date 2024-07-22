import React, { useState, useEffect, useRef } from 'react';
import { HeaderButton } from './header';
import { ConsultLink } from './TabsContext';

export default function Bookmarks () {
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
        <div>
            <HeaderButton onClick={toggleBookmarks} title="Bookmarks" img="https://cdn.builder.io/api/v1/image/assets/TEMP/f9633a0224896cf1ccdfb96c4bd924a2d6761464c5f181e5b769db5635ff20bf?"/>

            {showBookmarks && (
                <div ref={dropdownRef} className="absolute shadow-md p-2.5 rounded-md bg-white border z-10">
                    <ul>
                        {bookmarks.map((e, index) => (
                            <li key={index}><ConsultLink text={e}/></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </>
    );
};
