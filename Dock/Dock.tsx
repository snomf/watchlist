import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Tv, Grid, Layers, X } from 'lucide-react';

export interface DockItem {
    id: string;
    label: string;
    icon?: React.ElementType;
    img?: string;
    href?: string;
    color?: string; // e.g., 'bg-red-600'
}

interface DockProps {
    items?: DockItem[];
    activeId?: string;
    onSwitch?: (id: string) => void;
    className?: string;
}

export const Dock: React.FC<DockProps> = ({
    items,
    activeId,
    onSwitch,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Default Items if none provided
    const defaultItems: DockItem[] = [
        { id: 'kino', label: 'Kino', img: '/K.png', href: 'https://kino.juainny.com', color: 'bg-[#7C3AED]' },
        { id: 'watchlist', label: 'Watchlist', img: '/favicon.ico', href: 'https://watchlist.juainny.com', color: 'bg-[#EA580C]' },
        { id: 'mm', label: 'Marvel Marathon', img: '/icon_old.png', href: 'https://mm.juainny.com', color: 'bg-[#eb0a0e]' },
    ];

    const dockItems = items || defaultItems;

    const handleItemClick = (item: DockItem) => {
        if (item.href) {
            window.location.href = item.href;
        } else if (onSwitch) {
            onSwitch(item.id);
        }
        setIsOpen(false);
    };

    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] ${className}`}>
            <div className="relative">
                {/* Main Toggle Button (when closed) */}
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.button
                            key="open-btn"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: -180 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(true)}
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white shadow-xl hover:bg-white/20 transition-all group"
                        >
                            <Layers size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                        </motion.button>
                    ) : (
                        <motion.div
                            key="dock"
                            initial={{ y: 50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl"
                        >
                            {dockItems.map((item) => {
                                const isActive = activeId === item.id;
                                const colorClass = item.color || 'bg-gray-500';
                                const Icon = item.icon as React.ComponentType<any> | undefined;
                                return (
                                    <div key={item.id} className="relative group flex flex-col items-center">
                                        <button
                                            onClick={() => handleItemClick(item)}
                                            className={`relative w-11 h-11 p-0 rounded-2xl transition-all duration-300 overflow-hidden flex items-center justify-center ${isActive
                                                ? `${colorClass} text-white shadow-lg scale-110`
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
                                                }`}
                                        >
                                            {item.img ? (
                                                <img src={item.img} alt={item.label} className="w-7 h-7 object-contain" />
                                            ) : Icon ? (
                                                <Icon size={24} />
                                            ) : null}

                                            {/* Active Indicator Dot */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dot"
                                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                                />
                                            )}
                                        </button>

                                        {/* Tooltip */}
                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
