'use client'; // This file is a client-side component
import React, { useState } from 'react';
import { Button } from '../components/button'; // Corrected import path

export default function GlossaryBox() {
  const [inputWord, setInputWord] = useState(''); // To capture the input word
  const [glossaryData, setGlossaryData] = useState(null); // To store the fetched glossary data
  const [errorMessage, setErrorMessage] = useState(''); // To handle errors if the API fails

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  };

  // Function to handle API call to fetch glossary data
  const fetchGlossaryData = async () => {
    try {
      const response = await fetch(`https://api.glossary.com/lookup?word=${inputWord}`); // Replace with the actual API URL
      const data = await response.json();
      
      if (response.ok) {
        setGlossaryData(data); // Set fetched glossary data
        setErrorMessage(''); // Clear any error messages
      } else {
        setErrorMessage('Failed to fetch glossary data');
      }
    } catch (error) {
      setErrorMessage('Error fetching glossary data: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#cdc4fd] flex items-center justify-center"> {/* Flexbox to center the content */}
      <main className="container mx-60 px-50 py-6">
        <section className="grid md:grid-cols-1 gap-16">  
          <FeatureCard title="Glossary" description="Check this word in the glossary">
            <input
              type="text"
              value={inputWord}
              onChange={handleInputChange}
              placeholder="Enter word to search"
              className="p-2 border rounded"
            />
            <Button onClick={fetchGlossaryData}>
              Check Glossary
            </Button>

            {/* Display the fetched glossary data or error message */}
            {glossaryData && (
              <pre className="mt-4 bg-gray-200 p-4 rounded-lg">
                {JSON.stringify(glossaryData, null, 2)}
              </pre>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </FeatureCard>
        </section>
      </main>
    </div>
  );
}

// FeatureCard component to render each card
const FeatureCard = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-60"> {/* Max-width and centered card */}
    <h3 className="text-xl font-semibold text-[#231373] mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {children}
  </div>
);
