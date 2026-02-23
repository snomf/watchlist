import React, { useState } from 'react';
import { MediaItem, sources } from '../types';
import { X, Settings, Monitor } from 'lucide-react';

interface PlayerProps {
  item: MediaItem;
  onClose: () => void;
}

export const Player: React.FC<PlayerProps> = ({ item, onClose }) => {
  const [currentSource, setCurrentSource] = useState(sources[0]);
  const [showSourceMenu, setShowSourceMenu] = useState(false);

  // Construct URL based on source pattern
  const getEmbedUrl = (source: typeof sources[0]) => {
    const tmdbId = item.tmdbId;
    const season = item.progress?.season || 1;
    const episode = item.progress?.episode || 1;
    const isMovie = item.type === 'movie';

    switch (source.name) {
      case 'VidSrc.me':
        // https://vidsrc.xyz/embed/movie?tmdb=ID
        // https://vidsrc.xyz/embed/tv?tmdb=ID&season=S&episode=E
        // Using vidsrc.xyz as it's often more reliable, or stick to vidsrc.me
        if (isMovie) return `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`;
        return `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;

      case 'RiveStream':
        // https://rivestream.net/embed?type=movie&id=ID
        if (isMovie) return `https://rivestream.net/embed?type=movie&id=${tmdbId}`;
        return `https://rivestream.net/embed?type=tv&id=${tmdbId}&season=${season}&episode=${episode}`;

      case 'MoviesAPI':
        // https://moviesapi.club/movie/ID
        // https://moviesapi.club/tv/ID-S-E
        if (isMovie) return `https://moviesapi.club/movie/${tmdbId}`;
        return `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`;

      case '2Embed':
        // https://www.2embed.cc/embed/ID
        // https://www.2embed.cc/embedtv/ID&s=S&e=E
        if (isMovie) return `https://www.2embed.cc/embed/${tmdbId}`;
        return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;

      case 'MultiEmbed':
        // https://multiembed.mov/?video_id=ID&tmdb=1
        // https://multiembed.mov/?video_id=ID&tmdb=1&s=S&e=E
        if (isMovie) return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;

      case 'SmashyStream':
        // https://embed.smashystream.com/playere.php?tmdb=ID
        // https://embed.smashystream.com/playere.php?tmdb=ID&season=S&episode=E
        let url = `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;
        if (!isMovie) url += `&season=${season}&episode=${episode}`;
        return url;

      default:
        // Fallback generic pattern
        if (isMovie) return `${source.url}/movie/${tmdbId}`;
        return `${source.url}/tv/${tmdbId}/${season}/${episode}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Player Header - Relative & Distinct */}
      <div className="relative z-[102] flex items-center justify-between px-6 h-16 bg-[#0a0a0a] border-b border-white/5 flex-none">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2">
            <div className="bg-orange-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-white/80 font-semibold tracking-wide text-sm hidden sm:block">Watchlist Player</span>
        </div>

        {/* Controls Area */}
        <div className="flex items-center gap-4">
            {/* Source Switcher */}
            <div className="relative">
                <button 
                    onClick={() => setShowSourceMenu(!showSourceMenu)}
                    className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/90 px-4 py-2 rounded-full transition text-sm font-medium"
                >
                    <Settings size={16} />
                    <span>{currentSource.name}</span>
                </button>
                
                {showSourceMenu && (
                    <>
                    <div className="fixed inset-0 z-[103]" onClick={() => setShowSourceMenu(false)} />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/10 z-[104]">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5">Select Source</div>
                        {sources.map((src) => (
                            <button
                                key={src.name}
                                onClick={() => {
                                    setCurrentSource(src);
                                    setShowSourceMenu(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-sm ${currentSource.name === src.name ? 'text-orange-500 font-bold bg-orange-500/10' : 'text-gray-300'}`}
                            >
                                <Monitor size={14} className={currentSource.name === src.name ? 'text-orange-500' : 'text-gray-500'} />
                                {src.name}
                            </button>
                        ))}
                    </div>
                    </>
                )}
            </div>

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="bg-black/40 hover:bg-red-500/80 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full transition group/close"
                title="Close Player"
            >
                <X size={20} className="group-hover/close:scale-110 transition-transform" />
            </button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-black relative z-[101]">
        <iframe
            key={currentSource.name} // Force re-render on source change
            src={getEmbedUrl(currentSource)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; clipboard-write"
            title={`Player - ${item.title}`}
        />
      </div>
    </div>
  );
};
