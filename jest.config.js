const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Configura el alias @ para apuntar a src
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Extensiones reconocidas por Jest
  testEnvironment: 'node', // Entorno por defecto para evitar conflictos en pruebas backend

  // Configura proyectos separados para frontend y backend
  projects: [
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/__test__/backend/**/*.test.js'],
      testEnvironment: 'node', // Usa entorno node para pruebas backend
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/__test__/frontend/**/*.test.js'],
      testEnvironment: 'jsdom', // Usa jsdom para pruebas frontend
    },
  ],

  // Opcional: Configuración de transformaciones si usas Babel
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Ignora transformaciones en node_modules
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
