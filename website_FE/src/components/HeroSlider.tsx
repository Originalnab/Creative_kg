import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sliders,
  Image as ImageIcon,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import EditableText from './EditableText';

interface HeroSliderProps {
  onNavigate: (pageId: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const {
    heroSlides,
    updateSlide,
    addSlide,
    openMediaPicker,
    setShowHeroSliderModal,
    isTeamMember,
    isLiveEditMode,
  } = useAdmin();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 7500; // 7.5 seconds per slide
  const safeSlides = heroSlides.length > 0 ? heroSlides : [];

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= safeSlides.length) {
      setCurrentIndex(0);
    }
  }, [safeSlides.length, currentIndex]);

  // Autoplay and linear progress timer
  useEffect(() => {
    if (safeSlides.length <= 1 || isPaused || (isTeamMember && isLiveEditMode)) {
      return;
    }

    const intervalStep = 50;
    const progressIncrement = (intervalStep / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % safeSlides.length);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [safeSlides.length, isPaused, isTeamMember, isLiveEditMode, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  };

  const goToSlide = (idx: number) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  const currentSlide = safeSlides[currentIndex] || safeSlides[0];

  if (!currentSlide) return null;

  return (
    <section
      id="hero-slider"
      aria-label="Main Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden bg-neutral-950 select-none"
    >
      {/* Background Imagery with crossfade & gentle Ken Burns zoom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id + currentSlide.imageUrl}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.68] contrast-[1.06]"
          />
          {/* Subtle multi-layer cinematic vignette & atmospheric gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Team Member Live Edit Controls Bar */}
      {isTeamMember && isLiveEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6 sm:right-12 z-40 flex flex-wrap items-center gap-2 bg-neutral-950/80 backdrop-blur-md border border-amber-500/40 p-2 rounded-xl shadow-2xl"
        >
          <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest px-2 font-semibold">
            Slider Live Edit
          </span>

          <button
            type="button"
            onClick={() => {
              openMediaPicker((asset) => {
                updateSlide(currentSlide.id, { imageUrl: asset.url });
              });
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-sans font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Replace Slide Background</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHeroSliderModal(true)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-sans font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage All Slides ({safeSlides.length})</span>
          </button>
        </motion.div>
      )}

      {/* Main Slide Content Stage */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center space-y-6 pt-12">
        {/* Eyebrow Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${currentSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {isTeamMember && isLiveEditMode ? (
              <EditableText
                value={currentSlide.badge}
                onSave={(newVal) => updateSlide(currentSlide.id, { badge: newVal })}
                label="Slide Badge / Eyebrow"
                className="font-mono text-xs tracking-[0.25em] text-theme-primary uppercase border border-theme-primary/30 bg-theme-primary/10 px-4 py-1.5 rounded-full inline-block shadow-theme-glow"
              />
            ) : (
              <span className="font-mono text-xs tracking-[0.25em] text-theme-primary uppercase border border-theme-primary/30 bg-theme-primary/10 px-4 py-1.5 rounded-full inline-block shadow-theme-glow">
                {currentSlide.badge}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Main Headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isTeamMember && isLiveEditMode ? (
              <EditableText
                value={currentSlide.title}
                onSave={(newVal) => updateSlide(currentSlide.id, { title: newVal })}
                as="h1"
                label="Slide Main Headline"
                className="font-sans font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.05] drop-shadow-lg inline-block"
              />
            ) : (
              <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.05] drop-shadow-lg">
                {currentSlide.title}
              </h1>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Subtitle / Storytelling Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`sub-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isTeamMember && isLiveEditMode ? (
              <EditableText
                value={currentSlide.subtitle}
                onSave={(newVal) => updateSlide(currentSlide.id, { subtitle: newVal })}
                as="p"
                multiline
                label="Slide Storytelling Subtitle"
                className="font-sans text-xs sm:text-sm md:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow inline-block"
              />
            ) : (
              <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
                {currentSlide.subtitle}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            id="hero-primary-cta"
            onClick={() => onNavigate(currentSlide.primaryCtaAction || 'contact')}
            className="btn-theme-primary font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all focus:outline-none shadow-xl cursor-pointer flex items-center space-x-2"
          >
            <span>{currentSlide.primaryCtaText || 'Reserve Your Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-secondary-cta"
            onClick={() => onNavigate(currentSlide.secondaryCtaAction || 'gallery')}
            className="bg-neutral-900/80 hover:bg-neutral-850 text-white font-sans font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-xl border border-neutral-700/80 hover:border-neutral-500 transition-all focus:outline-none cursor-pointer backdrop-blur-sm"
          >
            {currentSlide.secondaryCtaText || 'Explore Master Galleries'}
          </button>
        </motion.div>
      </div>

      {/* Slider Navigation Arrows (Left & Right) */}
      {safeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Modern Numbered Slide Pagination & Progress Bar (Bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-3">
        {/* Fraction and dots */}
        <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <span className="font-mono text-[11px] text-theme-primary font-semibold">
            0{currentIndex + 1}
          </span>
          <div className="flex items-center space-x-1.5">
            {safeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 bg-theme-primary'
                    : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-neutral-500">
            0{safeSlides.length}
          </span>
        </div>

        {/* Linear Progress Countdown Line */}
        {safeSlides.length > 1 && !isPaused && !(isTeamMember && isLiveEditMode) && (
          <div className="w-36 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-theme-primary transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
