import React, { useState, useEffect } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface BuilderHeaderProps {
    onRefresh: () => void;
    onReset: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({ onRefresh, onReset }) => {
    const [resetState, setResetState] = useState<'idle' | 'confirm'>('idle');
    const [isClickBlocked, setIsClickBlocked] = useState(false);

    // Auto-revert to idle if ignored for 3 seconds
    useEffect(() => {
        if (resetState === 'confirm') {
            const timer = setTimeout(() => {
                setResetState('idle');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [resetState]);

    const handleResetClick = () => {
        if (resetState === 'idle') {
            setResetState('confirm');
            // Block immediate second click (anti-chattering)
            setIsClickBlocked(true);
            setTimeout(() => {
                setIsClickBlocked(false);
            }, 300); // 300ms block (User said "slightly" - 500ms might be too slow for fast users, 300ms is standard debounce)
        } else if (resetState === 'confirm') {
            if (isClickBlocked) return; // Ignore clicks during chattering prevention time

            onReset();
            setResetState('idle');
        }
    };

    return (
        <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Card Builder</h2>

                <button
                    onClick={handleResetClick}
                    className={`p-1.5 rounded transition-colors flex items-center justify-center text-[10px] ${resetState === 'confirm'
                            ? 'bg-red-50 text-red-600 font-bold'
                            : 'text-slate-300 hover:text-red-600 hover:bg-red-50'
                        }`}
                    title={resetState === 'idle' ? "Reset All Data" : "Click again to confirm"}
                >
                    {/* Overlay Layout - forces width to be the max of both states */}
                    <div className="grid place-items-center">
                        {/* Idle State */}
                        <div className={`col-start-1 row-start-1 flex items-center gap-1 transition-opacity duration-200 ${resetState === 'confirm' ? 'opacity-0' : 'opacity-100'}`}>
                            <RotateCcw size={14} />
                            <span>Reset</span>
                        </div>

                        {/* Confirm State */}
                        <div className={`col-start-1 row-start-1 flex items-center gap-1 transition-opacity duration-200 ${resetState === 'confirm' ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="whitespace-nowrap">Are you sure?</span>
                        </div>
                    </div>
                </button>
            </div>

            <button
                onClick={onRefresh}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
                <div className="bg-white/20 p-1 rounded-full group-hover:rotate-180 transition-transform duration-500">
                    <RefreshCw size={16} />
                </div>
                <span className="font-bold text-sm">Fetch from Current Tab</span>
            </button>
        </div>
    );
};
