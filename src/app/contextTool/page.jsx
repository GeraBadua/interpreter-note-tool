'use client'; // This file is a client-side component
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook
import TextArea from '../components/textarea';
import { Button } from '../components/button'; // Corrected import path

export default function contextTool() {
  const [context, setContext] = useState('');
  const [wordBank, setWordBank] = useState([]);
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState(''); // State to manage the notes text
  const [savedNotes, setSavedNotes] = useState([]); // State to manage saved notes

  const [currentPage, setCurrentPage] = useState(1); // State for current page in pagination
  const notesPerPage = 5; // Set the number of notes per page

  const router = useRouter(); // Initialize the useRouter hook

  // Calculate the current notes to display based on pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = savedNotes.slice(indexOfFirstNote, indexOfLastNote);

  const totalPages = Math.ceil(savedNotes.length / notesPerPage);

  // Handle changing pages
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to handle context input change
  const handleContextChange = (e) => {
    const newContext = e.target.value;
    setContext(newContext);

    // Update the word bank
    const updatedWordBank = newContext
      ? newContext.split(' ').map((word) => word.toLowerCase())
      : [];
    setWordBank(updatedWordBank);
  };

  // Function to handle translation API call
  const fetchTranslation = async (text) => {
    try {
      // Call the translation API (replace with actual API URL)
      const response = await fetch('https://api.deepl.com/v2/translate', { // Replace with actual API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,   // The text to be translated
          target_lang: 'es', // Target language for translation (example: Spanish)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTranslation(data.translatedText); // Assuming the API returns the translation as 'translatedText'
      } else {
        console.error('Error fetching translation:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // UseEffect to fetch translation when context changes
  useEffect(() => {
    if (context) {
      fetchTranslation(context); // Fetch translation when context changes
    }
  }, [context]);

  // Function to handle saving notes
  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, notes]); // Add the current notes to savedNotes array
    setNotes(''); // Clear the notes after saving

    // Navigate back to home after saving
    router.push('/home'); // Programmatic navigation to the home page
  };

  return (
    <div className="min-h-screen bg-[#cdc4fd]">
      <main className="container mx-auto px-4 py-16">
        <section className="mt-16 grid md:grid-cols-3 gap-8">
          {/* First FeatureCard: Note Taking */}
          <FeatureCard title="Translate" description="Please add here the word of translate">
            <TextArea value={context} onChange={handleContextChange} />
            <Button onClick={() => fetchTranslation(context)}>
              Translate word
            </Button>
          </FeatureCard>

          {/* Second FeatureCard: Word Bank */}
          <FeatureCard title="Context" description="Here is the context of the words that you need for the context of the call ">
            <ul>
              {wordBank.map((word, index) => (
                <li key={index} className="text-gray-600">{word}</li>
              ))}
            </ul>
          </FeatureCard>

          {/* Third FeatureCard: Translation Management */}
          <FeatureCard title="Meaning" description="What these words mean">
            <p>{translation || 'No translation available yet'}</p>
          </FeatureCard>

          <Button onClick={handleSaveNote}>
            Save note
          </Button>
        </section>

        {/* Saved Notes with Pagination */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#231373] mb-4">Saved Notes</h2>
          {currentNotes.length > 0 ? (
            <ul className="bg-white p-6 rounded-lg shadow-md">
              {currentNotes.map((note, index) => (
                <li key={index} className="text-gray-600 mb-2">
                  {note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No saved notes.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#231373] text-white'
              }`}
            >
              Previous
            </button>

            <span className="text-[#231373] font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#231373] text-white'
              }`}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// FeatureCard component to render each card
const FeatureCard = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-[#231373] mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {children}
  </div>
);
