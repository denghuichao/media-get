import React from 'react';
import { Shield, Zap, Settings, Download, PlayCircle, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Download className="h-8 w-8" />,
    title: 'Multiple Formats',
    description: 'Download in various formats and quality levels - from 144p to 4K, MP4 to WebM, MP3 to FLAC.'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Lightning Fast',
    description: 'Powered by you-get\'s optimized extraction engine for quick analysis and high-speed downloads.'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Privacy First',
    description: 'No tracking, no data collection. All processing happens on our servers without storing your information.'
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: 'Advanced Options',
    description: 'Proxy support, custom output paths, subtitle downloads, and batch processing capabilities.'
  },
  {
    icon: <PlayCircle className="h-8 w-8" />,
    title: 'Stream & Download',
    description: 'Preview content before downloading or stream directly to your preferred media player.'
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: 'Mobile Friendly',
    description: 'Fully responsive design that works perfectly on all devices - desktop, tablet, and mobile.'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Every Need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on the robust you-get engine with additional web interface enhancements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All features available now</span>
          </div>
        </div>
      </div>
    </section>
  );
}