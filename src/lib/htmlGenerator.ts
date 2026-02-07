import { CardData } from '../types';

/**
 * Generates the HTML code for the blog card.
 * Structure matches the user-provided example for specific theme compatibility.
 */
export const generateCardHtml = (data: CardData): string => {
  const { title, imageUrl, mainLinkUrl, shops } = data;

  // Safe fallback for links
  const mainHref = mainLinkUrl || '#';

  // Generate Shop Buttons HTML
  const buttonsHtml = shops
    .filter(shop => shop.isEnabled && shop.url && shop.url.trim() !== '') // Must have non-empty URL
    .map(shop => {
      return `<a href="${shop.url}" class="asin-detail-buy shop-${shop.platformId}" target="_blank" rel="nofollow">${shop.label}</a>`;
    })
    .join('\n            ');

  // Main Template
  // Matching user request:
  // - Root class: hatena-asin-detail ali-item
  // - Image: a.hatena-asin-detail-image-link > img.hatena-asin-detail-image
  // - Title: p.hatena-asin-detail-title > a
  return `
<div class="hatena-asin-detail ali-item">
    <a href="${mainHref}" class="hatena-asin-detail-image-link" target="_blank" rel="nofollow">
        <img src="${imageUrl}" class="hatena-asin-detail-image" alt="${escapeHtml(title)}" title="${escapeHtml(title)}">
    </a>
    
    <div class="hatena-asin-detail-info">
        <p class="hatena-asin-detail-title">
            <a href="${mainHref}" target="_blank" rel="nofollow">${escapeHtml(title)}</a>
        </p>
        
        <div class="product-link-buttons">
            ${buttonsHtml}
        </div>
    </div>
</div>
`.trim();
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
