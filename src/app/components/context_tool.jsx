'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WordSearch() {
  const [word, setWord] = useState('');
  const [results, setResults] = useState([]);
  const [translatedResults, setTranslatedResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchWord = async () => {
    setIsLoading(true);
    let searchWord = word;

    try {
      // Traducir al inglés si se detecta que la palabra está en español
      const translationRes = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: word,
          targetLang: 'EN', // Traducir a inglés
        }),
      });
      const translationData = await translationRes.json();

      // Si la traducción es diferente de la palabra original, usar la traducción
      if (translationData.translatedText.toLowerCase() !== word.toLowerCase()) {
        searchWord = translationData.translatedText;
      }

      // Llamar a la API de palabras relacionadas con la palabra en inglés
      const response = await fetch(`/api/datamuse?word=${searchWord}`);
      const data = await response.json();

      // Limitar los resultados a las primeras 15 palabras
      const limitedResults = data.slice(0, 15);
      setResults(limitedResults);
      setCurrentPage(1);

      // Realizar traducción de los resultados al español
      const translatedWords = await Promise.all(
        limitedResults.map(async (result) => {
          const translationRes = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: result.word,
              targetLang: 'ES',
            }),
          });
          const translationData = await translationRes.json();
          return {
            ...result,
            translatedText: translationData.translatedText,
          };
        })
      );

      setTranslatedResults(translatedWords);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular los resultados para la página actual
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = translatedResults.slice(indexOfFirstResult, indexOfLastResult);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Word Search</h1>
      <input
        className="p-2 border border-gray-300 rounded-md mb-4 w-full text-black"
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button
        onClick={searchWord}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Search
      </button>

      {/* Mostrar animación de carga si isLoading es true */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-lg font-semibold text-blue-500 animate-pulse">Cargando...</p>
        </div>
      ) : (
        <>
          {/* Renderizar resultados en tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentResults.map((result, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-md shadow-md bg-white">
                <h3 className="text-lg font-semibold text-black">
                  {result.word} <span className="text-gray-600">({result.translatedText})</span>
                </h3>
              </div>
            ))}
          </div>

          {/* Controles de paginación */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(translatedResults.length / resultsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-600`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
