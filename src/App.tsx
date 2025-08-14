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
import AdBanner from './components/AdBanner';
import NativeAdBanner from './components/NativeAdBanner';
import { ConfigProvider } from './contexts/ConfigContext';
import { useTranslation } from 'react-i18next';
import BlogIndex from './components/BlogIndex';
import { findSiteBySlug } from './data/sites';
import { AD_CONFIGS } from './configs/adConfigs';

// Layout component that wraps all pages
const Layout: React.FC<{ children: React.ReactNode; seoProps?: any; showSidebar?: boolean }> = ({ children, seoProps, showSidebar = false }) => {
  return (
    <>
      {seoProps && <SEOHead {...seoProps} />}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {showSidebar ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 主内容区域 */}
              <div className="flex-1 min-w-0 w-full">
                {children}
              </div>
              {/* 侧边栏广告区域 - 仅在大屏幕显示 */}
              <aside className="hidden lg:block lg:w-44 flex-shrink-0">
                {/* 侧边栏广告容器 - sticky定位 */}
                <div className="sticky top-8 space-y-4">
                  {/* 侧边栏广告1: 160x600摩天楼广告 */}
                  <AdBanner
                    adKey={AD_CONFIGS.BANNER_160x600.key}
                    width={160}
                    height={600}
                    responsive={false}
                  />
                  {/* 侧边栏广告2: 160x300中等广告 - 固定在第一个广告底部 */}
                  <AdBanner
                    adKey={AD_CONFIGS.BANNER_160x300.key}
                    width={160}
                    height={300}
                    responsive={false}
                  />
                </div>
              </aside>
            </div>
          ) : (
            children
          )}
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
    <Layout seoProps={seoProps} showSidebar={true}>
      <Hero />

      {/* 广告1: Hero区域下方 - 728x90横幅广告 */}
      <AdBanner
        adKey={AD_CONFIGS.BANNER_728x90.key}
        width={728}
        height={90}
        className="my-8"
      />

      <SupportedSites />

      {/* 广告2: SupportedSites和Features之间 - 300x250中矩形广告 */}
      <AdBanner
        adKey={AD_CONFIGS.BANNER_300x250.key}
        width={300}
        height={250}
        className="my-8"
      />

      {/* 广告3: 原生广告嵌入在Features前 */}
      <NativeAdBanner
        adKey={AD_CONFIGS.NATIVE_BANNER.key}
        className="my-8"
      />

      <Features />

      {/* 广告4: Features下方 - 468x60横幅广告 */}
      <AdBanner
        adKey={AD_CONFIGS.BANNER_468x60.key}
        width={468}
        height={60}
        className="my-8"
      />
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
    <Layout seoProps={seoProps} showSidebar={true}>
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