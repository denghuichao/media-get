import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SupportedSites from './components/SupportedSites';
import AllSupportedSites from './components/AllSupportedSites';
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
import BlogIndex from './components/BlogIndex';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'privacy' | 'terms' | 'disclaimer' | 'about' | 'supported-sites' | 'blogs'>('home');
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
      } else if (hash === 'supported-sites') {
        setCurrentPage('supported-sites');
      } else if (hash === 'blogs') {
        setCurrentPage('blogs');
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
      case 'supported-sites':
        return {
          title: 'All Supported Sites - MediaGet',
          description: 'Browse all 100+ supported platforms for video, audio, and image downloads with MediaGet.',
          canonicalUrl: 'https://media-get.site/#supported-sites'
        };
      case 'blogs':
        return {
          title: 'Technical Blogs - MediaGet Engineering',
          description: 'Deep technical insights into video extraction, platform analysis, and yt-dlp engineering.',
          canonicalUrl: 'https://media-get.site/#blogs'
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
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {currentPage === 'blogs' ? (
              <BlogIndex />
            ) : (
              <Routes>
                <Route path="/" element={
                  <>
                    <div id="home"><Hero /></div>
                    <div id="dashboard"><Dashboard /></div>
                    <SystemStatus />
                    <SupportedSites />
                    <Features />
                    <div id="about"><AboutAndQuality /></div>
                    <DisclaimerAndCompliance />
                  </>
                } />
                <Route path="/all-supported-sites" element={<AllSupportedSites />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
              </Routes>
            )}
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;