import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import './i18n';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if the key is a placeholder or missing
const isValidKey = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key_here' && 
  PUBLISHABLE_KEY.startsWith('pk_');

if (!isValidKey) {
  console.warn('Clerk publishable key is not configured. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file with a valid key from https://dashboard.clerk.com/last-active?path=api-keys');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ''} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);