import { ScrapeRequest, ScrapeResponse } from '../types';
import { AmazonParser } from './parsers/amazon';
import { SunstellaParser } from './parsers/sunstella';
import { AliExpressParser } from './parsers/aliexpress';
import { FallbackParser } from './parsers/fallback';

console.log('Blog Card Builder Content Script properties loaded');

// Registry of parsers (Order matters: Specific first, Fallback last)
const parsers = [
    AmazonParser,
    SunstellaParser,
    AliExpressParser,
    FallbackParser // Always last
];

function handleScrape(): ScrapeResponse {
    try {
        const url = window.location.href;

        // Find matching parser
        const parser = parsers.find(p => p.isMatch(url));
        if (!parser) {
            throw new Error('No compatible parser found');
        }

        console.log(`[BlogCardBuilder] Using parser for: ${url}`);
        const data = parser.parse(document, url);

        return {
            success: true,
            data
        };

    } catch (e: any) {
        console.error('[BlogCardBuilder] Scrape failed:', e);
        return {
            success: false,
            error: e.message || 'Unknown error'
        };
    }
}

// Message Listener
chrome.runtime.onMessage.addListener((request: ScrapeRequest, _sender, sendResponse) => {
    if (request.type === 'SCRAPE_PAGE') {
        const response = handleScrape();
        sendResponse(response);
    }
    return true; // Keep channel open for async response if needed (though we responded synchronously)
});
