'use client';

// import React, { useState } from 'react';
// import { FormEvent, ChangeEvent } from "react";
// import Messages from "./Messages";
// // import { Message } from "ai/react";


// interface Search {
//   input: string;
//   handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
//   messages: Message[];
// }

// const Search: React.FC<Search> = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<any[]>([]); 

//   const handleSearch = async () => {
//     try {
//       const response = await fetch('/api/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setResults(data.results);
//       } else {
//         throw new Error('Search failed');
//       }
//     } catch (error) {
//       console.error('Error searching:', error);
//     }
//   };

//   return (
//     <div id="chat" className="flex flex-col w-full justify-center">
//        <Messages messages={messages} />
//        <>
//     <form
//           onSubmit={handleMessageSubmit}
//           className="mt-5 mb-5 relative bg-gray-700 rounded-lg"
//         >
//           <input
//             type="text"
//             className="input-glow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 bg-gray-600 border-gray-600 transition-shadow duration-200"
//             value={input}
//             onChange={handleInputChange}
//           />

//           <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
//             Press ⮐ to send
//           </span>
//         </form>
//       </>
//     </div>
//   );
// };

// export default Search;


// Chat.tsx

import React, { FormEvent, ChangeEvent } from "react";
import Messages from "./Messages";
import { Message } from "ai/react";

interface Search {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
}

const Search: React.FC<Search> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
}) => {
  return (
    <div id="chat" className="flex flex-col w-full justify-center">
      <Messages messages={messages} />
      <>
        <form
          onSubmit={handleMessageSubmit}
          className="mt-5 mb-5 ml-12 relative bg-gray-700 rounded-full"
        >
          <input
            type="text"
            className="input-glow appearance-none border rounded-full w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 bg-gray-600 border-gray-600 transition-shadow duration-200"
            value={input}
            onChange={handleInputChange}
          />

          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            Press ⮐ to send
          </span>
        </form>
      </>
    </div>
  );
};

export default Search;
