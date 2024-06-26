import ReactDOM from 'react-dom/client';
import Header from './components/header';
import Tabber from './components/tabber';
import App from './components/app';
import ContextProvider from './components/globalProvider';
//import { globalProvider } from "./globalProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
      {/*
      <Header />
      <Tabber/>
      */}
      <App/>
      
  </>
)
//</globalProvider>