'use client'; // Este archivo es un componente del lado del cliente
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar el hook de navegación
import Image from "next/image";
import Navbar from './components/Navbar';
import { Textarea } from './components/Textarea';
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,
} from "./components/card";

import Link from 'next/link';
import { Button } from './components/button';

export default function Home() {
  const [context, setContext] = useState('');
  const [wordBank, setWordBank] = useState([]);
/*   const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirigir al usuario a la página de login si no hay token
    }
  }, [router]); */
  const handleContextChange = (e) => {
    setContext(e.target.value);
    // Simulate generating a word bank based on context
    setWordBank(['customer', 'support', 'issue', 'resolution', 'feedback']);
  };

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
  <Card>
    <CardTitle>
      Smart Note-Taking
    </CardTitle>
    <CardDescription>Organize your interpretation notes with ease and efficiency.</CardDescription>
    <Textarea />
  </Card>

  <Card>
    <CardTitle>
      Real-Time Translation
    </CardTitle>
    <CardDescription>Access quick translations for unfamiliar terms on the fly.</CardDescription>
    <Textarea
      value={context}
      onChange={handleContextChange}
    />
  </Card>
  <Card>
              <CardHeader>
                <CardTitle>Word Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {wordBank.map((word, index) => (
                    <Button key={index} variant="outline">{word}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>

  <Card>
    <CardTitle>
      Appointment Management
    </CardTitle>
    <CardDescription>Keep track of your interpretation assignments and schedules.</CardDescription>
    <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentView('saved')}>
      Saved Notes
    </Button>
  </Card>
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