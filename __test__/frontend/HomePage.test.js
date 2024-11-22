import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../../src/app/home/page.jsx'; // Ajusta la ruta si es necesario
import { useRouter } from 'next/navigation';

// Mock de localStorage para evitar problemas con el almacenamiento durante las pruebas
beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'mock-token'), // Retorna un token simulado
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});


// Mock de useRouter para evitar redirecciones reales en las pruebas
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  it('should render the page without crashing', () => {
    useRouter.mockImplementation(() => ({ push: jest.fn() }));
    
    render(<HomePage />);
    
    // Verifica que ciertos elementos se están renderizando correctamente
    expect(screen.getByText(/Saved Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/New/i)).toBeInTheDocument();
    expect(screen.getByText(/Switch to English to Spanish/i)).toBeInTheDocument();
  });

  it('should show the correct button label when toggling language', () => {
    useRouter.mockImplementation(() => ({ push: jest.fn() }));

    render(<HomePage />);

    const toggleButton = screen.getByText(/Switch to English to Spanish/i);
    expect(toggleButton).toBeInTheDocument();

    // Simula hacer clic en el botón para cambiar el idioma
    fireEvent.click(toggleButton);

    // Verifica que el texto del botón cambie tras el clic
    expect(screen.getByText(/Switch to Spanish to English/i)).toBeInTheDocument();
  });
});