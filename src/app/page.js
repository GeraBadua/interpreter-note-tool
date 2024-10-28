'use client'; // Este archivo es un componente del lado del cliente

import Link from 'next/link';

export default function Home() {
  

  return (
    <div className="min-h-screen bg-[#f5ebdf]">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center">
          <h1 className="text-5xl font-bold text-[#231373] mb-6">Welcome to Interpreter Note Tool</h1>
          <p className="text-xl mb-8">Your all-in-one solution for efficient note-taking and translation management.</p>
          <Link href="/register" className="bg-[#76a82c] hover:bg-[#9c7efd] text-white px-6 py-3 rounded-full text-lg font-semibold">
            Get Started
          </Link>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Smart Note-Taking" 
            description="Organize your interpretation notes with ease and efficiency."
          />
          <FeatureCard 
            title="Real-Time Translation" 
            description="Access quick translations for unfamiliar terms on the fly."
          />
          <FeatureCard 
            title="Appointment Management" 
            description="Keep track of your interpretation assignments and schedules."
          />
        </section>
      </main>
    </div>
  );
}

const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-[#231373] mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);