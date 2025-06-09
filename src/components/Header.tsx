import React from 'react';
import { Download } from 'lucide-react';

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
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
            <a href="#supported" className="text-gray-700 hover:text-blue-600 transition-colors">Supported Sites</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
}