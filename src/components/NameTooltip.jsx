import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NameTooltip() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span className="relative inline-block">
            <span
                onClick={() => setIsOpen(!isOpen)}
                className="bg-amber-300 px-1 border-b-2 border-zinc-900 cursor-pointer hover:bg-amber-400 transition-colors select-none"
            >
                Jamir o Yamir
            </span>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[200px] z-50 pointer-events-none"
                    >
                        <div className="bg-zinc-900 text-white text-xs p-3 rounded-lg shadow-xl relative text-center border-2 border-white">
                            <p className="font-medium leading-relaxed">
                                Es la abreviación de Jamiro 😅 <br />
                                <span className="opacity-75 italic block mt-1">"Por lo general terminan todos diciéndome Jamir jaja"</span>
                            </p>
                            {/* Little triangle arrow at bottom */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-zinc-900"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
