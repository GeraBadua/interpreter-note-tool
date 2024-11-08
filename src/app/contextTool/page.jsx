'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextArea from '../components/textarea';
import { Button } from '../components/button';

export default function ContextTool() {
  const [context, setContext] = useState('');
  const [wordBank, setWordBank] = useState([]);
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const goToGlossaryPage = () => {
    router.push('/glossaryBox');
  };

  const handleContextChange = (e) => {
    const newContext = e.target.value;
    setContext(newContext);

    const updatedWordBank = newContext
      ? newContext.split(' ').map((word) => word.toLowerCase())
      : [];
    setWordBank(updatedWordBank);
  };

  const fetchTranslation = async (text) => {
    try {
      const response = await fetch('https://api.deepl.com/v2/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_lang: 'es' }),
      });
      const data = await response.json();

      if (response.ok) {
        setTranslation(data.translatedText);
      } else {
        console.error('Error fetching translation:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (context) {
      fetchTranslation(context);
    }
  }, [context]);

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, notes]);
    setNotes('');
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[#cdc4fd] flex flex-col justify-between">
      <main className="container mx-auto px-4 py-16">
        <section className="mt-16 grid md:grid-cols-3 gap-8">
          <FeatureCard title="Context" description="Add the context word of your call">
            <TextArea value={context} onChange={handleContextChange} />
            <Button className="mt-4 bg-[#231373] text-white hover:bg-[#1c125c] transition duration-300 ease-in-out">
              Give word of context
            </Button>
          </FeatureCard>

          <FeatureCard title="Word bank" description="Words for the call context">
            <ul>
              {wordBank.map((word, index) => (
                <li key={index} className="text-gray-600">{word}</li>
              ))}
            </ul>
          </FeatureCard>

          <FeatureCard title="Meaning" description="Meaning of these words">
            <p>{translation || 'Here are some words to help you in this call'}</p>
          </FeatureCard>

          <Button 
            onClick={goToGlossaryPage}
            className="bg-[#231373] text-white hover:bg-[#1c125c] transition duration-300 ease-in-out">
            Go to glossary
          </Button>
        </section>
      </main>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

const FeatureCard = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
    <h3 className="text-xl font-semibold text-[#231373] mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {children}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#231373] text-white py-4 flex justify-center items-center space-x-4">
      <button 
        onClick={handlePrevious} 
        disabled={currentPage === 1} 
        className="px-4 py-2 bg-[#231373] text-white rounded-md hover:bg-[#1c125c] disabled:bg-gray-500">
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages} 
        className="px-4 py-2 bg-[#231373] text-white rounded-md hover:bg-[#1c125c] disabled:bg-gray-500">
        Next
      </button>
    </div>
  );
};
