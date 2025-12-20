'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function WordSearch() {
  const [word, setWord] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const searchWord = async () => {
    if (!word.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/datamuse?word=${word}`);
      const data = await response.json();
      setResults(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-secondary tracking-tight">Context Tool</h1>
          <Link href="/home" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-paper p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              className="flex-1 p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a word to find context..."
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && searchWord()}
              disabled={isLoading}
            />
            <button
              onClick={searchWord}
              disabled={isLoading || !word.trim()}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResults.map((result, index) => (
            <div key={index} className="p-6 bg-paper border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-secondary mb-2 capitalize">{result.word}</h3>
              {result.score && (
                <div className="text-xs font-mono text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded">
                  Relevance: {result.score}
                </div>
              )}
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="flex justify-center mt-12 gap-2 flex-wrap">
            {Array.from({ length: Math.ceil(results.length / resultsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === index + 1
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {results.length === 0 && word && (
          <div className="text-center text-gray-400 mt-12">
            <p>No results found or haven&apos;t searched yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
