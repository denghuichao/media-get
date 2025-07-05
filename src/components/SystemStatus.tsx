import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

export default function SystemStatus() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<{
    yougetInstalled: boolean;
    version?: string;
    error?: string;
    loading: boolean;
  }>({
    yougetInstalled: false,
    loading: true
  });

  const toolDisplayName = 'yt-dlp';
  const toolUrl = 'https://github.com/yt-dlp/yt-dlp';
  const installCommand = 'pip install yt-dlp';

  const checkStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));

    try {
      const result = await apiService.checkYtDlpInstallation();
      setStatus({
        yougetInstalled: result.installed,
        version: result.version,
        error: result.error,
        loading: false
      });
    } catch (error) {
      setStatus({
        yougetInstalled: false,
        error: t('errors.networkError'),
        loading: false
      });
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (status.loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <span className="text-blue-700">{t('systemStatus.checking')}</span>
        </div>
      </div>
    );
  }

  if (!status.yougetInstalled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800">{t('systemStatus.notMet.title')}</h4>
            <p className="text-red-700 text-sm mt-1">
              {status.error || t('systemStatus.notMet.description', { tool: toolDisplayName })}
            </p>
            <div className="mt-3 text-sm text-red-600">
              <p className="font-medium">{t('systemStatus.notMet.install', { tool: toolDisplayName })}</p>
              <code className="block bg-red-100 p-2 rounded mt-2 text-xs">
                {installCommand}
              </code>
              <p className="mt-2">
                {t('systemStatus.notMet.visitGithub')}{' '}
                <a
                  href={toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  {toolUrl.replace('https://', '')}
                </a>
              </p>
            </div>
            <button
              onClick={checkStatus}
              className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              {t('systemStatus.notMet.recheck')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-green-700">
          {t('systemStatus.ready', { tool: toolDisplayName, version: status.version })}
        </span>
      </div>
    </div>
  );
}