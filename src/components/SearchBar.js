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
      <form className='flex m-auto grow max-w-[22rem]' onSubmit={handleSubmit}>
        <input
          placeholder="Kanji, components, romaji, meanings"
          value={text}
          onChange={e => setText(e.target.value)}
          className="inline-block p-2 rounded-l-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 w-full"
        />
        <button type="submit"
          className="text-white rounded-r-lg px-3 bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium"
        >Search</button>
      </form>
    </>
  );
}
