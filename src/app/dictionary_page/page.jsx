'use client'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

  // Focus input on load
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Translation function for Spanish title and word
  const translateToSpanish = (text) => {
    return text === 'Definition in Spanish' ? 'Definición en Español' : text;
  };

  // Function to translate searched word using DeepL API
  const translateSearchedWord = async (word) => {
    try {
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        new URLSearchParams({
          auth_key: DEEPL_API_KEY, 
          text: word,
          target_lang: 'ES', // Lenguaje de destino (español)
        })
      );
      return response.data.translations[0].text;
    } catch (error) {
      console.error('Error translating word:', error);
      return word; // En caso de error, devuelve la palabra original
    }
  };

  // Fetch definition and translate word
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
      setSuggestions([]); // Clear suggestions when definition is fetched
      setSearchedWord(inputWord); // Set the searched word
      
      // Translate the word to Spanish for display
      const translated = await translateSearchedWord(inputWord);
      console.log("Translated Word:", translated); // Verificar el valor de la traducción
      setTranslatedWord(translated); // Set the translated word
    } catch (err) {
      setError('Could not fetch the definition. Please try a different word or check the spelling.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://api.datamuse.com/sug?s=${input}`);
      setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle input changes and reset results on empty input
  useEffect(() => {
    if (word === '') {
      setDefinition(null);
      setError('');
    } else if (searchedWord && !word.startsWith(searchedWord)) {
      setDefinition(null); // Clear definitions if the input word changes
    }
    fetchSuggestions(word);
  }, [word, searchedWord]);

  const handleClear = () => {
    setWord('');
    setDefinition(null);
    setError('');
    setSuggestions([]);
    setSearchedWord(''); // Clear the searched word state
    setTranslatedWord(''); // Clear the translated word
  };

  const handleSuggestionClick = (suggestion) => {
    setWord(suggestion.word);
    setSuggestions([]);
    handleSearch(suggestion.word);
  };

  const handleSearch = (inputWord) => {
    fetchDefinition(inputWord);
  };

  // Trigger search on "Enter" key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(word);
    }
  };

  // Close suggestions when clicking outside
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
    <div className="flex flex-col items-center p-4 space-y-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Bilingual Dictionary</h1>
      
      <div className="w-full flex flex-col space-y-2 relative text-black">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for "Enter" key press
            placeholder="Type a word in English or Spanish..."
            className="flex-grow p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={() => handleSearch(word)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
            disabled={!word.trim() || loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-1 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
                ></path>
              </svg>
            ) : (
              'Search'
            )}
          </button>
          <button
            onClick={handleClear}
            className="px-2 py-2 bg-gray-200 text-black rounded-md shadow-md hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && !definition && (
          <ul ref={suggestionsRef} className="absolute z-10 bg-white shadow-md rounded-md mt-2 w-full border border-gray-300 top-12">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.word}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 cursor-pointer hover:bg-blue-600 hover:text-white"
              >
                {suggestion.word}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 font-medium mt-4 p-2 rounded-md border border-red-200">
          {error} 
          <button
            onClick={() => handleSearch(word)}
            className="ml-2 underline text-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {definition && (
        <div className="w-full flex flex-col md:flex-row gap-4 mt-6">
          <div className="bg-white shadow-lg rounded-lg max-w-sm w-full border border-gray-200">
            <div className="bg-red-500 text-white rounded-t-lg p-3">
              <h2 className="text-lg font-semibold">Definition in English</h2>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{searchedWord}</h3>
              <p className="text-gray-600">{definition.english}</p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg max-w-sm w-full border border-gray-200">
            <div className="bg-red-500 text-white rounded-t-lg p-3">
              <h2 className="text-lg font-semibold">{translateToSpanish('Definition in Spanish')}</h2>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{translatedWord}</h3>
              <p className="text-gray-600">{definition.spanish}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionarySearch;
