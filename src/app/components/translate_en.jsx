'use client';

import { useState } from 'react';

export default function Translator_en({ isVisible }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          targetLang: 'EN',
        }),
      });

      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Error:', error);
      setTranslatedText('Translation error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex-1 p-8">
      <div className="notebook-paper">
        <h2 className="notebook-title">Spanish to English</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe el texto a traducir..."
          className="notebook-textarea w-full"
          disabled={isLoading}
        />
        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="notebook-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </>
          ) : (
            'Traducir'
          )}
        </button>
        {translatedText && (
          <div className="translation-result">
            <h3 className="text-lg font-semibold text-[#2b3481] mb-2">Translation:</h3>
            <p className="text-gray-700">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
