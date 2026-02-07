export const extractAmazonAsin = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        // Support /dp/ASIN, /gp/product/ASIN, and /.../dp/ASIN
        const pathSegments = urlObj.pathname.split('/');

        let asin = '';

        // Look for 'dp' or 'gp/product' and grab the next segment
        for (let i = 0; i < pathSegments.length; i++) {
            if (pathSegments[i] === 'dp' && i + 1 < pathSegments.length) {
                asin = pathSegments[i + 1];
                break;
            }
            if (pathSegments[i] === 'product' && i > 0 && pathSegments[i - 1] === 'gp' && i + 1 < pathSegments.length) {
                asin = pathSegments[i + 1];
                break;
            }
        }

        if (asin && asin.length === 10) {
            return asin;
        }
        return null;
    } catch (e) {
        return null;
    }
};

export const cleanAmazonUrl = (url: string, tag: string): string => {
    const asin = extractAmazonAsin(url);
    if (asin && tag) {
        return `https://www.amazon.co.jp/dp/${asin}?tag=${tag}`;
    }
    return url;
};

export const cleanSunstellaUrl = (url: string, baseUrl: string): string => {
    try {
        const urlObj = new URL(url);
        // Ensure it's sunstella or generic check? 
        // Logic: If host is sunstella, append path query to Affiliate Base
        if (!urlObj.hostname.includes('sunstella.co.jp')) {
            return url;
        }

        // Construct affiliate link
        const targetPath = urlObj.pathname + urlObj.search;
        // BaseURL like "https://shopa.jp/...?url="
        return `${baseUrl}${targetPath}`;
    } catch (e) {
        return url;
    }
};
