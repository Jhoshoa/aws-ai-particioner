/**
 * Jest test setup
 * This file runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Increase test timeout for Firebase operations
jest.setTimeout(10000);

// Mock console.error to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Filter out expected warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Firebase') || args[0].includes('firestore'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
