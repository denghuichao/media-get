import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SupportedSites from './components/SupportedSites';
import Footer from './components/Footer';
import SystemStatus from './components/SystemStatus';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <SystemStatus />
        </div>
        <Hero />
        <Features />
        <SupportedSites />
      </main>
      <Footer />
    </div>
  );
}

export default App;