import React, { useState } from 'react';
import { Search, Info, Download, Play, Image, Music, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { apiService, MediaInfo } from '../services/api';

export default function Hero() {
  const { t } = useTranslation();
  const { user } = useUser();
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
      setError(err instanceof Error ? err.message : t('errors.analysisError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url || !selectedFormat || !user) return;
    
    setIsDownloading(true);
    setError('');
    setDownloadSuccess('');
    
    try {
      const result = await apiService.downloadMedia(url, user.id, selectedFormat);
      
      if (result.success && result.downloadUrl) {
        setDownloadSuccess(t('success.downloadCompleted', { filename: result.filename }));
        
        // Trigger file download
        const link = document.createElement('a');
        link.href = `http://localhost:3001${result.downloadUrl}`;
        link.download = result.filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.downloadError'));
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
            {t('hero.title')}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {t('hero.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('hero.placeholder')}
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
                  <span>{t('hero.analyzing')}</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>{t('hero.analyze')}</span>
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
                  <p className="text-sm text-gray-500">{t('common.source')}: {mediaInfo.site}</p>
                </div>
              </div>

              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hero.selectFormat')}
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

              {/* Download Section - Always visible but behavior changes based on auth */}
              <div className="space-y-4">
                <SignedIn>
                  {/* Authenticated users can download directly */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !selectedFormat}
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>{t('hero.downloading')}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>{t('hero.downloadNow')}</span>
                      </>
                    )}
                  </button>
                </SignedIn>

                <SignedOut>
                  {/* Non-authenticated users see login prompt */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Lock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('hero.authRequired.title')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('hero.authRequired.description')}
                    </p>
                    <div className="space-y-3">
                      <SignInButton mode="modal">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2">
                          <Download className="h-5 w-5" />
                          <span>{t('hero.authRequired.button')}</span>
                        </button>
                      </SignInButton>
                      <p className="text-xs text-gray-500">
                        {t('hero.authRequired.benefits')}
                      </p>
                    </div>
                  </div>
                </SignedOut>
              </div>
            </div>
          )}

          {/* Authentication Status Indicator */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <SignedIn>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{t('hero.authStatus.signedIn', { name: user?.firstName || user?.emailAddresses?.[0]?.emailAddress })}</span>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>{t('hero.authStatus.signedOut')}</span>
              </div>
            </SignedOut>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4 flex items-center justify-center space-x-1">
            <span>{t('hero.poweredBy.prefix')}</span>
            <a 
              href="https://github.com/soimort/you-get" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              you-get
            </a>
            <span className="text-red-500">♥</span>
            <span>{t('hero.poweredBy.suffix')}</span>
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            {t('hero.features', { returnObjects: true }).map((feature: string, index: number) => (
              <span key={index}>✓ {feature}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}