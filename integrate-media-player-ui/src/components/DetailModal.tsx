import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '../types';
import { X, Star, Play, MessageCircle } from 'lucide-react';

interface DetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onWatch: (item: MediaItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onWatch }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative h-[400px] w-full">
            <img 
              src={item.backdrop} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-white/20 transition"
            >
              <X size={24} />
            </button>

             {/* Reactions Overlay */}
             <div className="absolute top-4 left-4 flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-blue-500 transition">
                    + Add Reaction
                </button>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 -mt-20 relative z-10">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tight">{item.title}</h2>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                        <span>•</span>
                        <span className="border border-gray-600 px-1 rounded text-xs uppercase">{item.type}</span>
                    </div>
                </div>
                
                {item.reactions && (
                     <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">
                        🤣 LOL
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 mb-8">
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold transition shadow-lg shadow-orange-500/20">
                    <Star fill="currentColor" size={18} />
                    Favorite
                </button>
                
                <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-lg border border-[#3a3a3a]">
                    <span className="bg-[#f5c518] text-black font-bold px-1.5 rounded text-xs">IMDb</span>
                    <span className="text-white font-bold">{item.rating}</span>
                </div>

                 <button 
                    onClick={() => onWatch(item)}
                    className="ml-auto flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-full font-bold transition shadow-lg"
                 >
                    <Play fill="currentColor" size={18} />
                    Watch Now
                </button>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mb-12">
                {item.description}
            </p>

            {/* Episode Progress Section (if TV) */}
            {item.type === 'tv' && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Episode Progress</h3>
                    </div>
                    
                    <div className="bg-[#252525] rounded-xl p-4 border border-[#333]">
                         <div className="flex items-center justify-between mb-4">
                            <button className="flex items-center gap-2 text-white font-bold bg-[#333] px-4 py-2 rounded-lg">
                                Season {item.progress?.season || 1}
                            </button>
                             <button className="text-orange-500 font-bold text-sm bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                                Mark Season Watched
                            </button>
                         </div>
                         
                         {/* Mock Episodes Strip */}
                         <div className="flex gap-4 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map((ep) => (
                                <div key={ep} className="min-w-[200px] relative group cursor-pointer">
                                    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-2 relative">
                                        <img src={`https://placehold.co/300x170/1e293b/white?text=Ep ${ep}`} alt={`Episode ${ep}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                                         <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-1.5 rounded">E{ep}</div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            )}

            {/* AI Summary Mock */}
            <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="text-emerald-400" size={20} />
                    <h4 className="text-emerald-400 font-bold">Mr. W's Thoughts</h4>
                </div>
                <p className="text-emerald-100/80 text-sm italic">
                    "Opinions on {item.title} are largely positive. One viewer rated it 9/10, emphasizing it's 'TOO funny.' Another provided no specific feedback, suggesting a neutral stance."
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                {item.status === 'watching' && (
                    <button className="col-span-2 bg-red-500/80 hover:bg-red-500 text-white py-3 rounded-lg font-bold transition">
                        Remove from Currently Watching
                    </button>
                )}
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition">
                    Watched
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition">
                    Get Rid of
                </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
