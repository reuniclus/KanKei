import { useState, createContext, useContext } from "react";

export const globalContext = createContext();

const ContextProvider = ( { children } ) => {
    //const sharedValue = 'This is a shared value';
    const [sharedObject , setSharedObject ] = useState({tabs:[], text:'This is a shared value', number:0});

    return (
      <globalContext.Provider value={{sharedObject, setSharedObject}}>
        { children }
      </globalContext.Provider>
    );
  };

  const useGlobalContext = () => {
    return useContext(globalContext);
  };

  export {ContextProvider, useGlobalContext};
  
/*
export const globalProvider = ({ children }) => {
    const [sharedValue , setSharedValue ] = useState({searchQuery:"", consultedKanji:""});
    return(
        <globalContext.Provider value={{sharedValue, setSharedValue}}>
             {children} 
        </globalContext.Provider>
    )
} 

export const userGlobalContext = ()=> {
    return useContext(globalContext);
}*/
