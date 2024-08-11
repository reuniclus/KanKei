import React, { useState, useEffect, useRef } from 'react';
import SearchBar from "./SearchBar";
import { ConsultLink, defaultsettings, Searchlink } from './utilities';


export default function Header() {
    return (
        <div className="flex flex-col shadow-xl p-2 gap-1 bg-white">
            <div className="flex justify-end gap-5 text-sm text-cyan-500 underline max-sm:hidden">
                <a>About</a>
                <a>Contribute</a>
                <a>Disclaimer</a>
            </div>

            <div className="flex gap-3 justify-center items-center">
                <HamburgerMenu />

                <div className='max-sm:hidden h-full flex gap-3 justify-end grow'>

                    {/*
                    <HeaderButton title="Components" path={<path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />} />

                    <HeaderButton title="Advanced Search" path={<path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />} />
                    */}
                </div>
                <SearchBar />


                <div className='max-sm:hidden h-full flex justify-start gap-3 grow'>


                    <History />

                    <Bookmarks />

                    <Settings />
                </div>
            </div>
        </div>
    );
}

const HamburgerMenu = () => {
    const [showHistory, setShowHistory] = useState(false);
    const dropdownRef = useRef(null);

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
        <button onClick={toggleHistory} className="bg-slate-100 rounded-lg p-2 sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-8 transition-all duration-300 ${showHistory ? 'rotate-180' : 'rotate-0'}`} >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <div ref={dropdownRef} className={`absolute top-0 ${showHistory ? 'left-0' : '-left-40'}
            transition-all shadow-lg px-1.5 py-2.5 rounded-r-lg bg-white border z-10 flex flex-col gap-2`}>
            <History />
            <Bookmarks />
            <Settings />
            <a href='http://crouton.net/' className='text-sm text-cyan-500 underline'>About</a>
            <a href='http://crouton.net/' className='text-sm text-cyan-500 underline'>Contribute</a>
            <a href='http://crouton.net/' className='text-sm text-cyan-500 underline'>Disclaimer</a>
        </div>

    </>)
}

export const HeaderButton = ({ onClick, title, path, children }) =>
    <div onClick={onClick} className="cursor-pointer relative flex flex-col items-center justify-center self-stretch self-center my-auto whitespace-nowrap text-neutral-400 hover:bg-slate-100 p-1 rounded-md max-sm:flex-row max-sm:justify-start max-sm:gap-2 h-full min-w-10 lg:min-w-14">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 max-lg:size-7">
            {path}
        </svg>
        <div className="max-lg:hidden max-sm:inline-block">{title}</div>
        {children}
    </div>;

const Dropdown = (props) => {
    const { children, ...restProps } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    const toggleDropdown = () => {
        setShowDropdown(true);
    };

    return (<>
        <HeaderButton onClick={toggleDropdown}
            {...restProps}>
            {showDropdown && (
                <div ref={dropdownRef} className="absolute top-full shadow-lg px-1.5 py-2.5 rounded-md bg-white border z-10 flex flex-col gap-1 min-w-24">
                    {props.children}
                </div>
            )}
        </HeaderButton>
    </>
    );
};


const Settings = () => {

    const [savedSettings, setSavedSettings] = useState(JSON.parse(localStorage.getItem('settings')) || defaultsettings);

    useEffect(() => {
        const handleStorage = (event) => {
            setSavedSettings(JSON.parse(localStorage.getItem('settings')) || defaultsettings);
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, []);

    // Handle checkbox change
    const handleOnChange = (event, keyname) => {
        let tempsettings = savedSettings
        tempsettings[keyname] = !tempsettings[keyname] //event.target.checked;
        localStorage.setItem('settings', JSON.stringify(tempsettings));
        window.dispatchEvent(new Event('storage'));
    };

    const setProfileBasic = () => {
        localStorage.setItem('settings', JSON.stringify({
            show_tags:false,
            show_variants:false,
        
            show_pinyin:savedSettings.show_pinyin,
            show_jyutping:savedSettings.show_jyutping,
        
            include_jmy: true,
            include_sc: savedSettings.include_sc,
            include_rare: false,
        }));
        window.dispatchEvent(new Event('storage'));
    }

    const setProfileAdvanced = () => {
        localStorage.setItem('settings', JSON.stringify({
            show_tags:true,
            show_variants:true,
        
            show_pinyin:savedSettings.show_pinyin,
            show_jyutping:savedSettings.show_jyutping,
        
            include_jmy: true,
            include_sc: savedSettings.include_sc,
            include_rare: savedSettings.include_rare,
        }));
        window.dispatchEvent(new Event('storage'));
    }



    return (<>
        <Dropdown title='Settings'
            path={<>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </>}>

            UI Profiles
            <ul className="flex w-full gap-2 px-2 md:grid-cols-2 text-wrap justify-stretch">
                <li className="w-full">
                    <input type="radio" id="display-basic" name="display" value="display-basic" className="hidden peer" required onClick={(event) => setProfileBasic()}/>
                    <label for="display-basic" className="w-full flex flex-col px-3 py-1 
                    text-lg font-semibold text-gray-500 border border-gray-200 rounded-lg cursor-pointer text-center
                    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                        Basic
                    </label>
                </li>
                <li className="w-full">
                    <input type="radio" id="display-advanced" name="display" value="display-advanced" className="hidden peer" 
                    onClick={(event) => setProfileAdvanced()}/>
                    <label for="display-advanced" className="flex flex-col px-3 py-1
                    text-gray-500 border border-gray-200 rounded-lg cursor-pointer text-lg font-semibold text-center
                    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                        Advanced
                    </label>
                </li>
            </ul>
            Data Display
            <Toggle text={'Show tags'} onChange={(event) => handleOnChange(event, 'show_tags')} checked={savedSettings?.show_tags } />

            <Toggle text={'Show variants'} onChange={(event) => handleOnChange(event, 'show_variants')} checked={savedSettings?.show_variants} />

            Language Settings
            <Toggle text={'Enable Mandarin'} onChange={(event) => handleOnChange(event, 'show_pinyin')} checked={savedSettings?.show_pinyin} />

            <Toggle text={'Enable Cantonese'} onChange={(event) => handleOnChange(event, 'show_jyutping')} checked={savedSettings?.show_jyutping} />


            Filtering settings
            <Toggle text={'Include Jinmeiyou kanji'} onChange={(event) => handleOnChange(event, 'include_jmy')} checked={savedSettings?.include_jmy} />

            <Toggle text={'Include Chinese hanzi'} onChange={(event) => handleOnChange(event, 'include_sc')} checked={savedSettings?.include_sc} />

            <Toggle text={'Include obscure characters'} onChange={(event) => handleOnChange(event, 'include_rare')} checked={savedSettings?.include_rare} />

        </Dropdown>
    </>
    );
};


const Toggle = ({ text, checked, onChange }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={onChange} />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">{text}</span>
        </label>
    )
}

const History = () => {
    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
    const [consultHistory, setConsultHistory] = useState(JSON.parse(localStorage.getItem('consultHistory')) || []);

    useEffect(() => {
        const handleStorage = (event) => {
            const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
            const storedConsultHistory = JSON.parse(localStorage.getItem('consultHistory')) || [];
            setSearchHistory(storedSearchHistory);
            setConsultHistory(storedConsultHistory);
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, []);

    return (<>
        <Dropdown title='History' path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}        >
            <h2>Search History</h2>
            {searchHistory.map((search, index) => (
                <Searchlink key={index} text={search} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"} />
            ))}
            <h2>Consult History</h2>
            {consultHistory.map((item, index) => (
                <ConsultLink key={index} text={item} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"} />
            ))}
        </Dropdown>
    </>
    );
};

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);

    useEffect(() => {
        const handleStorage = (event) => {
            const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            setBookmarks(storedBookmarks);
        }
        window.addEventListener('storage', handleStorage)
        return () => { window.removeEventListener('storage', handleStorage) }
    }, []);

    return (<>
        <Dropdown title="Bookmarks" path={<path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />}>
            {bookmarks.map((e, index) => (
                <ConsultLink key={index} text={e} className={"text-gray-600 hover:text-cyan-500 hover:bg-slate-100 rounded"} />
            ))}
        </Dropdown>
    </>
    );
};