import React, { useState, useEffect } from 'react';
import { generateBlogCss, DEFAULT_CSS_CONFIG, CssConfig } from '../../lib/cssGenerator';
import { Check, Copy, RefreshCw, Save } from 'lucide-react';
import { AppConfig } from '../../types';

interface ConfigTabProps {
    appConfig: AppConfig;
    onUpdateAppConfig: (config: Partial<AppConfig>) => void;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ appConfig, onUpdateAppConfig }) => {
    // CSS Generator State
    const [cssConfig, setCssConfig] = useState<CssConfig>(DEFAULT_CSS_CONFIG);
    const [generatedCss, setGeneratedCss] = useState('');
    const [isCssCopied, setIsCssCopied] = useState(false);

    // App Config Config (Local state to avoid triggering spam storage writes, though the hook handles it efficiently enough likely)
    // Actually, letting user type freely and saving onBlur or simple onChange is fine.

    useEffect(() => {
        setGeneratedCss(generateBlogCss(cssConfig));
    }, [cssConfig]);

    const handleCopyCss = async () => {
        try {
            await navigator.clipboard.writeText(generatedCss);
            setIsCssCopied(true);
            setTimeout(() => setIsCssCopied(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleResetCss = () => {
        setCssConfig(DEFAULT_CSS_CONFIG);
    };

    return (
        <div className="space-y-8 pb-6">
            <header className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Configuration</h2>
            </header>

            {/* General Settings */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <SettingsIcon size={16} className="text-slate-500" />
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Affiliate Settings</h3>
                </div>

                <div className="space-y-4 bg-white p-3 border border-slate-200 rounded shadow-sm">
                    {/* Amazon Tag */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">Amazon Affiliate Tag / ID</label>
                        <input
                            type="text"
                            value={appConfig.amazonTag}
                            onChange={(e) => onUpdateAppConfig({ amazonTag: e.target.value })}
                            placeholder="e.g. tag-22"
                            className="w-full text-xs p-2 border border-slate-200 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                        <p className="text-[10px] text-slate-400">Appended as ?tag=... to Amazon URLs.</p>
                    </div>

                    {/* Sunstella Base */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">Sunstella Affiliate Base URL</label>
                        <input
                            type="text"
                            value={appConfig.sunstellaBaseUrl}
                            onChange={(e) => onUpdateAppConfig({ sunstellaBaseUrl: e.target.value })}
                            placeholder="https://shopa.jp/...?url="
                            className="w-full text-xs p-2 border border-slate-200 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                        />
                        <p className="text-[10px] text-slate-400">The product path will be appended to this URL.</p>
                    </div>
                </div>
            </section>

            <hr className="border-slate-100" />

            {/* CSS Generator Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrushIcon size={16} className="text-slate-500" />
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CSS Generator</h3>
                    </div>
                    <button
                        onClick={handleResetCss}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Reset Colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Amazon */}
                    <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded">
                        <span className="text-sm font-medium text-slate-700">Amazon Input</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={cssConfig.amazonColor}
                                onChange={(e) => setCssConfig({ ...cssConfig, amazonColor: e.target.value })}
                                className="w-20 text-xs p-1 border rounded text-right font-mono text-slate-600"
                            />
                            <input
                                type="color"
                                value={cssConfig.amazonColor}
                                onChange={(e) => setCssConfig({ ...cssConfig, amazonColor: e.target.value })}
                                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* AliExpress */}
                    <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded">
                        <span className="text-sm font-medium text-slate-700">AliExpress</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={cssConfig.aliexpressColor}
                                onChange={(e) => setCssConfig({ ...cssConfig, aliexpressColor: e.target.value })}
                                className="w-20 text-xs p-1 border rounded text-right font-mono text-slate-600"
                            />
                            <input
                                type="color"
                                value={cssConfig.aliexpressColor}
                                onChange={(e) => setCssConfig({ ...cssConfig, aliexpressColor: e.target.value })}
                                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Sunstella (Bg & Text) */}
                    <div className="bg-white p-2 border border-slate-200 rounded space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Sunstella (Bg)</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={cssConfig.sunstellaBgColor}
                                    onChange={(e) => setCssConfig({ ...cssConfig, sunstellaBgColor: e.target.value })}
                                    className="w-20 text-xs p-1 border rounded text-right font-mono text-slate-600"
                                />
                                <input
                                    type="color"
                                    value={cssConfig.sunstellaBgColor}
                                    onChange={(e) => setCssConfig({ ...cssConfig, sunstellaBgColor: e.target.value })}
                                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-sm font-medium text-slate-700">Sunstella (Text)</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={cssConfig.sunstellaTextColor}
                                    onChange={(e) => setCssConfig({ ...cssConfig, sunstellaTextColor: e.target.value })}
                                    className="w-20 text-xs p-1 border rounded text-right font-mono text-slate-600"
                                />
                                <input
                                    type="color"
                                    value={cssConfig.sunstellaTextColor}
                                    onChange={(e) => setCssConfig({ ...cssConfig, sunstellaTextColor: e.target.value })}
                                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preview & Copy Section */}
            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output CSS</h3>
                    <span className="text-[10px] text-slate-400">Paste this into &lt;style&gt; or Hatena Design</span>
                </div>

                <div className="relative">
                    <textarea
                        value={generatedCss}
                        readOnly
                        className="w-full h-40 p-2 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-600"
                    />
                </div>

                <button
                    onClick={handleCopyCss}
                    className={`w-full py-3 font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 ${isCssCopied
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {isCssCopied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{isCssCopied ? 'CSS Copied!' : 'Copy CSS Code'}</span>
                </button>
            </section>
        </div>
    );
};

// Icons
const BrushIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
        <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2.5 1.52S4.1 17 4.1 15.35c0-1.66 1.34-3 3-3 .17 0 .33.02.48.05" />
    </svg>
);
const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
