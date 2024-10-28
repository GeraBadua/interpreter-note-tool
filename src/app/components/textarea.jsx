import React, { useState } from 'react';

const TextArea = () => {
  const [texto, setTexto] = useState('');
  
  // Handle change in text area
  const handleChange = (e) => {
    setTexto(e.target.value);
  };

  
  return (
    <div>
      <textarea
        value={texto}
        onChange={handleChange}
        placeholder="Write here..."
        rows="3"
        cols="40"
      />
      
      

     {/*  <p>Words: {texto.length}</p>
       */}
      
      
    </div>
  );
};

export default TextArea;
