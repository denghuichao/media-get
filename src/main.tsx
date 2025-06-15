import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import './i18n';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Enhanced validation for production
const isValidKey = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key_here' && 
  (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_'));

if (!isValidKey) {
  console.error('❌ Clerk publishable key is missing or invalid');
  console.error('Current key:', PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 20)}...` : 'undefined');
  console.error('Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables');
  console.error('Get your key from: https://dashboard.clerk.com/last-active?path=api-keys');
}

// Fallback component when Clerk is not configured
function ClerkNotConfigured() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Not Configured</h2>
        <p className="text-gray-600 mb-4">
          Clerk authentication is not properly configured. Please check your environment variables.
        </p>
        <div className="bg-gray-100 p-3 rounded text-sm text-left">
          <p className="font-medium mb-1">Required:</p>
          <code className="text-xs">VITE_CLERK_PUBLISHABLE_KEY</code>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Get your key from{' '}
          <a 
            href="https://dashboard.clerk.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Clerk Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isValidKey ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        // Add domain configuration for production
        domain={window.location.hostname}
        isSatellite={false}
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#1f2937',
            borderRadius: '0.5rem'
          },
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            card: 'shadow-xl',
            headerTitle: 'text-2xl font-bold',
            headerSubtitle: 'text-gray-600'
          }
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <ClerkNotConfigured />
    )}
  </StrictMode>
);