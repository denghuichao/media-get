// Get API base URL from environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
  isPlaylist?: boolean;
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
    isPlaylist?: boolean;
  };
}

export interface TaskStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'invalid';
  progress: number;
  title: string;
  site: string;
  url: string;
  mediaType: string;
  isPlaylist?: boolean;
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
    isPlaylist?: boolean;
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
  status: 'completed' | 'failed' | 'processing' | 'pending' | 'invalid';
  timestamp: string;
  downloadPath?: string;
  type: 'video' | 'audio' | 'image';
  filename?: string;
  downloadDir?: string;
  progress?: number;
  error?: string;
  isPlaylist?: boolean;
  fileCount?: number;
  files?: Array<{
    filename: string;
    downloadPath: string;
    size: string;
    type: string;
    format: string;
  }>;
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
  invalid: number;
}

export interface CookieData {
  platform: string;
  cookies: string;
  updatedAt: string;
}

class ApiService {
  // Helper method to get the full API URL
  private getApiUrl(endpoint: string): string {
    return `${API_BASE_URL}${endpoint}`;
  }

  // Helper method to get the download URL base (for file downloads)
  private getDownloadBaseUrl(): string {
    // Extract the base URL without /api suffix for downloads
    const baseUrl = API_BASE_URL.replace('/api', '');
    return baseUrl;
  }

  async analyzeUrl(url: string): Promise<MediaInfo> {
    const response = await fetch(this.getApiUrl('/analyze'), {
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

  async downloadMedia(
    url: string, 
    userId: string, 
    itag?: string, 
    outputName?: string, 
    cookies?: string,
    downloadPlaylist?: boolean
  ): Promise<DownloadResponse> {
    const response = await fetch(this.getApiUrl('/download'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url, 
        userId, 
        itag, 
        outputName, 
        cookies,
        downloadPlaylist: downloadPlaylist || false
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }

    return response.json();
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await fetch(this.getApiUrl(`/task/${taskId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch task status');
    }

    return response.json();
  }

  async getUserDownloads(userId: string): Promise<DownloadRecord[]> {
    const response = await fetch(this.getApiUrl(`/downloads/${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch user downloads');
    }

    return response.json();
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const response = await fetch(this.getApiUrl(`/stats/${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch user statistics');
    }

    return response.json();
  }

  async deleteDownload(userId: string, taskId: string): Promise<{ success: boolean }> {
    const response = await fetch(this.getApiUrl(`/downloads/${userId}/${taskId}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete download');
    }

    return response.json();
  }

  // Cookie management methods
  async saveCookies(userId: string, platform: string, cookies: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(this.getApiUrl(`/cookies/${userId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform, cookies }),
    });

    if (!response.ok) {
      throw new Error('Failed to save cookies');
    }

    return response.json();
  }

  async getCookies(userId: string, platform: string): Promise<CookieData> {
    const response = await fetch(this.getApiUrl(`/cookies/${userId}/${platform}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch cookies');
    }

    return response.json();
  }

  async getUserCookies(userId: string): Promise<Array<{ platform: string; updatedAt: string }>> {
    const response = await fetch(this.getApiUrl(`/cookies/${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch user cookies');
    }

    return response.json();
  }

  async deleteCookies(userId: string, platform: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(this.getApiUrl(`/cookies/${userId}/${platform}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete cookies');
    }

    return response.json();
  }

  async getSupportedSites(): Promise<SupportedSite[]> {
    const response = await fetch(this.getApiUrl('/supported-sites'));
    
    if (!response.ok) {
      throw new Error('Failed to fetch supported sites');
    }

    return response.json();
  }

  async checkYouGetInstallation(): Promise<{ installed: boolean; version?: string; error?: string; ffmpegAvailable?: boolean }> {
    try {
      const response = await fetch(this.getApiUrl('/check-youget'));
      return response.json();
    } catch (error) {
      return { 
        installed: false, 
        error: 'Cannot connect to backend server' 
      };
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(this.getApiUrl('/health'));
    return response.json();
  }

  // Helper method to get the correct download URL for files
  getFileDownloadUrl(downloadPath: string): string {
    // downloadPath already includes /downloads/... so we just need the base URL
    return `${this.getDownloadBaseUrl()}${downloadPath}`;
  }
}

export const apiService = new ApiService();

// Export the API base URL for use in other components if needed
export { API_BASE_URL };