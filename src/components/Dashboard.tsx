import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink,
  Filter,
  Search,
  Calendar,
  FileText,
  Play,
  Music,
  Image,
  MoreVertical,
  RefreshCw
} from 'lucide-react';

interface DownloadItem {
  id: string;
  url: string;
  title: string;
  site: string;
  format: string;
  quality: string;
  size: string;
  status: 'completed' | 'failed' | 'downloading' | 'pending';
  timestamp: Date;
  downloadPath?: string;
  type: 'video' | 'audio' | 'image';
  progress?: number;
}

// Mock data for demonstration
const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    site: 'YouTube',
    format: 'mp4',
    quality: '1080p',
    size: '45.2 MB',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'video',
    downloadPath: '/downloads/rick-astley-never-gonna-give-you-up.mp4'
  },
  {
    id: '2',
    url: 'https://soundcloud.com/example/track',
    title: 'Amazing Electronic Track',
    site: 'SoundCloud',
    format: 'mp3',
    quality: '320kbps',
    size: '8.7 MB',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: 'audio',
    downloadPath: '/downloads/amazing-electronic-track.mp3'
  },
  {
    id: '3',
    url: 'https://vimeo.com/example',
    title: 'Creative Short Film',
    site: 'Vimeo',
    format: 'mp4',
    quality: '4K',
    size: '156.8 MB',
    status: 'downloading',
    timestamp: new Date(),
    type: 'video',
    progress: 67
  },
  {
    id: '4',
    url: 'https://instagram.com/p/example',
    title: 'Beautiful Sunset Photo',
    site: 'Instagram',
    format: 'jpg',
    quality: 'Original',
    size: '2.1 MB',
    status: 'failed',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'image'
  },
  {
    id: '5',
    url: 'https://tiktok.com/@user/video/123',
    title: 'Viral Dance Video',
    site: 'TikTok',
    format: 'mp4',
    quality: '720p',
    size: '12.4 MB',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'video'
  }
];

export default function Dashboard() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(mockDownloads);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'downloading' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'title'>('newest');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'downloading': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
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
      case 'downloading': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
        case 'newest': return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest': return a.timestamp.getTime() - b.timestamp.getTime();
        case 'title': return a.title.localeCompare(b.title);
        case 'size': return parseFloat(b.size) - parseFloat(a.size);
        default: return 0;
      }
    });

  const stats = {
    total: downloads.length,
    completed: downloads.filter(d => d.status === 'completed').length,
    failed: downloads.filter(d => d.status === 'failed').length,
    downloading: downloads.filter(d => d.status === 'downloading').length,
    pending: downloads.filter(d => d.status === 'pending').length
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const deleteDownload = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const retryDownload = (id: string) => {
    setDownloads(downloads.map(d => 
      d.id === id ? { ...d, status: 'pending' as const } : d
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Dashboard</h1>
          <p className="text-gray-600">Manage your downloads and view download history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloading</p>
                <p className="text-2xl font-bold text-gray-900">{stats.downloading}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search downloads..."
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
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="downloading">Downloading</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="size">File Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Download History</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredDownloads.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads found</h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start downloading media to see your history here'
                  }
                </p>
              </div>
            ) : (
              filteredDownloads.map((download) => (
                <div key={download.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Type Icon */}
                      <div className="flex-shrink-0">
                        {getTypeIcon(download.type)}
                      </div>
                      
                      {/* Download Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {download.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                            {getStatusIcon(download.status)}
                            <span className="ml-1 capitalize">{download.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{download.site}</span>
                          <span>•</span>
                          <span>{download.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{download.quality}</span>
                          <span>•</span>
                          <span>{download.size}</span>
                          <span>•</span>
                          <span>{formatTimestamp(download.timestamp)}</span>
                        </div>
                        
                        {/* Progress Bar for Downloading */}
                        {download.status === 'downloading' && download.progress && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Downloading...</span>
                              <span>{download.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${download.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {download.status === 'completed' && download.downloadPath && (
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                      
                      {download.status === 'failed' && (
                        <button 
                          onClick={() => retryDownload(download.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Retry download"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteDownload(download.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}