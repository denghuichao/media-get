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
  downloadUrl?: string;
  filename?: string;
  message?: string;
  error?: string;
}

export interface SupportedSite {
  name: string;
  url: string;
  types: string[];
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

  async downloadMedia(url: string, itag?: string, outputName?: string): Promise<DownloadResponse> {
    const response = await fetch(`${API_BASE_URL}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, itag, outputName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
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

  async checkYouGetInstallation(): Promise<{ installed: boolean; version?: string; error?: string }> {
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