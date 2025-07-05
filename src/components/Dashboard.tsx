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
  AlertCircle,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  Calendar,
  MapPin,
  Info,
  AlertTriangle,
  List,
  FolderOpen,
  Files
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService, DownloadRecord } from '../services/api';
import { getUserDisplayInfo } from '../utils/fingerprint';
import {
  formatTimestampWithUTC,
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
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mediaRef = React.useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const imageTimeoutRef = React.useRef<number | null>(null);
  const imageFailureTimeoutRef = React.useRef<number | null>(null);

  // Ensure currentFileIndex is within bounds
  const validFileIndex = Math.max(0, Math.min(currentFileIndex, (download.files?.length || 1) - 1));

  // Only reset currentFileIndex if it's actually out of bounds (not when user is making valid selections)
  useEffect(() => {
    const maxIndex = (download.files?.length || 1) - 1;
    if (currentFileIndex < 0 || currentFileIndex > maxIndex) {
      console.log('Resetting out-of-bounds file index:', currentFileIndex, 'to', validFileIndex);
      setCurrentFileIndex(validFileIndex);
    }
  }, [download.files?.length]); // Only depend on files length, not currentFileIndex

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Get current file or use primary download
  const currentFile = download.files && download.files.length > 0
    ? download.files[validFileIndex]
    : {
      filename: download.filename || 'download',
      downloadPath: download.downloadPath || '',
      type: download.type,
      format: download.format
    };

  const mediaUrl = apiService.getFileDownloadUrl(currentFile.downloadPath);
  const isVideo = currentFile.type === 'video';
  const isAudio = currentFile.type === 'audio';
  const isImage = currentFile.type === 'image';

  // Reset states when file changes
  useEffect(() => {
    console.log('=== FILE CHANGE EFFECT ===');
    console.log('currentFileIndex:', currentFileIndex);
    console.log('validFileIndex:', validFileIndex);
    console.log('mediaUrl:', mediaUrl);
    console.log('currentFile.type:', currentFile.type);
    console.log('isImage:', isImage);

    // Don't set loading=true for images immediately, let the image load naturally
    if (!isImage) {
      setIsLoading(true);
    }
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Clear any existing timeouts
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }
    if (imageFailureTimeoutRef.current) {
      clearTimeout(imageFailureTimeoutRef.current);
      imageFailureTimeoutRef.current = null;
    }

    // For images, set a delayed timeout to show loading if needed
    if (isImage) {
      console.log('Setting delayed image timeout for:', mediaUrl);

      // Check if image is already cached and loaded
      const img = document.createElement('img') as HTMLImageElement;
      img.src = mediaUrl;

      if (img.complete && img.naturalWidth > 0) {
        console.log('Image already cached, no loading needed');
        setIsLoading(false);
        setHasError(false);
      } else {
        // Image not cached, set up timeout logic
        imageTimeoutRef.current = setTimeout(() => {
          console.log('Image taking too long, showing loading...');
          setIsLoading(true);
        }, 1000); // Show loading after 1 second if image hasn't loaded

        // Set ultimate timeout for failure
        imageFailureTimeoutRef.current = setTimeout(() => {
          console.warn('Image load timeout for:', mediaUrl);
          setIsLoading(false);
          setHasError(true);
        }, 10000); // 10 second ultimate timeout
      }
    }

    return () => {
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
        imageTimeoutRef.current = null;
      }
      if (imageFailureTimeoutRef.current) {
        clearTimeout(imageFailureTimeoutRef.current);
        imageFailureTimeoutRef.current = null;
      }
    };
  }, [currentFileIndex, mediaUrl, currentFile.filename, isImage]);

  // Setup media event listeners (only for video/audio)
  useEffect(() => {
    const media = mediaRef.current;
    if (!media || isImage) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);
    const handleLoadStart = () => {
      console.log('Media load started for:', mediaUrl);
      setIsLoading(true);
    };
    const handleCanPlay = () => {
      console.log('Media can play:', mediaUrl);
      setIsLoading(false);
      setHasError(false);
    };
    const handleError = () => {
      console.error('Media load error for:', mediaUrl);
      setIsLoading(false);
      setHasError(true);
    };
    const handleEnded = () => setIsPlaying(false);

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('loadstart', handleLoadStart);
    media.addEventListener('canplay', handleCanPlay);
    media.addEventListener('error', handleError);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('loadstart', handleLoadStart);
      media.removeEventListener('canplay', handleCanPlay);
      media.removeEventListener('error', handleError);
      media.removeEventListener('ended', handleEnded);
    };
  }, [mediaUrl, isImage]);

  const togglePlay = async () => {
    const media = mediaRef.current;
    if (!media || hasError) return;

    try {
      if (isPlaying) {
        media.pause();
        setIsPlaying(false);
      } else {
        await media.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play error:', error);
      setHasError(true);
    }
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

  const downloadCurrentFile = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = currentFile.filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllFiles = () => {
    if (download.files && download.files.length > 1) {
      download.files.forEach((file, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = apiService.getFileDownloadUrl(file.downloadPath);
          link.download = file.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 500); // Stagger downloads by 500ms
      });
    } else {
      downloadCurrentFile();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {download.type === 'video' && <Play className="h-5 w-5 text-blue-600" />}
            {download.type === 'audio' && <Music className="h-5 w-5 text-green-600" />}
            {download.type === 'image' && <Image className="h-5 w-5 text-purple-600" />}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{download.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                <span>{download.site} • {currentFile.format.toUpperCase()}</span>
                {download.mediaInfo?.format_id && (
                  <>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">ID: {download.mediaInfo.format_id}</span>
                  </>
                )}
                {download.files && download.files.length > 1 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Files className="h-3 w-3" />
                      <span>{download.files.length} files</span>
                    </div>
                  </>
                )}
                {download.mediaInfo?.uploader && (
                  <>
                    <span>•</span>
                    <span>by {download.mediaInfo.uploader}</span>
                  </>
                )}
              </div>
              {/* Additional metadata row */}
              {(download.mediaInfo?.duration || download.mediaInfo?.view_count || download.mediaInfo?.upload_date) && (
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1 flex-wrap">
                  {download.mediaInfo.duration && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>{Math.floor(download.mediaInfo.duration / 60)}:{(download.mediaInfo.duration % 60).toString().padStart(2, '0')}</span>
                    </>
                  )}
                  {download.mediaInfo.view_count && (
                    <>
                      {download.mediaInfo.duration && <span>•</span>}
                      <span>{download.mediaInfo.view_count.toLocaleString()} views</span>
                    </>
                  )}
                  {download.mediaInfo.upload_date && (
                    <>
                      {(download.mediaInfo.duration || download.mediaInfo.view_count) && <span>•</span>}
                      <span>Uploaded: {new Date(download.mediaInfo.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
            title="Close (ESC)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* File Navigation for Multi-file Downloads */}
        {download.files && download.files.length > 1 && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 mb-2">
              <List className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                File {validFileIndex + 1} of {download.files.length}
              </span>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {download.files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFileIndex(index)}
                  className={`flex-shrink-0 px-3 py-2 text-xs rounded-lg border transition-colors ${index === validFileIndex
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-1">
                    {file.type === 'video' && <Play className="h-3 w-3" />}
                    {file.type === 'audio' && <Music className="h-3 w-3" />}
                    {file.type === 'image' && <Image className="h-3 w-3" />}
                    <span className="truncate max-w-20">{file.filename}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Media Content */}
          <div className="p-6">
            {isImage ? (
              <div className="text-center">
                {hasError ? (
                  // Error state for images - replace the image area
                  <div className="w-full min-h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="text-center p-8 max-w-md max-h-full overflow-y-auto">
                      {/* Error Icon */}
                      <div className="relative mb-4">
                        <div className="bg-red-100 rounded-full p-4 mx-auto w-fit">
                          <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                      </div>

                      {/* Main Error Message */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Image Loading Failed
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Unable to display this image in your browser
                      </p>

                      {/* Possible Causes */}
                      <div className="mb-4 text-left">
                        <p className="text-xs font-medium text-gray-700 mb-2 text-center">Possible causes:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            <span>Image format not supported by browser</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            <span>Network connectivity issues</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            <span>CORS or server configuration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            <span>File may be corrupted</span>
                          </li>
                        </ul>
                      </div>

                      {/* Technical Details (Collapsible) */}
                      <details className="mt-4 text-left">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                          Technical Details
                        </summary>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 break-all font-mono max-h-32 overflow-y-auto">
                          {mediaUrl}
                        </div>
                      </details>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      key={`${validFileIndex}-${mediaUrl}`} // Force re-render on file change
                      src={mediaUrl}
                      alt={download.title}
                      className="max-w-full max-h-80 mx-auto rounded-lg shadow-lg"
                      onLoadStart={() => {
                        console.log('=== IMAGE LOAD START ===');
                        console.log('Image URL:', mediaUrl);
                        // Don't set loading here, let the delayed timeout handle it
                      }}
                      onError={(e) => {
                        console.error('=== IMAGE ERROR ===');
                        console.error('Image URL:', mediaUrl);
                        console.error('Error event:', e);
                        console.error('Error type:', e.type);
                        console.error('Image element:', e.target);
                        console.error('Natural dimensions:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);

                        // Clear all timeouts on error
                        if (imageTimeoutRef.current) {
                          clearTimeout(imageTimeoutRef.current);
                          imageTimeoutRef.current = null;
                        }
                        if (imageFailureTimeoutRef.current) {
                          clearTimeout(imageFailureTimeoutRef.current);
                          imageFailureTimeoutRef.current = null;
                        }

                        setHasError(true);
                        setIsLoading(false);
                      }}
                      onLoad={(e) => {
                        console.log('=== IMAGE LOADED ===');
                        console.log('Image URL:', mediaUrl);
                        console.log('Natural dimensions:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
                        console.log('Image element:', e.target);

                        // Clear all timeouts on successful load
                        if (imageTimeoutRef.current) {
                          clearTimeout(imageTimeoutRef.current);
                          imageTimeoutRef.current = null;
                        }
                        if (imageFailureTimeoutRef.current) {
                          clearTimeout(imageFailureTimeoutRef.current);
                          imageFailureTimeoutRef.current = null;
                        }

                        setIsLoading(false);
                        setHasError(false);
                      }}
                    />

                    {/* Loading overlay - only show if still loading after a delay */}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                        <div className="text-center p-4">
                          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Loading image...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video/Audio Element */}
                <div className="relative">
                  {hasError ? (
                    // Error state - replace the entire video/audio area
                    <div className="w-full min-h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="text-center p-8 max-w-md max-h-full overflow-y-auto">
                        {/* Error Icon */}
                        <div className="relative mb-4">
                          <div className="bg-red-100 rounded-full p-4 mx-auto w-fit">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                          </div>
                        </div>

                        {/* Main Error Message */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Media Playback Failed
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Unable to play this media file in your browser
                        </p>

                        {/* Possible Causes */}
                        <div className="mb-4 text-left">
                          <p className="text-xs font-medium text-gray-700 mb-2 text-center">Possible causes:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">•</span>
                              <span>Video format not supported by browser</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">•</span>
                              <span>MPEG transport stream (requires conversion)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">•</span>
                              <span>Network connectivity issues</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">•</span>
                              <span>CORS or server configuration</span>
                            </li>
                          </ul>
                        </div>

                        {/* Technical Details (Collapsible) */}
                        <details className="mt-4 text-left">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                            Technical Details
                          </summary>
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 break-all font-mono max-h-32 overflow-y-auto">
                            {mediaUrl}
                          </div>
                        </details>
                      </div>
                    </div>
                  ) : (
                    // Normal media display
                    <>
                      {isVideo ? (
                        <video
                          key={`${validFileIndex}-${mediaUrl}`} // Force re-render on file change
                          ref={mediaRef as React.RefObject<HTMLVideoElement>}
                          src={mediaUrl}
                          className="w-full max-h-80 rounded-lg bg-black"
                          controls={false} // We'll use custom controls
                          preload="metadata"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('Video load error:', e);
                            console.error('Video URL:', mediaUrl);
                            const videoElement = e.target as HTMLVideoElement;
                            console.error('Video error details:', videoElement.error);
                            setHasError(true);
                          }}
                          onLoadStart={() => {
                            console.log('Video load started for:', mediaUrl);
                            setIsLoading(true);
                          }}
                          onCanPlay={() => {
                            console.log('Video can play:', mediaUrl);
                            setIsLoading(false);
                            setHasError(false);
                          }}
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center relative">
                          <Music className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{download.title}</h4>
                          <p className="text-gray-600">{download.site}</p>
                          <audio
                            key={`${validFileIndex}-${mediaUrl}`} // Force re-render on file change
                            ref={mediaRef as React.RefObject<HTMLAudioElement>}
                            src={mediaUrl}
                            preload="metadata"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error('Audio load error:', e);
                              setHasError(true);
                            }}
                          />
                        </div>
                      )}

                      {/* Loading Overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <RefreshCw className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}

                      {/* Custom Play Button Overlay for Video */}
                      {isVideo && !isPlaying && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={togglePlay}
                            className="bg-black bg-opacity-70 hover:bg-opacity-80 text-white rounded-full p-4 transition-all transform hover:scale-110"
                          >
                            <Play className="h-12 w-12 ml-1" fill="currentColor" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Media Controls */}
                {(isVideo || isAudio) && !hasError && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                        }}
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
                          disabled={isLoading || hasError}
                          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={isPlaying ? t('mediaPlayer.controls.pause') : t('mediaPlayer.controls.play')}
                        >
                          {isLoading ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                          )}
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
          </div>

          {/* Download Buttons - Fixed at bottom */}
          <div className="p-6 pt-4 border-t border-gray-200 space-y-3 flex-shrink-0">
            {/* Download Current File */}
            <button
              onClick={downloadCurrentFile}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>
                {download.files && download.files.length > 1
                  ? `Download Current File (${currentFile.filename})`
                  : t('mediaPlayer.downloadFile')
                }
              </span>
            </button>

            {/* Download All Files (for multi-file downloads) */}
            {download.files && download.files.length > 1 && (
              <button
                onClick={downloadAllFiles}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Files className="h-4 w-4" />
                <span>Download All Files ({download.files.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { t } = useTranslation();
  const userInfo = getUserDisplayInfo();
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

  // Helper function to get clean status message for status tags - ONLY STATUS
  const getCleanStatusMessage = (download: DownloadRecord): string => {
    switch (download.status) {
      case 'completed':
        return t('dashboard.status.completed');
      case 'processing':
        return t('dashboard.status.downloading');
      case 'pending':
        return t('dashboard.status.pending');
      case 'invalid':
        return t('dashboard.status.invalid');
      case 'failed':
        return t('dashboard.status.failed');
      default:
        return download.status;
    }
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

  // Helper function to get brief, user-friendly error message with website name
  const getBriefErrorMessage = (errorMessage: string, url?: string): string => {
    if (!errorMessage) {
      return 'Download failed due to an unknown error';
    }

    const message = errorMessage.toLowerCase();
    const platform = url ? getPlatformFromUrl(url) : 'the website';

    // Check for common error patterns and return brief messages with platform name
    if (message.includes('login cookies') || message.includes('need login') || message.includes('authentication required')) {
      return `Login required - Please sign in to ${platform} first and then retry later`;
    }

    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return 'Network connection error - Please check your internet connection';
    }

    if (message.includes('not found') || message.includes('404')) {
      return 'Content not found - The video may have been removed or is private';
    }

    if (message.includes('permission denied') || message.includes('403') || message.includes('unauthorized')) {
      return `Access denied - You may need to sign in to ${platform} to view this content`;
    }

    if (message.includes('unsupported') || message.includes('not supported')) {
      return 'This website is not supported';
    }

    if (message.includes('invalid url') || message.includes('malformed url')) {
      return 'Invalid URL format';
    }

    if (message.includes('oops') || message.includes('something went wrong')) {
      return 'Download failed - Please try again';
    }

    // If no specific pattern matches, return a generic message
    return 'Download failed - Please try again or check if the URL is valid';
  };

  // Load user downloads and stats
  useEffect(() => {
    if (userInfo?.id) {
      loadDownloads();
      loadStats();
    }
  }, [userInfo?.id]);

  // Smart auto-refresh: only refresh when there are active tasks and reduce frequency
  useEffect(() => {
    if (!userInfo?.id) return;

    const hasActiveTasks = downloads.some(d => d.status === 'pending' || d.status === 'processing');

    if (hasActiveTasks) {
      // Reduced frequency: refresh every 10 seconds instead of 3 seconds
      const interval = setInterval(() => {
        loadDownloads();
        loadStats();
      }, 10000); // 10 seconds instead of 3

      return () => clearInterval(interval);
    }
  }, [downloads, userInfo?.id]);

  const loadDownloads = async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      setError('');
      const userDownloads = await apiService.getUserDownloads(userInfo.id);
      setDownloads(userDownloads);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userInfo?.id) return;

    try {
      const userStats = await apiService.getUserStats(userInfo.id);
      setStats(userStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const deleteDownload = async (downloadId: string) => {
    if (!userInfo?.id) return;

    try {
      await apiService.deleteDownload(userInfo.id, downloadId);
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
      case 'invalid': return <AlertCircle className="h-4 w-4 text-orange-500" />;
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
    if (download.files && download.files.length > 1) {
      // For multi-file downloads, download all files
      download.files.forEach((file, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = apiService.getFileDownloadUrl(file.downloadPath);
          link.download = file.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 500); // Stagger downloads by 500ms
      });
    } else if (download.downloadPath && download.filename) {
      // Single file download
      const link = document.createElement('a');
      link.href = apiService.getFileDownloadUrl(download.downloadPath);
      link.download = download.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Fixed canPlay function to properly detect playable downloads
  const canPlay = (download: DownloadRecord) => {
    // Must be completed status
    if (download.status !== 'completed') {
      return false;
    }

    // Must be video, audio, or image type
    if (!['video', 'audio', 'image'].includes(download.type)) {
      return false;
    }

    // Must have either downloadPath OR files array with at least one file
    const hasDownloadPath = download.downloadPath && download.filename;
    const hasFiles = download.files && download.files.length > 0;

    return hasDownloadPath || hasFiles;
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
            {t('dashboard.welcome', { name: '用户' })}
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

        {/* Stats Cards - Fixed Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.total')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.completed')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.downloading')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.processing}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.pending')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.failed')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.failed}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.invalid')}</p>
                  <p className="text-xl font-bold text-gray-900">{stats.invalid}</p>
                </div>
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
              filteredDownloads.map((download) => {
                return (
                  <div key={download.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        {/* Download Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {download.title}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                              {getStatusIcon(download.status)}
                              <span className="ml-1 capitalize">{getCleanStatusMessage(download)}</span>
                            </span>
                            {/* Multi-file indicator */}
                            {download.files && download.files.length > 1 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Files className="h-3 w-3 mr-1" />
                                <span>{download.files.length} files</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              {getTypeIcon(download.type)}
                              <span>{download.site}</span>
                            </span>
                            <span>•</span>
                            <span>{download.format.toUpperCase()}</span>
                            {download.mediaInfo?.format_id && (
                              <>
                                <span>•</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">ID: {download.mediaInfo.format_id}</span>
                              </>
                            )}
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

                          {/* Additional metadata for yt-dlp info */}
                          {(download.mediaInfo?.uploader || download.mediaInfo?.duration || download.mediaInfo?.view_count) && (
                            <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1 flex-wrap">
                              {download.mediaInfo.uploader && (
                                <span>by {download.mediaInfo.uploader}</span>
                              )}
                              {download.mediaInfo.duration && (
                                <>
                                  {download.mediaInfo.uploader && <span>•</span>}
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{Math.floor(download.mediaInfo.duration / 60)}:{(download.mediaInfo.duration % 60).toString().padStart(2, '0')}</span>
                                  </div>
                                </>
                              )}
                              {download.mediaInfo.view_count && (
                                <>
                                  {(download.mediaInfo.uploader || download.mediaInfo.duration) && <span>•</span>}
                                  <span>{download.mediaInfo.view_count.toLocaleString()} views</span>
                                </>
                              )}
                            </div>
                          )}

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
                        </div>
                      </div>

                      {/* Actions - Aligned Right */}
                      <div className="flex items-start space-x-2 ml-4 flex-shrink-0">
                        {/* Play Button - Fixed visibility logic */}
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
                        {download.status === 'completed' && (download.downloadPath || (download.files && download.files.length > 0)) && (
                          <button
                            onClick={() => handleDownloadFile(download)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title={download.files && download.files.length > 1 ? `Download all ${download.files.length} files` : t('dashboard.actions.download')}
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

                    {/* Multi-file details - Full Width, Left Aligned */}
                    {download.files && download.files.length > 1 && download.status === 'completed' && (
                      <div className="mt-3 w-full">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                          <div className="flex items-center space-x-1 text-blue-800 mb-2">
                            <FolderOpen className="h-3 w-3" />
                            <span className="font-medium">Multiple Files Downloaded</span>
                          </div>
                          <div className="space-y-1">
                            {download.files.slice(0, 3).map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 text-blue-700">
                                {file.type === 'video' && <Play className="h-2 w-2" />}
                                {file.type === 'audio' && <Music className="h-2 w-2" />}
                                {file.type === 'image' && <Image className="h-2 w-2" />}
                                <span className="truncate">{file.filename}</span>
                                <span className="text-blue-600">({file.size})</span>
                              </div>
                            ))}
                            {download.files.length > 3 && (
                              <div className="text-blue-600">
                                +{download.files.length - 3} more files...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brief error message for failed tasks - Full Width, Left Aligned */}
                    {download.status === 'failed' && download.error && (
                      <div className="mt-3 w-full">
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm text-red-700">
                                {getBriefErrorMessage(download.error, download.url)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Invalid status message - Full Width, Left Aligned */}
                    {download.status === 'invalid' && (
                      <div className="mt-3 w-full">
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700">
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{t('dashboard.status.invalidMessage')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
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
  return <DashboardContent />;
}