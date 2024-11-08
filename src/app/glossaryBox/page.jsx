'use client';

import React, { useState } from 'react';
import { Button } from '../components/button';

export default function GlossaryBox() {
  const [inputWord, setInputWord] = useState('');
  const [glossaryData, setGlossaryData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  };

  const fetchGlossaryData = async () => {
    try {
      const response = await fetch(`https://api.glossary.com/lookup?word=${inputWord}`);
      const data = await response.json();
      
      if (response.ok) {
        setGlossaryData(data);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch glossary data');
      }
    } catch (error) {
      setErrorMessage('Error fetching glossary data: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cdc4fd] to-[#b0a6f5] flex items-center justify-center">
      <main className="container mx-auto px-8 py-12">
        <section className="grid md:grid-cols-1 gap-10">  
          <FeatureCard title="Glossary" description="Check the meaning of a word in the glossary">
            <input
              type="text"
              value={inputWord}
              onChange={handleInputChange}
              placeholder="Enter word to search"
              className="p-3 border rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#231373] transition duration-200 ease-in-out"
            />
            <Button 
              onClick={fetchGlossaryData}
              className="bg-[#231373] text-white w-full py-2 rounded-lg hover:bg-[#1c125c] transition duration-300 ease-in-out">
              Check Glossary
            </Button>

            {/* Display the fetched glossary data or error message */}
            {glossaryData && (
              <pre className="mt-6 bg-gray-100 p-4 rounded-lg overflow-x-auto max-h-60 text-sm text-[#231373]">
                {JSON.stringify(glossaryData, null, 2)}
              </pre>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4 text-center font-semibold">{errorMessage}</p>
            )}
          </FeatureCard>
        </section>
      </main>
    </div>
  );
}

// FeatureCard component to render each card
const FeatureCard = ({ title, description, children }) => (
  <div className="bg-white p-10 rounded-lg shadow-lg max-w-3xl mx-auto transition duration-300 ease-in-out transform hover:scale-105">
    <h3 className="text-2xl font-semibold text-[#231373] mb-4">{title}</h3>
    <p className="text-gray-600 mb-6 text-lg">{description}</p>
    {children}
  </div>
);
