import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectGallery({ images, title }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = (e) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-full group">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${title} - Vista ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </AnimatePresence>

            {/* Navigation Overlay - Visible on Hover (Desktop) / Always (Mobile) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-between px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prevSlide}
                    className="p-1 bg-white/80 rounded-full hover:bg-white text-zinc-900 shadow-md transform hover:scale-110 transition-all"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-1 bg-white/80 rounded-full hover:bg-white text-zinc-900 shadow-md transform hover:scale-110 transition-all"
                    aria-label="Next image"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
