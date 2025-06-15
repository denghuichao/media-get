import React from 'react';
import { Download, Home, LayoutDashboard, Heart } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const { isLoaded } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('header.title')}</h1>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <span>{t('header.subtitle.prefix')}</span>
                <a 
                  href="https://github.com/soimort/you-get" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors underline"
                >
                  you-get
                </a>
                <span>{t('header.subtitle.suffix')}</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="#home" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{t('header.nav.home')}</span>
              </a>
              <a 
                href="#dashboard" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{t('header.nav.dashboard')}</span>
              </a>
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Authentication - Only show when Clerk is loaded */}
            {isLoaded && (
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                      {t('header.auth.signIn')}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            )}

            {/* Loading state for auth */}
            {!isLoaded && (
              <div className="flex items-center space-x-4">
                <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            )}
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