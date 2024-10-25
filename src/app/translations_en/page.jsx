"use client"

import { useState } from 'react';

export default function Translator() {
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
          targetLang: 'EN', // O el idioma al que desees traducir
        }),
      });

      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <textarea 
        className="text-black"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Escribe el texto a traducir"
      />
      <button onClick={handleTranslate}>Traducir</button>
      {translatedText && <p>Traducción: {translatedText}</p>}
    </div>
  );
}
