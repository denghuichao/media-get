import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Filter,
  Search,
  FileText,
  Play,
  Music,
  Image,
  RefreshCw,
  Lock,
  AlertCircle,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  Calendar,
  MapPin,
  AlertTriangle,
  Info
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { apiService, DownloadRecord } from '../services/api';
import { 
  formatTimestampWithUTC, 
  formatSmartTimestampWithUTC, 
  getUserTimezone, 
  getTimezoneOffset 
} from '../utils/dateUtils';

interface MediaPlayerProps {
  download: DownloadRecord;
  onClose: () => void;
}

function MediaPlayer({ download, onClose }: MediaPlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mediaRef = React.useRef<HTMLVideoElement | HTMLAudioElement>(null);

  const mediaUrl = `http://localhost:3001${download.downloadPath}`;
  const isVideo = download.type === 'video';
  const isAudio = download.type === 'audio';
  const isImage = download.type === 'image';

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const media = mediaRef.current;
    if (!media) return;

    media.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current;
    if (!media) return;

    const newTime = parseFloat(e.target.value);
    media.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {download.type === 'video' && <Play className="h-5 w-5 text-blue-600" />}
            {download.type === 'audio' && <Music className="h-5 w-5 text-green-600" />}
            {download.type === 'image' && <Image className="h-5 w-5 text-purple-600" />}
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{download.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{download.site} • {download.format.toUpperCase()}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatSmartTimestampWithUTC(download.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Media Content */}
        <div className="p-6">
          {isImage ? (
            <div className="text-center">
              <img
                src={mediaUrl}
                alt={download.title}
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Image load error:', e);
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video/Audio Element */}
              {isVideo ? (
                <video
                  ref={mediaRef as React.RefObject<HTMLVideoElement>}
                  src={mediaUrl}
                  className="w-full max-h-96 rounded-lg bg-black"
                  onError={(e) => {
                    console.error('Video load error:', e);
                  }}
                />
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                  <Music className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{download.title}</h4>
                  <p className="text-gray-600">{download.site}</p>
                  <audio
                    ref={mediaRef as React.RefObject<HTMLAudioElement>}
                    src={mediaUrl}
                    onError={(e) => {
                      console.error('Audio load error:', e);
                    }}
                  />
                </div>
              )}

              {/* Media Controls */}
              {(isVideo || isAudio) && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlay}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title={isPlaying ? t('mediaPlayer.controls.pause') : t('mediaPlayer.controls.play')}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title={isMuted ? t('mediaPlayer.controls.unmute') : t('mediaPlayer.controls.mute')}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          title={t('mediaPlayer.controls.volume')}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isVideo && (
                        <button
                          onClick={toggleFullscreen}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title={t('mediaPlayer.controls.fullscreen')}
                        >
                          <Maximize className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Download Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = mediaUrl;
                link.download = download.filename || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{t('mediaPlayer.downloadFile')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'processing' | 'pending' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'title'>('newest');
  const [selectedDownload, setSelectedDownload] = useState<DownloadRecord | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    invalid: 0
  });

  // Get user's timezone info
  const userTimezone = getUserTimezone();
  const timezoneOffset = getTimezoneOffset();

  // Load user downloads and stats
  useEffect(() => {
    if (user?.id) {
      loadDownloads();
      loadStats();
    }
  }, [user?.id]);

  // Smart auto-refresh: only refresh when there are active tasks and reduce frequency
  useEffect(() => {
    if (!user?.id) return;

    const hasActiveTasks = downloads.some(d => d.status === 'pending' || d.status === 'processing');
    
    if (hasActiveTasks) {
      // Reduced frequency: refresh every 10 seconds instead of 3 seconds
      const interval = setInterval(() => {
        loadDownloads();
        loadStats();
      }, 10000); // 10 seconds instead of 3

      return () => clearInterval(interval);
    }
  }, [downloads, user?.id]);

  const loadDownloads = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      const userDownloads = await apiService.getUserDownloads(user.id);
      setDownloads(userDownloads);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user?.id) return;
    
    try {
      const userStats = await apiService.getUserStats(user.id);
      setStats(userStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const deleteDownload = async (downloadId: string) => {
    if (!user?.id) return;
    
    try {
      await apiService.deleteDownload(user.id, downloadId);
      setDownloads(downloads.filter(d => d.id !== downloadId));
      loadStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.serverError'));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'invalid': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4 text-blue-600" />;
      case 'audio': return <Music className="h-4 w-4 text-green-600" />;
      case 'image': return <Image className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'invalid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDownloads = downloads
    .filter(download => {
      if (filter !== 'all' && download.status !== filter) return false;
      if (searchTerm && !download.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !download.site.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest': return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'title': return a.title.localeCompare(b.title);
        case 'size': return parseFloat(b.size) - parseFloat(a.size);
        default: return 0;
      }
    });

  const handleDownloadFile = (download: DownloadRecord) => {
    if (download.downloadPath && download.filename) {
      const link = document.createElement('a');
      link.href = `http://localhost:3001${download.downloadPath}`;
      link.download = download.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canPlay = (download: DownloadRecord) => {
    return download.status === 'completed' && 
           download.downloadPath && 
           ['video', 'audio', 'image'].includes(download.type);
  };

  const getStatusMessage = (download: DownloadRecord) => {
    switch (download.status) {
      case 'invalid':
        return t('dashboard.status.invalid');
      case 'failed':
        return download.error || t('dashboard.status.failed');
      default:
        return t(`dashboard.status.${download.status}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome', { name: user?.firstName || 'User' })}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <p>{t('dashboard.subtitle')}</p>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{userTimezone} ({timezoneOffset})</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.total')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.completed')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.downloading')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.pending')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.failed')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.invalid')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.invalid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* File Cleanup Notice */}
        {stats.invalid > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-800">{t('dashboard.cleanup.title')}</h4>
              <p className="text-orange-700 text-sm mt-1">
                {t('dashboard.cleanup.description', { count: stats.invalid })}
              </p>
              <p className="text-orange-600 text-xs mt-2">
                {t('dashboard.cleanup.reminder')}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('dashboard.filters.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="all">{t('dashboard.filters.allStatus')}</option>
                  <option value="completed">{t('dashboard.status.completed')}</option>
                  <option value="processing">{t('dashboard.status.downloading')}</option>
                  <option value="pending">{t('dashboard.status.pending')}</option>
                  <option value="failed">{t('dashboard.status.failed')}</option>
                  <option value="invalid">{t('dashboard.status.invalid')}</option>
                </select>
              </div>
            </div>

            {/* Sort and Refresh */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{t('dashboard.filters.sortBy')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="newest">{t('dashboard.filters.newest')}</option>
                  <option value="oldest">{t('dashboard.filters.oldest')}</option>
                  <option value="title">{t('dashboard.filters.title')}</option>
                  <option value="size">{t('dashboard.filters.size')}</option>
                </select>
              </div>
              
              <button
                onClick={() => {
                  loadDownloads();
                  loadStats();
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title={t('common.refresh')}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.history.title')}</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredDownloads.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.history.empty.title')}</h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== 'all' 
                    ? t('dashboard.history.empty.description')
                    : t('dashboard.history.empty.noDownloads')
                  }
                </p>
              </div>
            ) : (
              filteredDownloads.map((download) => (
                <div key={download.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Download Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {download.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                            {getStatusIcon(download.status)}
                            <span className="ml-1 capitalize">{getStatusMessage(download)}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            {getTypeIcon(download.type)}
                            <span>{download.site}</span>
                          </span>
                          <span>•</span>
                          <span>{download.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{download.quality}</span>
                          <span>•</span>
                          <span>{download.size}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span title={formatTimestampWithUTC(download.timestamp, { format: 'absolute' })}>
                              {formatTimestampWithUTC(download.timestamp, { format: 'relative' })}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar for processing tasks */}
                        {download.status === 'processing' && download.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{download.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${download.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Error message for failed tasks */}
                        {download.status === 'failed' && download.error && (
                          <div className="mt-2 text-xs text-red-600">
                            Error: {download.error}
                          </div>
                        )}

                        {/* Invalid status message */}
                        {download.status === 'invalid' && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{t('dashboard.status.invalidMessage')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Play Button */}
                      {canPlay(download) && (
                        <button 
                          onClick={() => setSelectedDownload(download)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title={t('dashboard.actions.play')}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Download Button */}
                      {download.status === 'completed' && download.downloadPath && (
                        <button 
                          onClick={() => handleDownloadFile(download)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title={t('dashboard.actions.download')}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => deleteDownload(download.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title={t('dashboard.actions.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Media Player Modal */}
      {selectedDownload && (
        <MediaPlayer
          download={selectedDownload}
          onClose={() => setSelectedDownload(null)}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <Lock className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                {t('dashboard.authRequired.title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('dashboard.authRequired.description')}
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <SignInButton mode="modal">
                <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                  {t('dashboard.authRequired.button')}
                </button>
              </SignInButton>
              <p className="text-xs text-gray-500">
                {t('dashboard.authRequired.note')}
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}