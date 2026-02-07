import { ScrapedData } from '../../types';
import { Parser } from './base';

export const SunstellaParser: Parser = {
    isMatch: (url: string) => url.includes('sunstella.co.jp'),
    parse: (document: Document, url: string): ScrapedData => {
        // Sunstella seems to use standard OGP well, but let's be safe
        // If it's Shopify based (likely), og:title/image are reliable.

        // Title
        const title =
            document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            document.title;

        // Image
        const imageUrl =
            document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
            document.querySelector('meta[property="og:image:secure_url"]')?.getAttribute('content') ||
            '';

        return {
            title,
            imageUrl,
            url,
            siteName: 'Sunstella',
            platformId: 'sunstella'
        };
    }
};
