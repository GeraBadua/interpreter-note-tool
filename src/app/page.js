'use client';

import Link from 'next/link';
import { FaLanguage, FaStickyNote, FaUsers } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar Placeholder if needed, or just Hero */}

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
            The Interpreter&apos;s <br />
            <span className="text-secondary">Smart Notebook</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl">
            Enhance your interpretation workflow with real-time translation, smart note-taking, and seamless team collaboration.
          </p>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
            {/* Join as Interpreter Card */}
            <Link
              href="/intreg"
              className="group flex-1 bg-paper p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary transition-all duration-300"
            >
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <FaStickyNote size={24} className="text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">Interpreter</h3>
              <p className="text-gray-500">
                Join to access smart note-taking tools and real-time translation assistance.
              </p>
            </Link>

            {/* Join as Administrator Card */}
            <Link
              href="/adminreg"
              className="group flex-1 bg-paper p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-accent transition-all duration-300"
            >
              <div className="h-14 w-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <FaUsers size={24} className="text-accent group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">Administrator</h3>
              <p className="text-gray-500">
                Manage your team, oversee translations, and streamline collaboration.
              </p>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-secondary mb-16">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mx-auto bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaLanguage className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">Real-time Translation</h3>
                <p className="text-gray-500">Instant support for multiple languages to ensure accuracy in every session.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaStickyNote className="text-accent text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">Smart Notes</h3>
                <p className="text-gray-500">Organize your thoughts with our specialized note-taking interface designed for interpreters.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaUsers className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">Team Sync</h3>
                <p className="text-gray-500">Collaborate with administrators and other interpreters seamlessly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Note-Taking Interpreter Tool. All rights reserved.
      </footer>
    </div>
  );
}
