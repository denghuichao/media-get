import React from 'react';
import { Download, Home, LayoutDashboard } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediaGet</h1>
              <p className="text-xs text-gray-500">Powered by you-get</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </a>
            <a 
              href="#dashboard" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </a>
          </nav>
          
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