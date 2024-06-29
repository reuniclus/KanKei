import * as React from "react";
import { useEffect, useState, useContext } from "react"

function Header() {
    //const {value, setValue} = useContext(globalContext);
    const [searchQuery, setSearchQuery] = useState('');

    const Headerlink = ({ title, img, href }) =>
        <a href={href} class="flex flex-col self-stretch my-auto whitespace-nowrap text-neutral-400 hover:bg-slate-100 p-1 rounded-md">
            <img
                loading="lazy"
                src={img}
                class="self-center aspect-[1.41] w-[34px]"
            />
            <div>{title}</div>
        </a>;

    

//const setSharedValue = useContext(globalContext);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(searchQuery);
        //setGlobalstate({searchQuery:searchQuery});
        //onSubmit(searchQuery);
    };


    return (
        <div class="flex flex-col justify-center py-3 px-6 shadow-xl">
            <div class="flex justify-end  gap-5 text-sm text-cyan-500">
                <div class="underline">About</div>
                <div class="underline">Contribute</div>
                <div class="underline">Disclaimer</div>
            </div>
            <div class="flex justify-center">
                <div class="flex gap-5 justify-between items-center max-md:flex-wrap">

                    {/*
                    <Headerlink title="Draw" img="https://cdn.builder.io/api/v1/image/assets/TEMP/a95952d75bae398e1f13b06c02dac331b01c36e07d2258823eb19349a816f9ba?" />
                    <Headerlink title="Components" img="https://cdn.builder.io/api/v1/image/assets/TEMP/646b94ae77e0cec0ded1829c6c70a5478bfe847ac3c1ee179e15db0829004f4c?" />
                    <Headerlink title="OCR" img="https://cdn.builder.io/api/v1/image/assets/TEMP/dc2cc0d68d9c4fd137ebfc53c5a30e4f21a76a751a562b0fd06bcd7dc21e7576?" />
                    */}

                    <form class="flex max-w-md" onSubmit={handleSubmit}>
                        <label for="default-search" class="mb-2 font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" onChange={(e) => setSearchQuery(e.target.value)} id="default-search" class="block min-w-80 w-full px-3 py-2 ps-10 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500" placeholder="Kanji, component, meaning, reading..." required />
                        </div>
                        <button type="submit" class="text-white end-2.5 bottom-2.5 rounded-lg px-3 py-2 bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium ">Search</button>
                    </form>
                    {/*
                    <Headerlink title="Advanced Search" img="https://cdn.builder.io/api/v1/image/assets/TEMP/96777e1253644db7038e0b9f362615a4af19da4c7c12afef3d995ba9a784ea2f?" />
                    <Headerlink title="History" img="https://cdn.builder.io/api/v1/image/assets/TEMP/4bc70949dbf3f0f7f88a8527c3f78dbb5929fb598ce91c308f604f984fc96f68?" />
                    <Headerlink title="Bookmarks" img="https://cdn.builder.io/api/v1/image/assets/TEMP/f9633a0224896cf1ccdfb96c4bd924a2d6761464c5f181e5b769db5635ff20bf?" />
                    <Headerlink title="Settings" img="https://cdn.builder.io/api/v1/image/assets/TEMP/454c33e411db356b2270cfbf79c4e36eee432931f94e352f54f9b7f2dc5b41a4?" />
                    */}
                </div>
            </div>
        </div>
    );
}

export default Header