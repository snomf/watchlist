import { useState } from 'react';
import { WatchlistView } from './pages/WatchlistView';
import { Dock } from './components/Dock/Dock';
import { SettingsModal } from './components/SettingsModal';
import { Layers, MessageCircle, Tv, Grid } from 'lucide-react';

export function App() {
  const [currentApp, setCurrentApp] = useState<'chat' | 'watchlist' | 'mm'>('watchlist');
  const [isWatching, setIsWatching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tmdbApiKey, setTmdbApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');

  const handleSaveSettings = (key: string) => {
    setTmdbApiKey(key);
    localStorage.setItem('tmdb_api_key', key);
  };

  // Define Dock items with potential hrefs for migration demo, but using onSwitch for this demo
  const dockItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'bg-red-600' },
    { id: 'watchlist', label: 'Watchlist', icon: Tv, color: 'bg-orange-500' },
    { id: 'mm', label: 'Media Manager', icon: Grid, color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-[#111] min-h-screen text-white overflow-hidden relative">
      
      {/* App Switcher (Dock) - Hidden when watching */}
      {!isWatching && (
        <Dock 
            items={dockItems.map(item => ({...item, icon: item.icon}))}
            activeId={currentApp} 
            onSwitch={(id) => setCurrentApp(id as any)} 
        />
      )}

      {/* Global Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveSettings}
        currentApiKey={tmdbApiKey}
      />

      {/* Render Current App */}
      {currentApp === 'watchlist' ? (
        <WatchlistView 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            apiKey={tmdbApiKey}
            onWatchStart={() => setIsWatching(true)}
            onWatchEnd={() => setIsWatching(false)}
        />
      ) : currentApp === 'chat' ? (
        <ChatAppPlaceholder onSwitchToWatchlist={() => setCurrentApp('watchlist')} />
      ) : (
        <MediaManagerPlaceholder />
      )}
    </div>
  );
}

// Placeholder for Chat App (Red Theme)
function ChatAppPlaceholder({ onSwitchToWatchlist }: { onSwitchToWatchlist: () => void }) {
    return (
        <div className="flex h-screen bg-[#2a0a0a] text-white overflow-hidden">
            {/* Mock Sidebar */}
            <div className="w-20 border-r border-red-900/30 flex flex-col items-center py-6 gap-6">
                <div className="w-10 h-10 bg-red-600 rounded-xl shadow-lg shadow-red-600/20" />
                <div className="w-10 h-10 bg-white/5 rounded-xl hover:bg-white/10 transition" />
                <div className="w-10 h-10 bg-white/5 rounded-xl hover:bg-white/10 transition" />
                <div className="mt-auto w-10 h-10 bg-white/5 rounded-full" />
            </div>
            
            {/* Mock Chat Area */}
            <div className="flex-1 flex flex-col p-6 relative">
                <header className="h-16 border-b border-red-900/30 flex items-center justify-between px-4 mb-4">
                    <span className="font-bold text-red-500 tracking-widest text-xl">MINICHAT</span>
                    <button className="p-2 rounded-full hover:bg-red-900/20 text-red-400">
                        <Layers size={20} />
                    </button>
                </header>
                
                <div className="flex-1 bg-red-950/20 rounded-2xl p-8 flex flex-col items-center justify-center border border-red-900/20 backdrop-blur-sm relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />

                    <h1 className="text-4xl font-bold text-red-500 mb-2 z-10">Theater Mode</h1>
                    <p className="text-red-300/50 mb-8 max-w-md text-center z-10">
                        Connect with friends and watch together in real-time.
                    </p>
                    
                    <button 
                        onClick={onSwitchToWatchlist}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-red-900/50 z-10 flex items-center gap-2"
                    >
                        <span>Switch to Watchlist</span>
                    </button>
                </div>

                <div className="h-16 mt-4 bg-[#1a0505] rounded-xl border border-red-900/30 flex items-center px-6 text-white/30">
                    Type a message...
                </div>
            </div>

            {/* Mock Right Panel */}
            <div className="w-80 border-l border-red-900/30 bg-[#150505] p-6 hidden lg:block">
                 <h3 className="font-bold text-red-400 text-xs tracking-wider mb-6">RECENT ACTIVITY</h3>
                 <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-red-950/30 p-4 rounded-xl border border-red-900/20 hover:border-red-500/30 transition cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-red-900/40" />
                                <div className="h-3 w-20 bg-red-900/40 rounded" />
                            </div>
                            <div className="h-2 w-full bg-red-900/20 rounded mb-1" />
                            <div className="h-2 w-3/4 bg-red-900/20 rounded" />
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
}

// Placeholder for Media Manager (Blue Theme)
function MediaManagerPlaceholder() {
    return (
        <div className="flex h-screen bg-[#050a15] text-white">
             {/* Mock Sidebar */}
             <div className="w-64 border-r border-blue-900/30 bg-[#0a1020] p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                    <span className="font-bold text-lg">MediaMgr</span>
                </div>
                <div className="space-y-2">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-10 w-full bg-blue-900/10 rounded-lg" />
                    ))}
                </div>
            </div>
            
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-400">Library</h1>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-full" />
                        <div className="w-10 h-10 bg-blue-900/30 rounded-full" />
                    </div>
                </header>

                <div className="grid grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="aspect-[2/3] bg-blue-900/10 rounded-xl border border-blue-900/20 hover:border-blue-500/50 transition" />
                    ))}
                </div>
            </div>
        </div>
    );
}
