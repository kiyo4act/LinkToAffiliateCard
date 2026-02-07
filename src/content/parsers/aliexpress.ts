import { ScrapedData } from '../../types';
import { Parser } from './base';

export const AliExpressParser: Parser = {
    isMatch: (url: string) => url.includes('aliexpress.com') || url.includes('aliexpress.co.jp'),
    parse: (document: Document, url: string): ScrapedData => {

        // Title
        const title =
            document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            document.title;

        // Image - AliExpress OGP image is usually good
        const imageUrl =
            document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
            '';

        return {
            title,
            imageUrl,
            url,
            siteName: 'AliExpress',
            platformId: 'aliexpress'
        };
    }
};
