import React, { useState } from 'react';
import { HistoryItem, CardData } from '../../types';
import { Trash2, RotateCcw, ImageOff } from 'lucide-react';

interface HistoryTabProps {
    history: HistoryItem[];
    onRestore: (item: CardData) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
}

// Sub-component for individual shop tags to manage "Copied" state
const ShopTag = ({ shop }: { shop: { platformId: string, label: string, url: string } }) => {
    const [isCopied, setIsCopied] = useState(false);

    let baseColor = '#cbd5e1';
    if (shop.platformId === 'amazon') baseColor = '#FF9900';
    if (shop.platformId === 'aliexpress') baseColor = '#FF4747';
    if (shop.platformId === 'sunstella') baseColor = '#999999';

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(shop.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopyLink}
            className="text-[10px] px-2 py-1 rounded text-white shadow-sm hover:opacity-90 transition-all duration-200"
            style={{ backgroundColor: isCopied ? '#22c55e' : baseColor }}
            title={`Copy ${shop.label} URL`}
        >
            <div className="grid place-items-center">
                {/* Original Label (Invisible when copied, but keeps width) */}
                <span className={`col-start-1 row-start-1 transition-opacity duration-200 ${isCopied ? 'opacity-0' : 'opacity-100'}`}>
                    {shop.label}
                </span>

                {/* Copied Label (Overlay) */}
                <span className={`col-start-1 row-start-1 font-bold transition-opacity duration-200 ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                    Copied!
                </span>
            </div>
        </button>
    );
};

export const HistoryTab: React.FC<HistoryTabProps> = ({ history, onRestore, onDelete, onClear }) => {

    // Formatting helper
    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleString('ja-JP', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4 pb-6">
            <header className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">History</h2>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </header>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <HistoryIcon size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">No history yet.</p>
                    <p className="text-xs mt-1">Generated cards will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-3 rounded border border-slate-200 shadow-sm flex gap-3 hover:border-indigo-300 transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageOff size={16} className="text-slate-300" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-700 line-clamp-2 leading-tight mb-1">
                                        {item.title || "Untitled Card"}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 block mb-1">
                                        {formatDate(item.createdAt)}
                                    </span>

                                    {/* Shop Indicators (Pill/Tags) */}
                                    <div className="flex flex-wrap gap-1">
                                        {item.shops
                                            .filter(s => s.url && s.url.trim() !== '')
                                            .map(s => (
                                                <ShopTag key={s.id} shop={s} />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-between shrink-0 ml-1">
                                <button
                                    onClick={() => onRestore(item)}
                                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                                    title="Restore to Builder"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Placeholder icon for empty state
const HistoryIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size}
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);
