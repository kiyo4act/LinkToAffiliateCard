import { extractAmazonAsin } from './urlCleaner';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const validateShopUrl = (platformId: string, url: string): ValidationResult => {
    if (!url || url.trim() === '') {
        return { isValid: true }; // Empty is valid (cleared state)
    }

    try {
        const urlObj = new URL(url);

        switch (platformId) {
            case 'amazon':
                // Check 1: Domain
                if (!urlObj.hostname.includes('amazon.co.jp') && !urlObj.hostname.includes('amzn.asia')) {
                    return { isValid: false, message: 'amazon.co.jp のURLを入力してください' };
                }
                // Check 2: ASIN
                if (!extractAmazonAsin(url)) {
                    return { isValid: false, message: '有効なASINが含まれていません' };
                }
                return { isValid: true };

            case 'aliexpress':
                // Expected: https://s.click.aliexpress.com/e/...
                // Or possibly just checking strictly for s.click.aliexpress.com
                if (urlObj.hostname === 's.click.aliexpress.com') {
                    return { isValid: true };
                }

                // Common mistake: pasting standard item URL
                if (urlObj.hostname.includes('aliexpress.com')) {
                    return { isValid: false, message: '商品ページのURLではなく、s.click.aliexpress.com形式のアフィリエイトリンクを入力してください' };
                }

                return { isValid: false, message: 'AliExpressのアフィリエイトリンク(s.click...)を入力してください' };

            case 'sunstella':
                // STRICT CHECK: Only allow product pages (sunstella.co.jp)
                // Disallow affiliate base links (shopa.jp) as they are used for generation, not input
                if (urlObj.hostname.includes('shopa.jp')) {
                    return { isValid: false, message: '生成用のリンク(shopa.jp)ではなく、商品ページ(sunstella.co.jp)のURLを入力してください' };
                }

                if (urlObj.hostname.includes('sunstella.co.jp')) {
                    return { isValid: true };
                }

                return { isValid: false, message: 'Sunstellaの商品ページURL(sunstella.co.jp)を入力してください' };

            default:
                return { isValid: true };
        }
    } catch (e) {
        return { isValid: false, message: '無効なURL形式です' };
    }
};
