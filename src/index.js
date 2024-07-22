import ReactDOM from 'react-dom/client';

import SearchBar from './components/SearchBar.js';
import TabList from './components/TabList.js';
import { TabsProvider } from './components/TabsContext.js';
import Header from './components/header.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <TabsProvider>
      <div className="flex flex-col h-dvh ">
        <Header/>

        <div className="flex flex-col p-8 max-w-7xl self-center h-full min-h-0 ">
          <TabList />
        </div>

      </div>
    </TabsProvider>
  </>
)