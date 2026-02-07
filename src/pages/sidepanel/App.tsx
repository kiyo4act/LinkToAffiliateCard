import React, { useState } from 'react';
import { Layers, History, Settings } from 'lucide-react';
import { BuilderTab } from '../../components/tabs/BuilderTab';
import { HistoryTab } from '../../components/tabs/HistoryTab';
import { ConfigTab } from '../../components/tabs/ConfigTab';
import { TabId, CardData, ShopItem } from '../../types';
import { useHistory } from '../../hooks/useHistory';
import { useConfig } from '../../hooks/useConfig';

const DEFAULT_SHOPS: ShopItem[] = [
    { id: '1', platformId: 'amazon', label: 'Amazon', url: '', isEnabled: true },
    { id: '2', platformId: 'aliexpress', label: 'AliExpress', url: '', isEnabled: true },
    { id: '3', platformId: 'sunstella', label: 'Sunstella', url: '', isEnabled: true },
];

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('builder');

    // Lifted State for Builder
    const [cardData, setCardData] = useState<CardData>({
        title: "",
        imageUrl: "",
        mainLinkUrl: "",
        shops: DEFAULT_SHOPS
    });

    // Hooks
    const { history, addHistory, removeHistory, clearHistory } = useHistory();
    const { config, updateConfig, isLoading: isConfigLoading } = useConfig();

    const handleRestore = (item: CardData) => {
        setCardData(item);
        setActiveTab('builder');
    };

    const renderContent = () => {
        if (isConfigLoading) {
            return <div className="flex items-center justify-center h-full text-slate-400 text-xs">Loading config...</div>;
        }

        switch (activeTab) {
            case 'builder':
                return <BuilderTab
                    cardData={cardData}
                    setCardData={setCardData}
                    onSaveHistory={addHistory}
                    appConfig={config}
                />;
            case 'history':
                return <HistoryTab
                    history={history}
                    onRestore={handleRestore}
                    onDelete={removeHistory}
                    onClear={clearHistory}
                />;
            case 'config':
                return <ConfigTab
                    appConfig={config}
                    onUpdateAppConfig={updateConfig}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
                <button
                    onClick={() => setActiveTab('builder')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'builder' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <Layers size={20} />
                    <span className="text-[10px] font-medium">Builder</span>
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <History size={20} />
                    <span className="text-[10px] font-medium">History</span>
                </button>

                <button
                    onClick={() => setActiveTab('config')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'config' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <Settings size={20} />
                    <span className="text-[10px] font-medium">Config</span>
                </button>
            </nav>
        </div>
    );
};

export default App;
