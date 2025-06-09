import React from 'react';
import { ExternalLink } from 'lucide-react';

const sites = [
  { name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', types: ['Video', 'Audio'] },
  { name: 'Twitter/X', url: 'x.com', color: 'bg-black', types: ['Video', 'Image'] },
  { name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', types: ['Video', 'Image'] },
  { name: 'TikTok', url: 'tiktok.com', color: 'bg-black', types: ['Video'] },
  { name: 'Vimeo', url: 'vimeo.com', color: 'bg-blue-500', types: ['Video'] },
  { name: 'Facebook', url: 'facebook.com', color: 'bg-blue-600', types: ['Video'] },
  { name: 'Tumblr', url: 'tumblr.com', color: 'bg-indigo-600', types: ['Video', 'Image', 'Audio'] },
  { name: 'SoundCloud', url: 'soundcloud.com', color: 'bg-orange-500', types: ['Audio'] },
  { name: 'Dailymotion', url: 'dailymotion.com', color: 'bg-blue-400', types: ['Video'] },
  { name: 'Bilibili', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video'] },
  { name: 'Pinterest', url: 'pinterest.com', color: 'bg-red-600', types: ['Image'] },
  { name: 'Flickr', url: 'flickr.com', color: 'bg-purple-500', types: ['Image', 'Video'] },
];

export default function SupportedSites() {
  return (
    <section id="supported" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            100+ Supported Platforms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download from the most popular video, audio, and image sharing platforms on the internet
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sites.map((site) => (
            <div
              key={site.name}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 ${site.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {site.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{site.name}</h3>
                  <p className="text-sm text-gray-500">{site.url}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {site.types.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">And many more platforms including:</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full">Youku</span>
            <span className="bg-white px-3 py-1 rounded-full">Baidu</span>
            <span className="bg-white px-3 py-1 rounded-full">QQ Video</span>
            <span className="bg-white px-3 py-1 rounded-full">Sina</span>
            <span className="bg-white px-3 py-1 rounded-full">Sohu</span>
            <span className="bg-white px-3 py-1 rounded-full">网易</span>
            <span className="bg-white px-3 py-1 rounded-full">爱奇艺</span>
            <span className="bg-white px-3 py-1 rounded-full">优酷</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mt-16 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Don't see your favorite platform?</h3>
          <p className="text-blue-100 mb-4">
            Our universal extractor can handle most websites with downloadable content
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Try Any URL
          </button>
        </div>
      </div>
    </section>
  );
}