import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[#231373] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Interpreter Note Tool</Link>
        <Link href="/login" className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-4 py-2 rounded">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;