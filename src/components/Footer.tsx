import React from 'react';
import { Download, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">MediaGet</h3>
              <p className="text-xs text-gray-400">Powered by you-get</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:support@mediaget.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <span className="text-gray-400 text-sm">© 2025 MediaGet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}