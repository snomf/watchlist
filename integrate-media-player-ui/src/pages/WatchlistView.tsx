import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { MediaCard } from '../components/MediaCard';
import { DetailModal } from '../components/DetailModal';
import { Player } from '../components/Player';
import { MediaItem } from '../types';
import { fetchTrending, searchMedia } from '../services/tmdb';

interface WatchlistViewProps {
    onOpenSettings: () => void;
    apiKey: string;
    onWatchStart: () => void;
    onWatchEnd: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ onOpenSettings, apiKey, onWatchStart, onWatchEnd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [watchingMedia, setWatchingMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Trending on Mount or API Key Change
  useEffect(() => {
    if (apiKey) {
      setIsLoading(true);
      fetchTrending(apiKey)
        .then(items => {
            setTrending(items);
            setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [apiKey]);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery && apiKey) {
        setIsLoading(true);
        searchMedia(apiKey, searchQuery)
          .then(items => {
              setSearchResults(items);
              setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, apiKey]);

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const handleWatch = (item: MediaItem) => {
    setWatchingMedia(item);
    setSelectedMedia(null); // Close detail modal
    onWatchStart();
  };

  const handleClosePlayer = () => {
    setWatchingMedia(null);
    onWatchEnd();
  };

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans selection:bg-orange-500 selection:text-white pb-32">
      {/* Background Image (Fixed) */}
      <div className="fixed inset-0 z-0">
        <img 
            src="https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent" />
      </div>

      <Header onSearch={setSearchQuery} onOpenSettings={onOpenSettings} />

      <main className="relative z-10 pt-24 px-8 space-y-12">
        {!apiKey && (
            <div className="bg-orange-900/50 border border-orange-500/50 p-6 rounded-xl text-center max-w-2xl mx-auto backdrop-blur-md">
                <h3 className="text-xl font-bold text-orange-200 mb-2">Setup Required</h3>
                <p className="text-orange-100/70 mb-4">
                    To see real movies and shows, you need to add your TMDB API Key in the settings.
                </p>
                <button 
                    onClick={onOpenSettings}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition"
                >
                    Open Settings
                </button>
            </div>
        )}

        {isLoading && (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Search Results
                    <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{searchResults.length}</span>
                </h2>
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                    {searchResults.map(item => (
                        <MediaCard 
                            key={item.id} 
                            item={item} 
                            onClick={handleMediaClick} 
                        />
                    ))}
                </div>
            </section>
        )}

        {/* Trending Section (Currently Watching Placeholder) */}
        {trending.length > 0 && !searchQuery && (
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Trending Now
                    <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{trending.length}</span>
                </h2>
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                    {trending.map(item => (
                        <MediaCard 
                            key={item.id} 
                            item={item} 
                            onClick={handleMediaClick} 
                        />
                    ))}
                </div>
            </section>
        )}
      </main>

      {/* Modals */}
      <DetailModal 
        item={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
        onWatch={handleWatch}
      />

      {watchingMedia && (
        <Player 
            item={watchingMedia} 
            onClose={handleClosePlayer} 
        />
      )}
    </div>
  );
};
