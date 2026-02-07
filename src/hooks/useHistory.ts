import { useState, useEffect, useCallback } from 'react';
import { CardData, HistoryItem } from '../types';

const HISTORY_KEY = 'blog_card_history';
const MAX_HISTORY = 50;

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Check if chrome.storage is available (might verify in non-extension env)
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    const result = await chrome.storage.local.get([HISTORY_KEY]);
                    if (result[HISTORY_KEY]) {
                        setHistory(result[HISTORY_KEY]);
                    }
                } else {
                    // Fallback for dev/web environment
                    const local = localStorage.getItem(HISTORY_KEY);
                    if (local) {
                        setHistory(JSON.parse(local));
                    }
                }
            } catch (e) {
                console.error('Failed to load history', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadHistory();
    }, []);

    const saveToStorage = async (newHistory: HistoryItem[]) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ [HISTORY_KEY]: newHistory });
        } else {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        }
    };

    const addHistory = useCallback(async (data: CardData) => {
        const newItem: HistoryItem = {
            ...data,
            id: Date.now().toString(), // Simple ID
            createdAt: Date.now()
        };

        setHistory(prev => {
            // Dedupe? Maybe check if identical title/url exists closely? For now just prepend.
            const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
            saveToStorage(updated);
            return updated;
        });
    }, []);

    const removeHistory = useCallback(async (id: string) => {
        setHistory(prev => {
            const updated = prev.filter(item => item.id !== id);
            saveToStorage(updated);
            return updated;
        });
    }, []);

    const clearHistory = useCallback(async () => {
        setHistory([]);
        saveToStorage([]);
    }, []);

    return {
        history,
        isLoading,
        addHistory,
        removeHistory,
        clearHistory
    };
};
