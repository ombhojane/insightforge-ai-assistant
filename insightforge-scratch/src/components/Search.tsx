'use client';

import React, { useState } from 'react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
        className="p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>
      <div className="mt-4">
        {results.map((result, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold">{result.fileName}</h3>
            {result.chunks.map((chunk: any, chunkIndex: number) => (
              <p key={chunkIndex} className="mt-2">{chunk.content}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;