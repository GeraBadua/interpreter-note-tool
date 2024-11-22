'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('https://img.freepik.com/free-photo/view-arrangement-with-keyboard-notebooks_23-2148847749.jpg?t=st=1730089306~exp=1730092906~hmac=a298de54aa89ec4da836773a2bb27a45140cc3a3c7ba2c97535e20b0b66b7441&w=1380')] bg-cover flex items-center justify-center px-4">
      <main className="container mx-auto flex flex-col md:flex-row items-center gap-16 py-16 bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl">
        
        {/* Left Side - Title */}
        <section className="text-center md:w-1/2 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-[#231373] mb-4">
            Welcome to The Note-Taking Interpreter Tool
          </h1>
          <p className="text-lg text-[#9C92A3] mt-2">
            Enhance your interpretation experience with smart note-taking, real-time translation, and seamless team collaboration features.
          </p>
        </section>
        
        {/* Right Side - Join Options */}
        <section className="md:w-1/2 flex flex-col gap-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#231373] mb-6 text-center">Join Us Now</h2>

          <div className="flex flex-col gap-6">
            
            {/* Join as Interpreter */}
            <Link 
              href="/intreg"
              className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-6 py-6 rounded-full text-lg font-semibold text-center flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <span>As an Interpreter</span>
              <span className="text-sm font-light mt-2">Efficient note-taking, real-time translations, and appointment management.</span>
            </Link>
            
            {/* Join as Administrator */}
            <Link 
              href="/adminreg"
              className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-6 py-6 rounded-full text-lg font-semibold text-center flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <span>As an Administrator</span>
              <span className="text-sm font-light mt-2">Invite team members, manage notes, and oversee team translations.</span>
            </Link>

          </div>
        </section>
      </main>
    </div>
  );
}
