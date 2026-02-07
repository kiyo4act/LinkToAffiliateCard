import { ScrapedData } from '../../types';
import { Parser } from './base';

export const AmazonParser: Parser = {
    isMatch: (url: string) => {
        return url.includes('amazon.') || url.includes('amzn.');
    },
    parse: (document: Document, url: string): ScrapedData => {
        // 1. Title
        const titleEl = document.getElementById('productTitle');
        const title = titleEl ? titleEl.innerText.trim() : document.title;

        // 2. Image
        // Amazon often puts the hi-res image in data-old-hires or src of #landingImage
        let imageUrl = '';
        const imgEl = document.getElementById('landingImage') as HTMLImageElement;

        if (imgEl) {
            // Try to get dynamic hi-res URL if available (often in data-a-dynamic-image)
            const dynamicData = imgEl.getAttribute('data-a-dynamic-image');
            if (dynamicData) {
                try {
                    const json = JSON.parse(dynamicData);
                    // Get the largest image key
                    const keys = Object.keys(json);
                    if (keys.length > 0) {
                        imageUrl = keys[keys.length - 1]; // Often the last one is biggest, or just take first
                    }
                } catch (e) {
                    console.warn('Failed to parse amazon dynamic image', e);
                }
            }

            if (!imageUrl) {
                imageUrl = imgEl.getAttribute('src') || '';
            }
        }

        // Fallback to OGP if specific parse fails
        if (!imageUrl) {
            const ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) imageUrl = ogImg.getAttribute('content') || '';
        }

        // Note: We don't clean the URL here in the parser because the content script 
        // might not have access to the user's config (Tag ID) easily without async storage calls.
        // We will clean it in the Side Panel (BuilderTab).

        return {
            title,
            imageUrl,
            url, // Return raw URL, clean later
            siteName: 'Amazon',
            platformId: 'amazon' // Add identification
        };
    }
};
