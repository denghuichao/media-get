import React from 'react';
import { Download, Home, LayoutDashboard, Heart, Info, BookText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();

  const toolDisplayName = 'yt-dlp';
  const toolUrl = 'https://github.com/yt-dlp/yt-dlp';

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg" aria-hidden="true">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('header.title')}</h1>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <span>{t('header.subtitle.prefix')}</span>
                <a
                  href={toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors underline"
                  aria-label={`${toolDisplayName} GitHub repository`}
                >
                  {toolDisplayName}
                </a>
                <span>{t('header.subtitle.suffix')}</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" aria-hidden="true" />
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <a
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
                aria-label="Go to home page"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>{t('header.nav.home')}</span>
              </a>
              <a
                href="/#dashboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
                aria-label="Go to dashboard"
              >
                <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>{t('header.nav.dashboard')}</span>
              </a>
              <a
                href="/#blogs"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
                aria-label="Go to blogs"
              >
                <BookText className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>{t('header.nav.blogs')}</span>
              </a>
              <a
                href="/#about"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
                aria-label="Go to about page"
              >
                <Info className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span>{t('header.nav.about')}</span>
              </a>
            </nav>            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}