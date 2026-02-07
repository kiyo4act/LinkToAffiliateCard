import { CardData } from '../types';

export interface HistoryItem extends CardData {
    id: string; // Unique ID (uuid or timestamp)
    createdAt: number; // Timestamp
}

export interface AppConfig {
    amazonTag: string;
    sunstellaBaseUrl: string;
}

export type ScrapeRequest = {
    type: 'SCRAPE_PAGE';
};

export type ScrapeResponse = {
    success: boolean;
    data?: ScrapedData;
    error?: string;
};

export interface ShopItem {
    id: string;
    platformId: string; // 'amazon', 'aliexpress', etc.
    label: string;
    url: string;
    isEnabled: boolean;
}

export interface CardData {
    title: string;
    imageUrl: string;
    mainLinkUrl: string; // URL for image/title click
    shops: ShopItem[];
}

export type TabId = 'builder' | 'history' | 'config';

export interface ScrapedData {
    title: string;
    imageUrl: string;
    url: string;
    siteName?: string;
    platformId?: string;
}
