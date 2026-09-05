import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, Info, Calendar, MapPin, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from '../types';

interface LightboxProps {
  photos: Photo[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onBookInquiry: (category: string, title: string) => void;
}

export default function Lightbox({ photos, activeIndex, onClose, onNavigate, onBookInquiry }: LightboxProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Mobile swipe gesture state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const activePhoto = photos[activeIndex];

  // Key press listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, onClose]);

  // Slideshow player
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        handleNext();
      }, 5000); // 5 seconds per image
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, activeIndex]);

  const handleNext = () => {
    setIsZoomed(false);
    onNavigate((activeIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    onNavigate((activeIndex - 1 + photos.length) % photos.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // threshold in px

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!activePhoto) return null;

  return (
    <AnimatePresence>
      <div
        id="lightbox-backdrop"
        className="fixed inset-0 z-50 flex flex-col md:flex-row bg-neutral-950/98 select-none"
      >
        {/* Main Theater Stage */}
        <div
          id="lightbox-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden h-3/4 md:h-full"
        >
          {/* Controls Overlay Top */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2 pointer-events-auto bg-black/40 backdrop-blur-sm rounded-lg p-1.5 border border-white/5">
              <button
                id="lightbox-btn-slideshow"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded hover:bg-neutral-800 text-white transition-colors cursor-pointer ${isPlaying ? 'text-amber-500' : ''}`}
                title={isPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                id="lightbox-btn-zoom"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`p-2 rounded hover:bg-neutral-800 text-white transition-colors cursor-pointer ${isZoomed ? 'text-amber-500' : ''}`}
                title={isZoomed ? 'Reset Zoom' : 'Zoom Image'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
              <button
                id="lightbox-btn-info"
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded hover:bg-neutral-800 text-white transition-colors cursor-pointer ${showInfo ? 'text-amber-500' : ''}`}
                title="Toggle EXIF & Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            <button
              id="lightbox-btn-close"
              onClick={onClose}
              className="pointer-events-auto p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-white transition-colors focus:outline-none cursor-pointer"
              title="Close Theater"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Canvas View */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Prev Trigger */}
            <button
              id="lightbox-btn-prev"
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-neutral-800/80 border border-white/5 text-white/70 hover:text-white transition-all focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Main Img Container */}
            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`w-full h-full flex items-center justify-center transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                id={`lightbox-image-${activePhoto.id}`}
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className={`max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-500 select-none ${
                  isZoomed ? 'scale-150 md:scale-125' : 'scale-100'
                }`}
              />
            </motion.div>

            {/* Next Trigger */}
            <button
              id="lightbox-btn-next"
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-neutral-800/80 border border-white/5 text-white/70 hover:text-white transition-all focus:outline-none cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Autoplay Progress Line */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900">
              <motion.div
                key={activePhoto.id}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-amber-500"
              />
            </div>
          )}
        </div>

        {/* Sidebar Info/EXIF Deck */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              id="lightbox-sidebar"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-96 border-t md:border-t-0 md:border-l border-neutral-900 bg-neutral-950 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-2/5 md:h-full"
            >
              <div className="space-y-6">
                {/* Meta Header */}
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-medium bg-amber-500/10 px-2 py-1.5 rounded inline-block mb-3">
                    {activePhoto.category} Collection
                  </span>
                  <h2 className="font-sans font-medium text-xl md:text-2xl text-white tracking-tight leading-tight">
                    {activePhoto.title}
                  </h2>
                  <p className="font-sans text-xs text-neutral-400 mt-2.5 leading-relaxed">
                    {activePhoto.description}
                  </p>
                </div>

                {/* Location & Year */}
                <div className="flex items-center space-x-6 text-neutral-400 border-y border-neutral-900/60 py-4 font-sans text-xs">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
                    {activePhoto.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
                    {activePhoto.year}
                  </span>
                </div>

                {/* EXIF Readout Box */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-5">
                  <div className="flex items-center space-x-2 text-neutral-300 font-sans font-medium text-xs mb-4">
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    <span className="tracking-wider uppercase">Camera Settings</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 font-mono text-[11px]">
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Camera Body</span>
                      <span className="text-neutral-200 mt-0.5 block truncate" title={activePhoto.exif.camera}>
                        {activePhoto.exif.camera}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Aperture</span>
                      <span className="text-neutral-200 mt-0.5 block">{activePhoto.exif.aperture}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Lens Model</span>
                      <span className="text-neutral-200 mt-0.5 block truncate" title={activePhoto.exif.lens}>
                        {activePhoto.exif.lens}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Shutter Speed</span>
                      <span className="text-neutral-200 mt-0.5 block">{activePhoto.exif.shutterSpeed}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Focal Length</span>
                      <span className="text-neutral-200 mt-0.5 block">{activePhoto.exif.focalLength}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">ISO Sens.</span>
                      <span className="text-neutral-200 mt-0.5 block">ISO {activePhoto.exif.iso}</span>
                    </div>
                  </div>
                </div>

                {/* Tags Deck */}
                <div className="space-y-2">
                  <span className="text-neutral-500 block font-mono text-[9px] uppercase tracking-wider">Creative Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] text-neutral-400 bg-neutral-900 border border-neutral-850 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiry Action Box */}
              <div className="border-t border-neutral-900 pt-6 mt-6">
                <button
                  id="lightbox-btn-book-shortcut"
                  onClick={() => onBookInquiry(activePhoto.category, activePhoto.title)}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-neutral-950 text-center py-3 rounded font-sans font-medium text-xs uppercase tracking-widest transition-all focus:outline-none shadow-lg shadow-amber-500/5 cursor-pointer"
                >
                  Inquire About This Style
                </button>
                <span className="text-neutral-500 text-[10px] text-center block mt-2 font-sans">
                  Available for print requests and commissions.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
