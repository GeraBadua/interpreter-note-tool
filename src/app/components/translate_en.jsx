'use client';

import { useState } from 'react';

export default function Translator_en({ isVisible }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
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
        />
        <button
          onClick={handleTranslate}
          className="notebook-button"
        >
          Traducir
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
