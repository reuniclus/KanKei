import * as React from "react";
import SearchBar from "./SearchBar";
import History from "./history";
import Bookmarks from "./bookmarks";


export const HeaderButton = ({ onClick, title, img }) =>
    <button onClick={onClick} class="flex flex-col self-stretch my-auto whitespace-nowrap text-neutral-400 hover:bg-slate-100 p-1 rounded-md">
        <img
            loading="lazy"
            src={img}
            className="self-center aspect-[1.41] w-[34px]"
        />
        <div>{title}</div>
    </button>;

export default function Header() {

    return (
        <div class="flex flex-col justify-center py-3 px-6 shadow-xl">
            <div class="flex justify-end  gap-5 text-sm text-cyan-500">
                <div class="underline">About</div>
                <div class="underline">Contribute</div>
                <div class="underline">Disclaimer</div>
            </div>

            <div class="flex justify-center">
                <div class="flex gap-5 justify-between items-center max-md:flex-wrap">

                    
                    <HeaderButton title="Draw" img="https://cdn.builder.io/api/v1/image/assets/TEMP/a95952d75bae398e1f13b06c02dac331b01c36e07d2258823eb19349a816f9ba?" />
                    <HeaderButton title="Components" img="https://cdn.builder.io/api/v1/image/assets/TEMP/646b94ae77e0cec0ded1829c6c70a5478bfe847ac3c1ee179e15db0829004f4c?" />
                    <HeaderButton title="OCR" img="https://cdn.builder.io/api/v1/image/assets/TEMP/dc2cc0d68d9c4fd137ebfc53c5a30e4f21a76a751a562b0fd06bcd7dc21e7576?" />
                    
                    <SearchBar/>
                    
                    <HeaderButton title="Advanced Search" img="https://cdn.builder.io/api/v1/image/assets/TEMP/96777e1253644db7038e0b9f362615a4af19da4c7c12afef3d995ba9a784ea2f?" />

                    <History/>

                    <Bookmarks/>

                    <HeaderButton title="Settings" img="https://cdn.builder.io/api/v1/image/assets/TEMP/454c33e411db356b2270cfbf79c4e36eee432931f94e352f54f9b7f2dc5b41a4?" />
                    
                </div>
            </div>
        </div>
    );
}

