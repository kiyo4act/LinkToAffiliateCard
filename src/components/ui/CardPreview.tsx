import React from 'react';
import { CardData } from '../../types';

interface CardPreviewProps {
    data: CardData;
    onTitleChange: (newTitle: string) => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ data, onTitleChange }) => {
    return (
        <div className="space-y-3">
            {/* Image Preview */}
            <div className="aspect-[1.91/1] w-full bg-slate-100 rounded border border-slate-200 overflow-hidden relative group">
                {data.imageUrl ? (
                    <img
                        src={data.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400 text-sm">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">Change Image (Not Impl)</span>
                </div>
            </div>

            {/* Title Edit */}
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Product Title</label>
                <textarea
                    value={data.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    rows={2}
                    placeholder="Enter product title..."
                />
            </div>
        </div>
    );
};
