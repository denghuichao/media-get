import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SupportedSites from './components/SupportedSites';
import AllSupportedSites from './components/AllSupportedSites';
import Footer from './components/Footer';
// import SystemStatus from './components/SystemStatus';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DisclaimerAndCompliance from './components/DisclaimerAndCompliance';
import AboutAndQuality from './components/AboutAndQuality';
import CookieConsent from './components/CookieConsent';
import SEOHead from './components/SEOHead';
import SiteDownloadPage from './components/SiteDownloadPage';
import { ConfigProvider } from './contexts/ConfigContext';
import { useTranslation } from 'react-i18next';
import BlogIndex from './components/BlogIndex';
import { findSiteBySlug } from './data/sites';

// Layout component that wraps all pages
const Layout: React.FC<{ children: React.ReactNode; seoProps?: any }> = ({ children, seoProps }) => {
  return (
    <>
      {seoProps && <SEOHead {...seoProps} />}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

// Home page component
const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const seoProps = {
    title: t('seo.pages.home.title'),
    description: t('seo.pages.home.description'),
    canonicalUrl: 'https://media-get.site'
  };

  return (
    <Layout seoProps={seoProps}>
      <Hero />
      <SupportedSites />
      <Features />
    </Layout>
  );
};

// Dashboard page component
const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const seoProps = {
    title: t('seo.pages.dashboard.title'),
    description: t('seo.pages.dashboard.description'),
    canonicalUrl: 'https://media-get.site/dashboard'
  };

  return (
    <Layout seoProps={seoProps}>
      <Dashboard />
    </Layout>
  );
};

// Site download page component with SEO
const SiteDownloadPageWithSEO: React.FC = () => {
  const { siteSlug } = useParams<{ siteSlug: string }>();
  const site = findSiteBySlug(siteSlug || '');

  if (!site) {
    return <HomePage />;
  }

  const seoProps = {
    title: `${site.name} Video Downloader - MediaGet`,
    description: `Download ${site.types.join(', ').toLowerCase()} from ${site.name} easily and quickly. High-quality downloads with no software required.`,
    canonicalUrl: `https://media-get.site/download/${siteSlug}`
  };

  return (
    <Layout seoProps={seoProps}>
      <SiteDownloadPage siteInfo={site} />
    </Layout>
  );
};

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/privacy" element={
            <Layout seoProps={{ title: 'Privacy Policy - MediaGet', description: 'Privacy policy and data protection information for MediaGet users.', canonicalUrl: 'https://media-get.site/privacy' }}>
              <PrivacyPolicy />
            </Layout>
          } />
          <Route path="/terms" element={
            <Layout seoProps={{ title: 'Terms of Service - MediaGet', description: 'Terms and conditions for using MediaGet media download service.', canonicalUrl: 'https://media-get.site/terms' }}>
              <TermsOfService />
            </Layout>
          } />
          <Route path="/disclaimer" element={
            <Layout seoProps={{ title: 'Disclaimer & Legal Notice', description: 'Important legal information about content downloading and copyright compliance when using MediaGet.', canonicalUrl: 'https://media-get.site/disclaimer' }}>
              <DisclaimerAndCompliance />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout seoProps={{ title: 'About MediaGet - Ethical Media Downloading Solution', description: 'Learn about MediaGet\'s mission, technology, and commitment to ethical media downloading practices.', canonicalUrl: 'https://media-get.site/about' }}>
              <AboutAndQuality />
            </Layout>
          } />
          <Route path="/supported-sites" element={
            <Layout seoProps={{ title: 'All Supported Sites - MediaGet', description: 'Browse all 500+ supported platforms for video, audio, and image downloads with MediaGet.', canonicalUrl: 'https://media-get.site/supported-sites' }}>
              <AllSupportedSites />
            </Layout>
          } />
          <Route path="/blogs" element={
            <Layout seoProps={{ title: 'Technical Blogs - MediaGet Engineering', description: 'Deep technical insights into video extraction, platform analysis, and yt-dlp engineering.', canonicalUrl: 'https://media-get.site/blogs' }}>
              <BlogIndex />
            </Layout>
          } />
          <Route path="/download/:siteSlug" element={<SiteDownloadPageWithSEO />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;