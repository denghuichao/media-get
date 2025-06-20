import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SupportedSites from './components/SupportedSites';
import Footer from './components/Footer';
import SystemStatus from './components/SystemStatus';
import Dashboard from './components/Dashboard';
import ClerkDebugInfo from './components/ClerkDebugInfo';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');

  // Listen for hash changes to handle navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {currentPage === 'home' ? (
        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <SystemStatus />
          </div>
          <Hero />
          <Features />
          <SupportedSites />
        </main>
      ) : (
        <Dashboard />
      )}
      <Footer />
      <ClerkDebugInfo />
    </div>
  );
}

export default App;