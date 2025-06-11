const API_BASE_URL = 'http://localhost:3001/api';

export interface MediaInfo {
  site: string;
  title: string;
  formats: Array<{
    itag: string;
    container: string;
    quality: string;
    size: string;
    type: 'video' | 'audio' | 'image';
  }>;
}

export interface DownloadResponse {
  success: boolean;
  taskId?: string;
  message?: string;
  error?: string;
  task?: {
    id: string;
    status: string;
    title: string;
    site: string;
    url: string;
  };
}

export interface TaskStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  title: string;
  site: string;
  url: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
  result?: {
    files: Array<{
      filename: string;
      downloadPath: string;
      size: string;
      type: string;
      format: string;
    }>;
    downloadDir: string;
    message: string;
  };
  downloadUrl?: string;
  filename?: string;
}

export interface DownloadRecord {
  id: string;
  url: string;
  title: string;
  site: string;
  format: string;
  quality: string;
  size: string;
  status: 'completed' | 'failed' | 'processing' | 'pending';
  timestamp: string;
  downloadPath?: string;
  type: 'video' | 'audio' | 'image';
  filename?: string;
  downloadDir?: string;
  progress?: number;
  error?: string;
}

export interface SupportedSite {
  name: string;
  url: string;
  types: string[];
}

export interface UserStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

class ApiService {
  async analyzeUrl(url: string): Promise<MediaInfo> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze URL');
    }

    return response.json();
  }

  async downloadMedia(url: string, userId: string, itag?: string, outputName?: string): Promise<DownloadResponse> {
    const response = await fetch(`${API_BASE_URL}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, userId, itag, outputName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }

    return response.json();
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await fetch(`${API_BASE_URL}/task/${taskId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch task status');
    }

    return response.json();
  }

  async getUserDownloads(userId: string): Promise<DownloadRecord[]> {
    const response = await fetch(`${API_BASE_URL}/downloads/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user downloads');
    }

    return response.json();
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/stats/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user statistics');
    }

    return response.json();
  }

  async deleteDownload(userId: string, taskId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/downloads/${userId}/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete download');
    }

    return response.json();
  }

  async getSupportedSites(): Promise<SupportedSite[]> {
    const response = await fetch(`${API_BASE_URL}/supported-sites`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch supported sites');
    }

    return response.json();
  }

  async checkYouGetInstallation(): Promise<{ installed: boolean; version?: string; error?: string; ffmpegAvailable?: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/check-youget`);
      return response.json();
    } catch (error) {
      return { 
        installed: false, 
        error: 'Cannot connect to backend server' 
      };
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();