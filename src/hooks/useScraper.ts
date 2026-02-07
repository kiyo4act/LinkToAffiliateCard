import { useState, useCallback } from 'react';
import { ScrapedData, ScrapeRequest, ScrapeResponse } from '../types';

interface UseScraperReturn {
    scrapeCurrentPage: () => Promise<ScrapedData | null>;
    isLoading: boolean;
    error: string | null;
}

export const useScraper = (): UseScraperReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrapeCurrentPage = useCallback(async (): Promise<ScrapedData | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab?.id) {
                throw new Error('No active tab found');
            }

            // Check if we can inject/communicate. 
            // Note: On restricted pages (chrome://), this matches <all_urls> but might fail execution.
            // Ideally we should check url scheme.

            const response = await chrome.tabs.sendMessage<ScrapeRequest, ScrapeResponse>(
                tab.id,
                { type: 'SCRAPE_PAGE' }
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to scrape page data');
            }

        } catch (err: any) {
            console.error('Scrape error:', err);
            // Better error message for common cases
            let msg = err.message;
            if (msg.includes('Could not establish connection')) {
                msg = 'Please refresh the page content script is not ready.';
            }
            setError(msg);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { scrapeCurrentPage, isLoading, error };
};
