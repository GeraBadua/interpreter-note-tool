export const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#231373] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {children}
    </button>
  );
};