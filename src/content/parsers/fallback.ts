import { ScrapedData } from '../../types';
import { Parser } from './base';

export const FallbackParser: Parser = {
    isMatch: () => true, // Always matches as last resort
    parse: (document: Document, url: string): ScrapedData => {
        const title =
            document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            document.title ||
            'No Title';

        const imageUrl =
            document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
            '';

        const siteName =
            document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
            '';

        return {
            title,
            imageUrl,
            url,
            siteName
        };
    }
};
