import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

// Debug component to help troubleshoot Clerk issues
export default function ClerkDebugInfo() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-2">Clerk Debug Info</div>
      <div>Origin: {window.location.origin}</div>
      <div>Loaded: {isLoaded ? '✅' : '❌'}</div>
      <div>Signed In: {isSignedIn ? '✅' : '❌'}</div>
      <div>User: {user?.firstName || 'None'}</div>
      <div>Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 12)}...</div>
      <div>Env: {import.meta.env.MODE}</div>
    </div>
  );
}