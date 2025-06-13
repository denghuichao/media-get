import React, { useState } from 'react';
import { Search, Info, Download, Play, Image, Music, AlertCircle, CheckCircle, Lock, Heart, Clock, RefreshCw, Calendar, ExternalLink, List } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { apiService, MediaInfo, TaskStatus } from '../services/api';
import { formatTimestampWithUTC, formatSmartTimestampWithUTC } from '../utils/dateUtils';

export default function Hero() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState(false);
  const [error, setError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [currentTask, setCurrentTask] = useState<TaskStatus | null>(null);
  const [taskPolling, setTaskPolling] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide timers
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);
  const [taskTimer, setTaskTimer] = useState<NodeJS.Timeout | null>(null);

  // Helper function to detect if URL might be a playlist
  const isPlaylistUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      const searchParams = urlObj.searchParams;
      
      // YouTube playlist indicators
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return searchParams.has('list') || 
               pathname.includes('/playlist') ||
               pathname.includes('/channel') ||
               pathname.includes('/user');
      }
      
      // Bilibili playlist indicators
      if (hostname.includes('bilibili.com')) {
        return pathname.includes('/favlist') ||
               pathname.includes('/medialist') ||
               pathname.includes('/collection');
      }
      
      // Other common playlist patterns
      return pathname.includes('playlist') ||
             pathname.includes('album') ||
             pathname.includes('collection') ||
             searchParams.has('playlist') ||
             searchParams.has('album');
    } catch {
      return false;
    }
  };

  // Helper function to detect if error is related to login cookies
  const isLoginCookieError = (errorMessage: string): boolean => {
    const cookieKeywords = [
      'login cookies',
      'need login',
      'authentication required',
      'sign in required',
      'login required',
      'cookies.txt',
      'need to login',
      'requires login'
    ];
    
    return cookieKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Helper function to get platform name from URL
  const getPlatformFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
      if (hostname.includes('bilibili.com')) return 'Bilibili';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter/X';
      if (hostname.includes('instagram.com')) return 'Instagram';
      if (hostname.includes('tiktok.com')) return 'TikTok';
      if (hostname.includes('facebook.com')) return 'Facebook';
      if (hostname.includes('vimeo.com')) return 'Vimeo';
      
      return hostname.replace('www.', '');
    } catch {
      return 'the website';
    }
  };

  // Helper function to get platform login URL
  const getPlatformLoginUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'https://accounts.google.com/signin';
      if (hostname.includes('bilibili.com')) return 'https://passport.bilibili.com/login';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'https://twitter.com/login';
      if (hostname.includes('instagram.com')) return 'https://www.instagram.com/accounts/login/';
      if (hostname.includes('tiktok.com')) return 'https://www.tiktok.com/login';
      if (hostname.includes('facebook.com')) return 'https://www.facebook.com/login';
      if (hostname.includes('vimeo.com')) return 'https://vimeo.com/log_in';
      
      return `https://${hostname}/login`;
    } catch {
      return '#';
    }
  };

  // Helper function to format error message for display
  const formatErrorForDisplay = (errorMessage: string): { message: string; isLong: boolean; needsLogin: boolean; platform: string; loginUrl: string } => {
    if (!errorMessage) {
      return { 
        message: 'Unknown error occurred', 
        isLong: false, 
        needsLogin: false, 
        platform: '', 
        loginUrl: '' 
      };
    }

    // Check if it's a login cookie error
    const needsLogin = isLoginCookieError(errorMessage);
    const platform = needsLogin ? getPlatformFromUrl(url) : '';
    const loginUrl = needsLogin ? getPlatformLoginUrl(url) : '';

    // Clean up the error message
    let cleanMessage = errorMessage;
    
    // Remove common prefixes
    cleanMessage = cleanMessage.replace(/^(Error: |Download failed: |Analysis error: )/i, '');
    
    // For login cookie errors, provide a cleaner message
    if (needsLogin) {
      cleanMessage = `This content requires you to be logged in to ${platform}. Please sign in to ${platform} first, then try again.`;
    }
    
    // Check if message is too long (more than 150 characters)
    const isLong = cleanMessage.length > 150;
    
    // If too long, truncate and add ellipsis
    if (isLong && !needsLogin) {
      cleanMessage = cleanMessage.substring(0, 150) + '...';
    }

    return {
      message: cleanMessage,
      isLong: errorMessage.length > 150,
      needsLogin,
      platform,
      loginUrl
    };
  };

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError('');
    setMediaInfo(null);
    setDownloadSuccess('');
    setCurrentTask(null);
    
    // Clear any existing timers
    if (successTimer) {
      clearTimeout(successTimer);
      setSuccessTimer(null);
    }
    if (taskTimer) {
      clearTimeout(taskTimer);
      setTaskTimer(null);
    }
    
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

  const pollTaskStatus = async (taskId: string) => {
    try {
      const taskStatus = await apiService.getTaskStatus(taskId);
      setCurrentTask(taskStatus);
      
      if (taskStatus.status === 'completed') {
        const fileCount = taskStatus.result?.files?.length || 1;
        const message = fileCount > 1 
          ? t('success.downloadCompletedMultiple', { count: fileCount })
          : t('success.downloadCompleted', { filename: taskStatus.filename || 'file' });
        
        setDownloadSuccess(message);
        
        // Auto-hide success message after 5 seconds
        const timer = setTimeout(() => {
          setDownloadSuccess('');
        }, 5000);
        setSuccessTimer(timer);
        
        // Trigger file download for single files
        if (taskStatus.downloadUrl && fileCount === 1) {
          const link = document.createElement('a');
          link.href = apiService.getFileDownloadUrl(taskStatus.downloadUrl);
          link.download = taskStatus.filename || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        // Stop polling
        if (taskPolling) {
          clearInterval(taskPolling);
          setTaskPolling(null);
        }
        setIsSubmitting(false);

        // Auto-hide task status after 8 seconds (longer than success message)
        const taskHideTimer = setTimeout(() => {
          setCurrentTask(null);
        }, 8000);
        setTaskTimer(taskHideTimer);
        
      } else if (taskStatus.status === 'failed') {
        setError(taskStatus.error || t('errors.downloadError'));
        
        // Stop polling
        if (taskPolling) {
          clearInterval(taskPolling);
          setTaskPolling(null);
        }
        setIsSubmitting(false);

        // Auto-hide task status after 8 seconds
        const taskHideTimer = setTimeout(() => {
          setCurrentTask(null);
        }, 8000);
        setTaskTimer(taskHideTimer);
      }
      // Continue polling for pending/processing status
    } catch (err) {
      console.error('Error polling task status:', err);
    }
  };

  const handleDownload = async () => {
    if (!url || !selectedFormat || !user) return;
    
    setIsSubmitting(true);
    setError('');
    setDownloadSuccess('');
    setCurrentTask(null);
    
    // Clear any existing timers
    if (successTimer) {
      clearTimeout(successTimer);
      setSuccessTimer(null);
    }
    if (taskTimer) {
      clearTimeout(taskTimer);
      setTaskTimer(null);
    }
    
    try {
      const result = await apiService.downloadMedia(url, user.id, selectedFormat, undefined, undefined, downloadPlaylist);
      
      if (result.success && result.taskId) {
        // Show success message immediately
        setDownloadSuccess(downloadPlaylist ? t('success.playlistDownloadStarted') : t('success.downloadStarted'));
        
        // Auto-hide success message after 4 seconds
        const timer = setTimeout(() => {
          setDownloadSuccess('');
        }, 4000);
        setSuccessTimer(timer);
        
        // Reset form fields
        setUrl('');
        setSelectedFormat('');
        setMediaInfo(null);
        setDownloadPlaylist(false);
        
        setCurrentTask({
          id: result.taskId,
          status: 'pending',
          progress: 0,
          title: result.task?.title || 'Unknown',
          site: result.task?.site || 'Unknown',
          url: result.task?.url || url,
          mediaType: 'video',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPlaylist: downloadPlaylist
        });
        
        // Start polling for task status
        const polling = setInterval(() => {
          pollTaskStatus(result.taskId!);
        }, 2000); // Poll every 2 seconds
        
        setTaskPolling(polling);
        
        // Set a timeout to stop polling after 10 minutes
        setTimeout(() => {
          if (polling) {
            clearInterval(polling);
            setTaskPolling(null);
            setIsSubmitting(false);
            setError(t('errors.downloadError') + ' (timeout)');
          }
        }, 600000); // 10 minutes
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.downloadError'));
      setIsSubmitting(false);
    }
  };

  // Cleanup polling and timers on unmount
  React.useEffect(() => {
    return () => {
      if (taskPolling) {
        clearInterval(taskPolling);
      }
      if (successTimer) {
        clearTimeout(successTimer);
      }
      if (taskTimer) {
        clearTimeout(taskTimer);
      }
    };
  }, [taskPolling, successTimer, taskTimer]);

  // Auto-detect playlist and update checkbox
  React.useEffect(() => {
    if (url) {
      setDownloadPlaylist(isPlaylistUrl(url));
    }
  }, [url]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format error for display
  const errorInfo = error ? formatErrorForDisplay(error) : null;

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

          {/* Playlist Download Option */}
          {url && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={downloadPlaylist}
                  onChange={(e) => setDownloadPlaylist(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  <List className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {t('hero.downloadPlaylist')}
                  </span>
                </div>
              </label>
              <p className="text-xs text-blue-600 mt-1 ml-7">
                {downloadPlaylist 
                  ? t('hero.playlistEnabled') 
                  : t('hero.playlistDisabled')
                }
              </p>
            </div>
          )}

          {/* Enhanced Error Message */}
          {errorInfo && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-red-700">
                    {errorInfo.message}
                  </div>
                  
                  {/* Login reminder for cookie errors */}
                  {errorInfo.needsLogin && errorInfo.loginUrl !== '#' && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-800 text-sm">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Login Required</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        Please sign in to {errorInfo.platform} in your browser first, then try downloading again.
                      </p>
                      <a
                        href={errorInfo.loginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Sign in to {errorInfo.platform}</span>
                      </a>
                    </div>
                  )}
                  
                  {/* Show full error details for long errors */}
                  {errorInfo.isLong && !errorInfo.needsLogin && (
                    <details className="mt-2">
                      <summary className="text-red-600 text-sm cursor-pointer hover:text-red-800">
                        Show full error details
                      </summary>
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-mono whitespace-pre-wrap">
                        {error}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {downloadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 animate-in fade-in duration-300">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">{downloadSuccess}</span>
            </div>
          )}

          {/* Task Status */}
          {currentTask && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in duration-300">
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(currentTask.status)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{currentTask.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{currentTask.site} • {currentTask.status}</span>
                    {currentTask.isPlaylist && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <List className="h-3 w-3" />
                          <span>Playlist</span>
                        </div>
                      </>
                    )}
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatSmartTimestampWithUTC(currentTask.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {currentTask.status === 'processing' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{currentTask.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentTask.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {currentTask.status === 'completed' && currentTask.result?.files && currentTask.result.files.length > 1 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center space-x-2 text-green-800 text-sm">
                    <List className="h-4 w-4" />
                    <span className="font-medium">{currentTask.result.files.length} files downloaded</span>
                  </div>
                  <p className="text-green-700 text-xs mt-1">
                    Check your dashboard to access all downloaded files.
                  </p>
                </div>
              )}
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
                    disabled={isSubmitting || !selectedFormat}
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>{downloadPlaylist ? t('hero.downloadingPlaylist') : t('hero.downloading')}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>{downloadPlaylist ? t('hero.downloadPlaylistNow') : t('hero.downloadNow')}</span>
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
            <span>-</span>
            <span>{t('hero.poweredBy.suffix')}</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
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