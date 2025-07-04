import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Config {
    downloadTool: string;
}

interface ConfigContextType {
    config: Config | null;
    loading: boolean;
    error: string | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/api/config');
                if (!response.ok) {
                    throw new Error('Failed to fetch config');
                }
                const configData = await response.json();
                setConfig(configData);
                setError(null);
            } catch (err) {
                console.error('Error fetching config:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Fallback to default value
                setConfig({ downloadTool: 'yt-dlp' });
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, error }}>
            {children}
        </ConfigContext.Provider>
    );
};
