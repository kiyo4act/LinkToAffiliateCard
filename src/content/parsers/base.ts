import { ScrapedData } from '../../types';

export interface Parser {
    isMatch(url: string): boolean;
    parse(document: Document, url: string): ScrapedData;
}
