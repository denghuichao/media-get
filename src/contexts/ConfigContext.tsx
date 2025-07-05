import React, { createContext, useContext, ReactNode } from 'react';

interface Config {
    // Future configuration options can be added here
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
    // Static configuration - no need to fetch from server
    const config: Config = {};

    return (
        <ConfigContext.Provider value={{
            config,
            loading: false,
            error: null
        }}>
            {children}
        </ConfigContext.Provider>
    );
};
