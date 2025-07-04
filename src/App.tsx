import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SupportedSites from './components/SupportedSites';
import Footer from './components/Footer';
import SystemStatus from './components/SystemStatus';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DisclaimerAndCompliance from './components/DisclaimerAndCompliance';
import AboutAndQuality from './components/AboutAndQuality';
import CookieConsent from './components/CookieConsent';
import SEOHead from './components/SEOHead';
import { ConfigProvider } from './contexts/ConfigContext';
import { useTranslation } from 'react-i18next';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'privacy' | 'terms' | 'disclaimer' | 'about'>('home');
  const { t } = useTranslation();

  // Listen for hash changes to handle navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'disclaimer') {
        setCurrentPage('disclaimer');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // SEO configuration for each page
  const getSEOProps = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: t('seo.pages.dashboard.title'),
          description: t('seo.pages.dashboard.description'),
          canonicalUrl: 'https://media-get.site/#dashboard'
        };
      case 'privacy':
        return {
          title: t('seo.pages.privacy.title'),
          description: t('seo.pages.privacy.description'),
          canonicalUrl: 'https://media-get.site/#privacy'
        };
      case 'terms':
        return {
          title: t('seo.pages.terms.title'),
          description: t('seo.pages.terms.description'),
          canonicalUrl: 'https://media-get.site/#terms'
        };
      case 'disclaimer':
        return {
          title: 'Disclaimer & Legal Notice',
          description: 'Important legal information about content downloading and copyright compliance when using MediaGet.',
          canonicalUrl: 'https://media-get.site/#disclaimer'
        };
      case 'about':
        return {
          title: 'About MediaGet - Ethical Media Downloading Solution',
          description: 'Learn about MediaGet\'s mission, technology, and commitment to ethical media downloading practices.',
          canonicalUrl: 'https://media-get.site/#about'
        };
      default:
        return {
          title: t('seo.pages.home.title'),
          description: t('seo.pages.home.description'),
          canonicalUrl: 'https://media-get.site'
        };
    }
  };

  return (
    <ConfigProvider>
      <SEOHead {...getSEOProps()} />
      <div className="min-h-screen bg-white">
        <Header />
        {currentPage === 'home' ? (
          <main role="main">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" aria-label="System Status">
              <SystemStatus />
            </section>
            <Hero />
            <Features />
            <SupportedSites />
          </main>
        ) : currentPage === 'dashboard' ? (
          <main role="main" aria-label="Download Dashboard">
            <Dashboard />
          </main>
        ) : currentPage === 'privacy' ? (
          <main role="main" aria-label="Privacy Policy">
            <PrivacyPolicy />
          </main>
        ) : currentPage === 'terms' ? (
          <main role="main" aria-label="Terms of Service">
            <TermsOfService />
          </main>
        ) : currentPage === 'disclaimer' ? (
          <main role="main" aria-label="Disclaimer and Legal Notice">
            <DisclaimerAndCompliance />
          </main>
        ) : currentPage === 'about' ? (
          <main role="main" aria-label="About MediaGet">
            <AboutAndQuality />
          </main>
        ) : null}
        <Footer />
        <CookieConsent />
      </div>
    </ConfigProvider>
  );
}

export default App;