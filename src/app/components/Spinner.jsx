import React from 'react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="spinner border-t-4 border-b-4 border-purple-500 rounded-full w-16 h-16 animate-spin"></div>
      <style jsx>{`
        .spinner {
          border-width: 4px;
          border-style: solid;
          border-color: white; /* Outer color */
          border-top-color: purple; /* Spinner color */
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
