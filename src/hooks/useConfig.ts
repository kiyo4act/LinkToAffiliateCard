import { useState, useEffect, useCallback } from 'react';
import { AppConfig } from '../types';

const CONFIG_KEY = 'blog_card_config';

const DEFAULT_CONFIG: AppConfig = {
    amazonTag: 'konoe.studio-22',
    sunstellaBaseUrl: 'https://shopa.jp/P3YAJPMCHRM5/?url=',
};

export const useConfig = () => {
    const [config, setConfigState] = useState<AppConfig>(DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    // Load config on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    const result = await chrome.storage.local.get([CONFIG_KEY]);
                    if (result[CONFIG_KEY]) {
                        // Merge with default to handle potential new fields in future
                        setConfigState({ ...DEFAULT_CONFIG, ...result[CONFIG_KEY] });
                    }
                } else {
                    const local = localStorage.getItem(CONFIG_KEY);
                    if (local) {
                        try {
                            const parsed = JSON.parse(local);
                            setConfigState({ ...DEFAULT_CONFIG, ...parsed });
                        } catch (e) { console.error(e); }
                    }
                }
            } catch (e) {
                console.error('Failed to load config', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadConfig();
    }, []);

    const saveConfig = async (newConfig: AppConfig) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ [CONFIG_KEY]: newConfig });
        } else {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
        }
    };

    const updateConfig = useCallback((updates: Partial<AppConfig>) => {
        setConfigState(prev => {
            const next = { ...prev, ...updates };
            saveConfig(next); // Auto-save on update
            return next;
        });
    }, []);

    return {
        config,
        updateConfig,
        isLoading
    };
};
