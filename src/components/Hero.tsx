import React, { useState } from 'react';
import { Search, Info, Download, Play, Image, Music, AlertCircle, CheckCircle, Heart, Clock, RefreshCw, Calendar, ExternalLink, List, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService, MediaInfo, TaskStatus } from '../services/api';
import { getUserDisplayInfo } from '../utils/fingerprint';
import { formatSmartTimestampWithUTC } from '../utils/dateUtils';

export default function Hero() {
  const { t } = useTranslation();
  const userInfo = getUserDisplayInfo();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedVideoFormat, setSelectedVideoFormat] = useState('');
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState(false);
  const [error, setError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [currentTask, setCurrentTask] = useState<TaskStatus | null>(null);
  const [taskPolling, setTaskPolling] = useState<number | null>(null);

  // Auto-hide timers
  const [successTimer, setSuccessTimer] = useState<number | null>(null);
  const [taskTimer, setTaskTimer] = useState<number | null>(null);

  // Track expanded categories for showing more formats
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toolDisplayName = 'yt-dlp';
  const toolUrl = 'https://github.com/yt-dlp/yt-dlp';

  // Helper function to toggle category expansion
  const toggleCategoryExpansion = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

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

      // Auto-select optimal format using smart selection
      if (info.formats.length > 0) {
        const optimalFormat = autoSelectOptimalFormat(info.formats);
        setSelectedFormat(optimalFormat);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.analysisError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle format selection
  const handleFormatSelection = (formatId: string, category: string) => {
    if (category === 'directDownload' || category === 'combined' || category === 'audio') {
      // For direct download, combined, or audio: single selection only
      setSelectedFormat(formatId);
      setSelectedVideoFormat('');
      setSelectedAudioFormat('');
    } else if (category === 'videoOnly') {
      // For video only: can combine with audio
      setSelectedVideoFormat(formatId);
      if (selectedAudioFormat) {
        setSelectedFormat(`${formatId}+${selectedAudioFormat}`);
      } else {
        setSelectedFormat(formatId);
      }
    }
  };

  // Helper function to handle audio selection for video-only formats
  const handleAudioSelection = (formatId: string) => {
    setSelectedAudioFormat(formatId);
    if (selectedVideoFormat) {
      setSelectedFormat(`${selectedVideoFormat}+${formatId}`);
    } else {
      setSelectedFormat(formatId);
    }
  };

  // Helper function to check if format is selected
  const isFormatSelected = (formatId: string, category: string) => {
    if (category === 'videoOnly') {
      return selectedVideoFormat === formatId;
    } else if (category === 'audio' && selectedVideoFormat) {
      return selectedAudioFormat === formatId;
    } else {
      return selectedFormat === formatId || selectedFormat.includes(formatId);
    }
  };
  const getFilteredFiles = (taskStatus: TaskStatus) => {
    if (!taskStatus.result?.files) return [];

    // Filter files based on mediaType logic:
    // - audio: show both audio and video files (video might be audio-only)
    // - video: show both audio and video files
    // - image: show only image files
    return taskStatus.result.files.filter(file => {
      if (taskStatus.mediaType === 'audio' || taskStatus.mediaType === 'video') {
        return file.type === 'audio' || file.type === 'video';
      }
      return file.type === taskStatus.mediaType;
    });
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const taskStatus = await apiService.getTaskStatus(taskId);
      setCurrentTask(taskStatus);

      if (taskStatus.status === 'completed') {
        // Get filtered files using the same logic as Dashboard
        const filteredFiles = getFilteredFiles(taskStatus);
        const fileCount = filteredFiles.length;

        // Get first file for display name
        const firstFile = filteredFiles[0] || taskStatus.result?.files?.[0];
        const displayName = firstFile?.filename || taskStatus.title || 'file';

        const message = fileCount > 1
          ? t('success.downloadCompletedMultiple', { count: fileCount })
          : t('success.downloadCompleted', { filename: displayName });

        setDownloadSuccess(message);

        // Auto-hide success message after 5 seconds
        const timer = setTimeout(() => {
          setDownloadSuccess('');
        }, 5000);
        setSuccessTimer(timer);

        // Automatically download all filtered files
        if (filteredFiles.length > 0) {
          if (filteredFiles.length > 1) {
            // For multi-file downloads, download all filtered files with staggered timing
            filteredFiles.forEach((file, index) => {
              setTimeout(() => {
                const link = document.createElement('a');
                link.href = apiService.getFileDownloadUrl(file.downloadPath);
                link.download = file.filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }, index * 500); // Stagger downloads by 500ms
            });
          } else {
            // Single file download
            const file = filteredFiles[0];
            const link = document.createElement('a');
            link.href = apiService.getFileDownloadUrl(file.downloadPath);
            link.download = file.filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else if (taskStatus.result?.files?.[0]) {
          // Fallback to first available file if no filtered files
          const file = taskStatus.result.files[0];
          const link = document.createElement('a');
          link.href = apiService.getFileDownloadUrl(file.downloadPath);
          link.download = file.filename;
          link.target = '_blank';
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
    if (!url || !selectedFormat || !userInfo) return;

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
      const result = await apiService.downloadMedia(url, userInfo.id, selectedFormat, undefined, undefined, downloadPlaylist);

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
        setSelectedVideoFormat('');
        setSelectedAudioFormat('');
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

  const getTypeIcon = (format: any) => {
    // Determine type based on yt-dlp format info
    if (format.vcodec === 'none' && format.acodec !== 'none') {
      return <Music className="h-4 w-4" />;
    } else if (format.acodec === 'none' && format.vcodec !== 'none') {
      return <Play className="h-4 w-4" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes((format.ext || '').toLowerCase())) {
      return <Image className="h-4 w-4" />;
    } else {
      return <Play className="h-4 w-4" />;
    }
  };

  const getFormatSize = (format: any) => {
    if (format.filesize && typeof format.filesize === 'number') {
      const sizeInMB = format.filesize / (1024 * 1024);
      return sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(format.filesize / 1024).toFixed(1)} KB`;
    } else if (format.filesize_approx && typeof format.filesize_approx === 'number') {
      const sizeInMB = format.filesize_approx / (1024 * 1024);
      return sizeInMB >= 1 ? `~${sizeInMB.toFixed(1)} MB` : `~${(format.filesize_approx / 1024).toFixed(1)} KB`;
    }
    return 'Unknown';
  };

  // Format categorization and display logic
  const categorizeFormats = (formats: any[]) => {
    const categories = {
      audio: [] as any[],
      videoOnly: [] as any[],
      directDownload: [] as any[],
      combined: [] as any[]
    };

    formats.forEach(format => {
      // Audio only formats
      if (format.vcodec === 'none' || format.resolution === 'audio only' ||
        (format.format_note && format.format_note.toLowerCase().includes('audio'))) {
        categories.audio.push(format);
      }
      // Video only formats (no audio codec or audio codec is 'none')
      else if (format.vcodec !== 'none' && format.acodec === 'none') {
        categories.videoOnly.push(format);
      }
      // Direct download formats (video + audio combined, typically MP4 with both codecs)
      else if (format.vcodec !== 'none' && format.acodec !== 'none' &&
        format.protocol === 'https' && !format.manifest_url) {
        categories.directDownload.push(format);
      }
      // Combined formats (video + audio, might include HLS)
      else if (format.vcodec !== 'none' && format.acodec !== 'none') {
        categories.combined.push(format);
      }
    });

    // Sort by quality
    categories.audio.sort((a, b) => (b.abr || 0) - (a.abr || 0));
    categories.videoOnly.sort((a, b) => (b.height || 0) - (a.height || 0));
    categories.directDownload.sort((a, b) => (b.height || 0) - (a.height || 0));
    categories.combined.sort((a, b) => (b.height || 0) - (a.height || 0));

    return categories;
  };

  // Helper function to auto-select optimal format
  const autoSelectOptimalFormat = (formats: any[]) => {
    const categories = categorizeFormats(formats);

    // Priority 1: Combined formats (video + audio in one file)
    if (categories.combined.length > 0) {
      return categories.combined[0].format_id;
    }

    // Priority 2: Direct download formats
    if (categories.directDownload.length > 0) {
      return categories.directDownload[0].format_id;
    }

    // Priority 3: Best video only + best audio (will be combined with +)
    if (categories.videoOnly.length > 0 && categories.audio.length > 0) {
      const bestVideo = categories.videoOnly[0];
      const bestAudio = categories.audio[0];
      setSelectedVideoFormat(bestVideo.format_id);
      setSelectedAudioFormat(bestAudio.format_id);
      return `${bestVideo.format_id}+${bestAudio.format_id}`;
    }

    // Fallback: first available format
    return formats[0]?.format_id || '';
  };

  const getFormatDisplayName = (format: any) => {
    const parts = [];

    // Audio only formats
    if (format.vcodec === 'none' || format.resolution === 'audio only') {
      parts.push('Audio Only');
      if (format.format_note && format.format_note !== 'Default') {
        parts.push(format.format_note);
      }
      if (format.abr) {
        parts.push(`${format.abr}kbps`);
      }
      if (format.acodec && format.acodec !== 'none') {
        parts.push(format.acodec.toUpperCase());
      }
      return parts.join(' • ');
    }

    // Video formats with resolution
    if (format.height && format.width) {
      parts.push(`${format.width}×${format.height}`);
    } else if (format.height) {
      parts.push(`${format.height}p`);
    }

    // Add quality indicator
    if (format.height >= 1080) {
      parts.push('Full HD');
    } else if (format.height >= 720) {
      parts.push('HD');
    } else if (format.height >= 480) {
      parts.push('SD');
    }

    // Add bitrate info
    if (format.tbr) {
      parts.push(`${Math.round(format.tbr)}kbps`);
    } else if (format.vbr) {
      parts.push(`${Math.round(format.vbr)}kbps`);
    }

    // Add codec info for technical users
    if (format.vcodec && format.vcodec !== 'none') {
      const codec = format.vcodec.includes('avc1') ? 'H.264' :
        format.vcodec.includes('vp9') ? 'VP9' :
          format.vcodec.includes('av01') ? 'AV1' :
            format.vcodec.split('.')[0].toUpperCase();
      parts.push(codec);
    }

    // Indicate if video-only (needs audio merge)
    if (format.acodec === 'none' && format.vcodec !== 'none') {
      parts.push('Video Only');
    }

    return parts.join(' • ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'audio': return <Music className="h-4 w-4" />;
      case 'directDownload': return <Download className="h-4 w-4" />;
      case 'videoOnly': return <Play className="h-4 w-4" />;
      case 'combined': return <Play className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'audio': return 'Audio Only';
      case 'directDownload': return 'Direct Download';
      case 'videoOnly': return 'Video Only';
      case 'combined': return 'Video + Audio Combined';
      default: return 'Other Formats';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'audio': return 'Extract audio only, perfect for music or podcasts';
      case 'directDownload': return 'Single file download with video and audio, works on all devices';
      case 'videoOnly': return 'High quality video (requires audio selection for merge)';
      case 'combined': return 'Video with audio included, may require processing';
      default: return '';
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
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20" aria-labelledby="hero-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 id="hero-title" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} role="search" aria-label="Media URL Analysis">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="url-input" className="sr-only">
                  {t('hero.placeholder')}
                </label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  aria-describedby={error ? "url-error" : undefined}
                  required
                />
              </div>
              <button
                type="submit"
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
            {/* {url && (
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
            )} */}

            {/* Enhanced Error Message */}
            {errorInfo && (
              <div id="url-error" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert"
                aria-live="polite">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mediaInfo.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-1">
                      <p>
                        <span className="font-medium">{t('common.source')}:</span> {mediaInfo.extractor_key || mediaInfo.extractor || 'Unknown'}
                      </p>
                      {mediaInfo.uploader && (
                        <p>
                          <span className="font-medium">Uploader:</span> {mediaInfo.uploader}
                        </p>
                      )}
                      {mediaInfo.duration && (
                        <p>
                          <span className="font-medium">Duration:</span> {Math.floor(mediaInfo.duration / 60)}:{(mediaInfo.duration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                      {mediaInfo.view_count && (
                        <p>
                          <span className="font-medium">Views:</span> {mediaInfo.view_count.toLocaleString()}
                        </p>
                      )}
                      {mediaInfo.upload_date && (
                        <p>
                          <span className="font-medium">Upload Date:</span> {new Date(mediaInfo.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString()}
                        </p>
                      )}
                      {mediaInfo.formats && (
                        <p>
                          <span className="font-medium">Available Formats:</span> {mediaInfo.formats.length}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 mb-6">
                  {/* Categorized Format Cards */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900">Download Options</h4>

                    {(() => {
                      const categories = categorizeFormats(mediaInfo.formats);
                      const categoryOrder = ['directDownload', 'combined', 'videoOnly', 'audio'];

                      return categoryOrder.map(categoryKey => {
                        const formats = categories[categoryKey as keyof typeof categories];
                        if (formats.length === 0) return null;

                        const isExpanded = expandedCategories[categoryKey] === true;

                        return (
                          <div key={categoryKey} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              {getCategoryIcon(categoryKey)}
                              <h5 className="font-medium text-gray-800">{getCategoryTitle(categoryKey)}</h5>
                              <span className="text-xs text-gray-500">({formats.length} options)</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{getCategoryDescription(categoryKey)}</p>

                            {/* Special handling for videoOnly + audio combination */}
                            {categoryKey === 'videoOnly' && categories.audio.length > 0 && (
                              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Info className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Smart Combination</span>
                                </div>
                                <p className="text-xs text-blue-700 mb-3">
                                  Select one video format + one audio format for automatic merging, or select video only.
                                </p>
                                {selectedVideoFormat && (
                                  <div className="text-xs text-blue-800 font-medium">
                                    Selected Video: {selectedVideoFormat}
                                    {selectedAudioFormat && ` + Audio: ${selectedAudioFormat}`}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {formats.slice(0, isExpanded ? formats.length : 6).map((format) => (
                                <div
                                  key={format.format_id}
                                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isFormatSelected(format.format_id, categoryKey)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                  onClick={() => {
                                    if (categoryKey === 'audio' && selectedVideoFormat) {
                                      handleAudioSelection(format.format_id);
                                    } else {
                                      handleFormatSelection(format.format_id, categoryKey);
                                    }
                                  }}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getTypeIcon(format)}
                                    <span className="font-medium text-sm">{format.ext?.toUpperCase() || 'Unknown'}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {format.format_id}
                                    </span>
                                    {isFormatSelected(format.format_id, categoryKey) && (
                                      <CheckCircle className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">{getFormatDisplayName(format)}</p>
                                    <p className="text-xs text-gray-500">{getFormatSize(format)}</p>
                                    {format.tbr && (
                                      <p className="text-xs text-gray-500">Total: {Math.round(format.tbr)}kbps</p>
                                    )}
                                    {categoryKey === 'videoOnly' && (
                                      <p className="text-xs text-orange-600 font-medium">Video only - needs audio</p>
                                    )}
                                    {categoryKey === 'directDownload' && (
                                      <p className="text-xs text-green-600 font-medium">Ready to download</p>
                                    )}
                                    {categoryKey === 'combined' && (
                                      <p className="text-xs text-blue-600 font-medium">Video + audio included</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {formats.length > 6 && (
                              <button
                                type="button"
                                onClick={() => toggleCategoryExpansion(categoryKey)}
                                className="flex items-center space-x-1 mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Show less</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span>Show {formats.length - 6} more options</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Download Section */}
                <div className="space-y-4">
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

                  {selectedFormat && (() => {
                    const selectedFormatObj = mediaInfo.formats.find(f => f.format_id === selectedFormat);
                    if (selectedFormatObj) {
                      return (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h5 className="font-medium text-gray-800 mb-2">Selected Format Details</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium text-gray-700">Format ID:</span> {selectedFormatObj.format_id}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Extension:</span> {selectedFormatObj.ext?.toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Quality:</span> {getFormatDisplayName(selectedFormatObj)}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Size:</span> {getFormatSize(selectedFormatObj)}
                            </div>
                            {selectedFormatObj.tbr && (
                              <div>
                                <span className="font-medium text-gray-700">Total Bitrate:</span> {Math.round(selectedFormatObj.tbr)} kbps
                              </div>
                            )}
                            {selectedFormatObj.vcodec && (
                              <div>
                                <span className="font-medium text-gray-700">Video Codec:</span> {selectedFormatObj.vcodec}
                              </div>
                            )}
                            {selectedFormatObj.acodec && (
                              <div>
                                <span className="font-medium text-gray-700">Audio Codec:</span> {selectedFormatObj.acodec}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4 flex items-center justify-center space-x-1">
            <span>{t('hero.poweredBy.prefix')}</span>
            <a
              href={toolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              {toolDisplayName}
            </a>
            <span>-</span>
            <span>{t('hero.poweredBy.suffix')}</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-500">
            {(t('hero.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
              <span key={index} className="whitespace-nowrap">✓ {feature}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}