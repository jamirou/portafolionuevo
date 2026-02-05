import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function JesusHearts() {
    const [hearts, setHearts] = useState([]);

    const addHeart = useCallback((e) => {
        // Get click coordinates relative to the button
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const id = Date.now();
        setHearts((prev) => [...prev, { id, x, y }]);

        // Cleanup heart after animation
        setTimeout(() => {
            setHearts((prev) => prev.filter((h) => h.id !== id));
        }, 1000);
    }, []);

    return (
        <div
            onClick={addHeart}
            className="mt-8 p-6 bg-yellow-50 border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] relative cursor-pointer active:scale-[0.99] active:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition-all select-none"
        >
            <div className="absolute -top-3 -left-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 border-2 border-zinc-900 transform -rotate-3 font-mono z-10">
                MI PRIORIDAD
            </div>
            <div className="flex items-start gap-4 pt-2 relative z-10">
                <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 fill-rose-600" />
                <p className="text-zinc-900 text-base font-mono leading-relaxed">
                    "Mi centro es Jesús. Él impulsa mi vida y mi integridad en cada aspecto. Trabajar con honestidad y pasión no es solo una opción para mí, es mi estándar."
                </p>
            </div>

            {/* Floating Hearts Container */}
            <AnimatePresence>
                {hearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, y: heart.y - 20, x: heart.x }} // Start slightly above click
                        animate={{ opacity: 0, y: heart.y - 150 }} // Float up
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute pointer-events-none"
                        style={{ left: 0, top: 0 }} // Position handled by motion x/y
                    >
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-md" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
