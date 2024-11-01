'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Asegúrate de importar useRouter


export default function WordSearch() {
  const [word, setWord] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5); // Número de resultados por página
  const router = useRouter();


  const searchWord = async () => {
    try {
      const response = await fetch(`/api/datamuse?word=${word}`);
      const data = await response.json();
      setResults(data);
      setCurrentPage(1); // Reiniciar a la primera página cuando se haga una nueva búsqueda
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Calcular los resultados para la página actual
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

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

      {/* Renderizar resultados en tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentResults.map((result, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-md shadow-md bg-white">
            <h3 className="text-lg font-semibold text-black">{result.word}</h3>
            {/* Puedes agregar más detalles en la tarjeta si lo deseas */}
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(results.length / resultsPerPage) }, (_, index) => (
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
    </div>
  );
}
