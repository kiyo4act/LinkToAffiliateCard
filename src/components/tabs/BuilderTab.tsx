import React, { useState } from 'react';
import { CardData, AppConfig } from '../../types';
import { BuilderHeader } from '../ui/BuilderHeader';
import { CardPreview } from '../ui/CardPreview';
import { ShopList } from '../ui/ShopList';
import { useScraper } from '../../hooks/useScraper';
import { generateCardHtml } from '../../lib/htmlGenerator';
import { cleanAmazonUrl, cleanSunstellaUrl, extractAmazonAsin } from '../../lib/urlCleaner';
import { Check, Copy } from 'lucide-react';

interface BuilderTabProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    onSaveHistory: (data: CardData) => void;
    appConfig: AppConfig;
}

export const BuilderTab: React.FC<BuilderTabProps> = ({ cardData, setCardData, onSaveHistory, appConfig }) => {
    const { scrapeCurrentPage, isLoading, error } = useScraper();
    const [isCopied, setIsCopied] = useState(false);

    // Note: cardData state is now managed by parent (App)

    const handleRefresh = async () => {
        const data = await scrapeCurrentPage();
        console.log("Scraped:", data);
        if (data) {
            let finalMainLink = data.url;

            let shopUrlToSet = data.url;
            let shouldUpdateShopUrl = true;

            if (data.platformId === 'amazon') {
                // Use Configured Tag
                const clean = cleanAmazonUrl(data.url, appConfig.amazonTag);
                finalMainLink = clean;
                shopUrlToSet = clean;
            } else if (data.platformId === 'sunstella') {
                // Use Configured Base URL
                const clean = cleanSunstellaUrl(data.url, appConfig.sunstellaBaseUrl);
                finalMainLink = clean;
                shopUrlToSet = clean;
            } else if (data.platformId === 'aliexpress') {
                shouldUpdateShopUrl = false;
            }

            setCardData(prev => {
                const newShops = prev.shops.map(shop => {
                    if (shouldUpdateShopUrl && data.platformId === shop.platformId) {
                        return { ...shop, url: shopUrlToSet };
                    }
                    return shop;
                });

                const hasExistingData = prev.title.trim() !== "" && prev.imageUrl.trim() !== "";

                return {
                    ...prev,
                    title: hasExistingData ? prev.title : data.title,
                    imageUrl: hasExistingData ? prev.imageUrl : data.imageUrl,
                    mainLinkUrl: prev.mainLinkUrl || finalMainLink,
                    shops: newShops
                };
            });
        }
    };

    const handleReset = () => {
        setCardData(prev => ({
            title: "",
            imageUrl: "",
            mainLinkUrl: "",
            shops: prev.shops.map(s => ({ ...s, url: '' }))
        }));
    };

    const activeShops = cardData.shops.filter(s => s.url && s.url.trim() !== '');
    const isAmazonOnly = activeShops.length === 1 && activeShops[0].platformId === 'amazon';

    const handleCopyHtml = async () => {
        let textToCopy = "";

        // Verify we have something to copy
        if (!cardData.title && activeShops.length === 0) {
            return; // Don't copy empty stuff
        }

        // SAVE TO HISTORY
        onSaveHistory(cardData);

        if (isAmazonOnly) {
            const asin = extractAmazonAsin(activeShops[0].url);
            if (asin) {
                textToCopy = `[asin:${asin}:detail]`;
            } else {
                textToCopy = generateCardHtml(cardData);
            }
        } else {
            textToCopy = generateCardHtml(cardData);
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy HTML:', err);
        }
    };

    const handleUpdateShop = (id: string, newUrl: string) => {
        setCardData(prev => ({
            ...prev,
            shops: prev.shops.map(s => s.id === id ? { ...s, url: newUrl } : s)
        }));
    };

    const handleClearShop = (id: string) => {
        setCardData(prev => ({
            ...prev,
            shops: prev.shops.map(s => s.id === id ? { ...s, url: '' } : s)
        }));
    };

    return (
        <div className="space-y-6 pb-6">
            <BuilderHeader onRefresh={handleRefresh} onReset={handleReset} />

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                    {error}
                </div>
            )}

            {isLoading && (
                <div className="text-center text-xs text-slate-500 animate-pulse">
                    Fetching data...
                </div>
            )}

            <section>
                <CardPreview
                    data={cardData}
                    onTitleChange={(t) => setCardData({ ...cardData, title: t })}
                />
            </section>

            <section>
                <ShopList
                    shops={cardData.shops}
                    onRemoveShop={handleClearShop}
                    onUpdateShopUrl={handleUpdateShop}
                />
            </section>

            <section className="pt-4 border-t border-slate-100">
                <button
                    onClick={handleCopyHtml}
                    className={`w-full py-3 font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 ${isCopied
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    <span>
                        {isCopied
                            ? 'Copied to Clipboard!'
                            : isAmazonOnly
                                ? 'Copy Hatena Tag'
                                : 'Copy HTML Code'
                        }
                    </span>
                </button>
            </section>
        </div>
    );
};
