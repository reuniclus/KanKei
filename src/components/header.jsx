import React, { useState, useEffect, useRef } from 'react';
import SearchBar from "./SearchBar";
import History from "./history";
import Bookmarks from "./bookmarks";
import Settings from './settings';


export const HeaderButton = ({ onClick, title, path }) =>
    <button onClick={onClick} class="flex flex-col items-center justify-center self-stretch self-center my-auto whitespace-nowrap text-neutral-400 hover:bg-slate-100 p-1 rounded-md max-sm:flex-row max-sm:justify-start max-sm:gap-2 h-full min-w-10 lg:min-w-14">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 max-lg:size-7">
            {path}
            <path stroke-linecap="round" stroke-linejoin="round" d={path} />
        </svg>
        <div className="max-lg:hidden max-sm:inline-block">{title}</div>
    </button>;

export default function Header() {

    return (
        <div class="flex flex-col shadow-xl p-2 gap-1">
            <div class="flex justify-end gap-5 text-sm text-cyan-500 underline max-sm:hidden">
                <a>About</a>
                <a>Contribute</a>
                <a>Disclaimer</a>
            </div>

            <div class="flex gap-3 justify-center items-center">
                <HamburgerMenu />
                <div className='max-sm:hidden h-full flex gap-3 justify-end grow'>
                    <HeaderButton title="Draw" path={<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />}
                    />
                    <HeaderButton title="Components" path={<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />} />
                    <HeaderButton title="OCR" path={<><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></>} />
                </div>
                <SearchBar />


                <div className='max-sm:hidden h-full flex justify-start gap-3 grow'>
                    <HeaderButton title="Advanced Search" path={<path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />} />

                    <History />

                    <Bookmarks />

                    <Settings/>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`size-8 transition-all duration-300 ${showHistory ? 'rotate-180' : 'rotate-0'}`} >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <div ref={dropdownRef} className={`absolute top-0 ${showHistory ? 'left-0' : '-left-40'}
            transition-all shadow-lg px-1.5 py-2.5 rounded-r-lg bg-white border z-10 flex flex-col gap-2`}>
              <History />
            <Bookmarks />
            <a className='text-sm text-cyan-500 underline'>About</a>
            <a className='text-sm text-cyan-500 underline'>Contribute</a>
            <a className='text-sm text-cyan-500 underline'>Disclaimer</a>
        </div>

    </>)
}