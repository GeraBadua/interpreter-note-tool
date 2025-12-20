'use client'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';

const DictionarySearch = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const [searchedWord, setSearchedWord] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');

  // DEEPL_API_KEY should ideally be pulled from env or a server-side route to keep it secure
  // Assuming it was hardcoded or globally available in the previous file, 
  // but better to move translation logic to backend if possible. 
  // For now, I will keep the structure but note that DEEPL_API_KEY needs to be handled.
  // The user didn't provide the key in the previous file snippet I saw (it was just `DEEPL_API_KEY`).
  // I will assume it's a variable available in scope or needs to be a placeholder if not.
  // Wait, looking at the previous file content, `DEEPL_API_KEY` was used directly. 
  // This implies it might be defined via a define plugin or similar, or it's missing in the snippet?
  // Actually, strictly looking at line 33 of the previous file: `auth_key: DEEPL_API_KEY,` 
  // It seems it was expected to be there. I'll use process.env.NEXT_PUBLIC_DEEPL_API_KEY if available or keep it as is if it was working.
  // However, client-side usage of secret keys is bad practice.
  // Given the instruction to "improve UI/UX", I shouldn't break functionality.
  // I'll leave the translation logic as is but styling around it.

  // Actually, I'll use the server-side route `/api/translate` if available, or just keeping it client side as user had it.
  // But wait, the previous code used `DEEPL_API_KEY` which is likely undefined in client scope unless it's a global.
  // I will assume it is available or I should replace it with a placeholder for now to avoid breaking if it was working.
  const DEEPL_API_KEY = process.env.NEXT_PUBLIC_DEEPL_API_KEY || '';

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const translateToSpanish = (text) => {
    return text === 'Definition in Spanish' ? 'Definición en Español' : text;
  };

  const translateSearchedWord = async (word) => {
    try {
      // Check if we can use the backend route instead of direct call to avoid CORS/Key exposure
      // The home page used `/api/translate`, maybe we can use that?
      // For now, I'll keep the axios call but safeguard the key.
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        new URLSearchParams({
          auth_key: DEEPL_API_KEY,
          text: word,
          target_lang: 'ES',
        })
      );
      return response.data.translations[0].text;
    } catch (error) {
      console.error('Error translating word:', error);
      return word;
    }
  };

  const fetchDefinition = async (inputWord) => {
    if (!inputWord.trim()) return;
    setLoading(true);
    setError('');
    setDefinition(null);

    try {
      const response = await fetch(`/api/dictionary?word=${inputWord}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDefinition(data);
      setSuggestions([]);
      setSearchedWord(inputWord);

      const translated = await translateSearchedWord(inputWord);
      setTranslatedWord(translated);
    } catch (err) {
      setError('Could not fetch the definition. Please try a different word or check the spelling.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://api.datamuse.com/sug?s=${input}`);
      setSuggestions(response.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (word === '') {
      setDefinition(null);
      setError('');
    } else if (searchedWord && !word.startsWith(searchedWord)) {
      setDefinition(null);
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(word);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [word, searchedWord]);

  const handleClear = () => {
    setWord('');
    setDefinition(null);
    setError('');
    setSuggestions([]);
    setSearchedWord('');
    setTranslatedWord('');
  };

  const handleSuggestionClick = (suggestion) => {
    setWord(suggestion.word);
    setSuggestions([]);
    handleSearch(suggestion.word);
  };

  const handleSearch = (inputWord) => {
    fetchDefinition(inputWord);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(word);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-secondary tracking-tight">Dictionary</h1>
          <Link href="/home" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-paper p-8 rounded-2xl shadow-sm border border-gray-100 mb-12 relative z-20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a word in English or Spanish..."
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && !definition && (
                <ul ref={suggestionsRef} className="absolute z-30 bg-white shadow-xl rounded-xl mt-2 w-full border border-gray-100 overflow-hidden">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.word}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                    >
                      {suggestion.word}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => handleSearch(word)}
              disabled={!word.trim() || loading}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"></path>
                </svg>
              ) : (
                'Search'
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-4 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 font-medium p-4 rounded-xl border border-red-100 mb-8 animate-fade-in-up">
            {error}
            <button
              onClick={() => handleSearch(word)}
              className="ml-2 underline text-red-700 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {definition && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
            <div className="bg-paper shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-primary/5 border-b border-primary/10 p-4">
                <h2 className="text-lg font-bold text-primary">Definition in English</h2>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary capitalize">{searchedWord}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{definition.english}</p>
              </div>
            </div>

            <div className="bg-paper shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-accent/5 border-b border-accent/10 p-4">
                <h2 className="text-lg font-bold text-accent">{translateToSpanish('Definition in Spanish')}</h2>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary capitalize">{translatedWord}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{definition.spanish}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionarySearch;
