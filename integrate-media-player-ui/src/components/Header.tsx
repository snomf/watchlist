import React from 'react';
import { Search, Bell, Ghost, RotateCw, LayoutGrid, List, Settings } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent/20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full hover:bg-gray-700 transition">
           <span className="text-orange-500 font-bold text-lg">W</span>
           <span className="text-white font-semibold">Watchlist</span>
        </button>
        
        <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white transition">
            <Bell size={20} />
        </button>
        
        <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white transition"
            title="Settings"
        >
            <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
            type="text" 
            placeholder="Search for movies or shows..." 
            className="w-full bg-black/40 border border-gray-700/50 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition"
            onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition shadow-lg shadow-purple-900/20">
            <RotateCw size={18} />
            <span className="font-medium">Spin Wheel</span>
        </button>

        <div className="flex bg-orange-600 rounded-full p-1">
            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition">
                <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition">
                <List size={18} />
            </button>
        </div>

        <button className="flex items-center gap-2 bg-gray-800/80 pr-4 pl-1 py-1 rounded-full hover:bg-gray-700 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Ghost size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-200">juainny</span>
        </button>
      </div>
    </header>
  );
};
