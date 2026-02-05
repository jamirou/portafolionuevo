import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoSlider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return; // Pause on hover

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length, isHovered]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="w-full h-full relative overflow-hidden bg-zinc-100 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt="Jamiro - Foto Personal"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </AnimatePresence>

            {/* Navigation Controls - Visible on Hover (Desktop) / Always (Mobile) */}
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prevSlide}
                    className="p-1 bg-white/80 rounded-full text-zinc-900 border border-zinc-900 hover:bg-white hover:scale-110 transition-all shadow-sm"
                    aria-label="Foto anterior"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-1 bg-white/80 rounded-full text-zinc-900 border border-zinc-900 hover:bg-white hover:scale-110 transition-all shadow-sm"
                    aria-label="Siguiente foto"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none"></div>
        </div>
    );
}
