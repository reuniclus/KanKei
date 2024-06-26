import { useState } from 'react';
import { useTabs, useTabsDispatch } from './TabsContext.js';

export default function AddTab() {
  const [text, setText] = useState('');
  const dispatch = useTabsDispatch().dispatch;

  const tabs = useTabs().tabs;
  const activeTab = useTabs().activeTab;
  const dispatchTab = useTabsDispatch().dispatchTab;
  return (
    <>
      <input
        placeholder="Search Kanji"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'search',
          title: text,
          text: text,
        }); 
      }}>Search</button>
    </>
  );
}

//let nextId = 3;
