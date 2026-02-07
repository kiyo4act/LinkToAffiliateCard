import React from 'react';
import { ShopItem } from '../../types';
import { GripVertical, Eraser } from 'lucide-react';
import { validateShopUrl } from '../../lib/validator';

interface ShopListProps {
    shops: ShopItem[];
    onRemoveShop?: (id: string) => void;
    onUpdateShopUrl: (id: string, url: string) => void;
}

export const ShopList: React.FC<ShopListProps> = ({ shops, onRemoveShop, onUpdateShopUrl }) => {
    // Helper to determine platform color
    function getPlatformColor(id: string): string {
        switch (id) {
            case 'amazon': return '#FF9900';
            case 'aliexpress': return '#FF4747';
            case 'sunstella': return '#999999';
            default: return '#cbd5e1';
        }
    }

    return (
        <div className="space-y-4 mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Shop Links</h3>

            {shops.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-slate-200 rounded text-center">
                    <p className="text-xs text-slate-400">No shops available.</p>
                </div>
            ) : (
                shops.map((shop) => {
                    const validation = validateShopUrl(shop.platformId, shop.url);
                    const hasError = !validation.isValid && shop.url !== '';

                    return (
                        <div
                            key={shop.id}
                            className={`flex flex-col gap-1 p-2 bg-white border rounded shadow-sm transition-colors ${hasError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-indigo-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {/* Drag Handle (Visual only for now) */}
                                <div className="text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500">
                                    <GripVertical size={16} />
                                </div>

                                {/* Platform Indicator */}
                                <div
                                    className="w-2 h-8 rounded-full shrink-0"
                                    style={{ backgroundColor: getPlatformColor(shop.platformId) }}
                                    title={shop.label}
                                />

                                {/* Content w/ Input */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-700 mb-0.5">{shop.label}</div>
                                    <input
                                        type="text"
                                        value={shop.url}
                                        onChange={(e) => onUpdateShopUrl(shop.id, e.target.value)}
                                        placeholder={`Paste ${shop.label} URL...`}
                                        className={`w-full text-xs p-1 border rounded focus:ring-1 outline-none ${hasError
                                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200 bg-white'
                                                : 'border-slate-200 text-slate-600 focus:border-indigo-500 focus:ring-indigo-500'
                                            }`}
                                    />
                                </div>

                                {/* Clear Button */}
                                {onRemoveShop && (
                                    <button
                                        onClick={() => onRemoveShop(shop.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                                        title="Clear Link"
                                    >
                                        <Eraser size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Error Message */}
                            {hasError && (
                                <div className="ml-8 text-[10px] text-red-500 font-medium animate-pulse">
                                    ⚠️ {validation.message}
                                </div>
                            )}
                        </div>
                    )
                })
            )}
        </div>
    );
};
