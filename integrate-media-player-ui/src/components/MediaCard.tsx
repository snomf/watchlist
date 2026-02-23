import React from 'react';
import { motion } from 'framer-motion';
import { MediaItem } from '../types';
import { Play } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer flex-shrink-0 w-[200px] h-[300px] rounded-xl overflow-hidden shadow-lg bg-gray-800"
      onClick={() => onClick(item)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster.split('w500').pop() || ''}`} // quick fix for my mock urls if they are full
        // Actually for the mock URLs I put full URLs but let's just assume for now I might need to fix them or they are real TMDB paths if I had real data.
        // Let's just use the URL as is for now, but fallback to a placeholder if it fails or is empty.
        onError={(e) => {
             (e.target as HTMLImageElement).src = `https://placehold.co/400x600/1e293b/white?text=${encodeURIComponent(item.title)}`;
        }}
        alt={item.title}
        className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Top Left Icons (Reactions) */}
      <div className="absolute top-2 left-2 flex gap-1">
         {item.reactions && (
            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                🤣 LOL
            </div>
         )}
      </div>

      {/* Center Play Button (On Hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {item.type === 'movie' && (
            <span className="inline-block bg-gray-700/80 backdrop-blur-md text-gray-200 text-[10px] px-2 py-0.5 rounded mb-2 uppercase tracking-wider">
                Movie
            </span>
        )}
         {item.type === 'tv' && (
            <span className="inline-block bg-gray-700/80 backdrop-blur-md text-gray-200 text-[10px] px-2 py-0.5 rounded mb-2 uppercase tracking-wider">
                TV Show
            </span>
        )}
        
        {/* Title is usually text, but in screenshot it's sometimes a logo. We use text. */}
        {/* <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{item.title}</h3> */}
      </div>

        {/* Progress Bar for Watching */}
        {item.status === 'watching' && item.progress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div 
                    className="h-full bg-orange-500" 
                    style={{ width: `${(item.progress.episode / item.progress.totalEpisodes) * 100}%` }}
                />
            </div>
        )}
    </motion.div>
  );
};
