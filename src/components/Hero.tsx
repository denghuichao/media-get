import React, { useState } from 'react';
import { Search, Info, Download, Play, Image, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService, MediaInfo } from '../services/api';

export default function Hero() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [error, setError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError('');
    setMediaInfo(null);
    setDownloadSuccess('');
    
    try {
      const info = await apiService.analyzeUrl(url);
      setMediaInfo(info);
      
      // Auto-select the first format
      if (info.formats.length > 0) {
        setSelectedFormat(info.formats[0].itag);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url || !selectedFormat) return;
    
    setIsDownloading(true);
    setError('');
    setDownloadSuccess('');
    
    try {
      const result = await apiService.downloadMedia(url, selectedFormat);
      
      if (result.success && result.downloadUrl) {
        setDownloadSuccess(`Download completed! File: ${result.filename}`);
        
        // Trigger file download
        const link = document.createElement('a');
        link.href = `http://localhost:3001${result.downloadUrl}`;
        link.download = result.filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Download Media from
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Anywhere</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract videos, audio, and images from 100+ popular websites with just a URL
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any video, audio, or image URL here..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!url || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {downloadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">{downloadSuccess}</span>
            </div>
          )}

          {mediaInfo && (
            <div className="border-t pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{mediaInfo.title}</h3>
                  <p className="text-sm text-gray-500">Source: {mediaInfo.site}</p>
                </div>
              </div>

              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Format & Quality
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {mediaInfo.formats.map((format) => (
                      <option key={format.itag} value={format.itag}>
                        {format.container.toUpperCase()} - {format.quality} ({format.size})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mediaInfo.formats.map((format) => (
                    <div
                      key={format.itag}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFormat === format.itag
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFormat(format.itag)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(format.type)}
                        <span className="font-medium text-sm">{format.container.toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{format.quality}</p>
                      <p className="text-xs text-gray-500">{format.size}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading || !selectedFormat}
                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download Now</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Powered by you-get - Trusted by thousands of users worldwide</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ No registration required</span>
            <span>✓ Free to use</span>
            <span>✓ High quality downloads</span>
          </div>
        </div>
      </div>
    </section>
  );
}