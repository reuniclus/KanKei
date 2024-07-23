import { useState } from 'react';
import { useTabsDispatch } from './TabsContext.js';

export default function SearchBar() {
  const [text, setText] = useState('');
  const dispatch = useTabsDispatch().dispatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'search',
      title: text,
      text: text,
    });
    setText('');
  }

  return (
    <>
      <form className='flex flex-inline' onSubmit={handleSubmit}>
        <input
          placeholder="Search Kanji"
          value={text}
          onChange={e => setText(e.target.value)}
          className="block max-w-80 w-full px-3 py-2 ps-10 rounded-l-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit"
          className="text-white end-2.5 bottom-2.5 rounded-r-lg px-3 py-2 bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium "
        >Search</button>
      </form>
    </>
  );
}
