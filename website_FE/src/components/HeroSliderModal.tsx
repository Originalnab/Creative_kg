import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sliders,
  MoveUp,
  MoveDown,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { HeroSlide } from '../types';

export default function HeroSliderModal() {
  const {
    showHeroSliderModal,
    setShowHeroSliderModal,
    heroSlides,
    updateSlide,
    addSlide,
    deleteSlide,
    reorderSlides,
    resetSlidesToDefault,
    openMediaPicker,
  } = useAdmin();

  const [selectedSlideId, setSelectedSlideId] = useState<string>(
    heroSlides[0]?.id || ''
  );

  if (!showHeroSliderModal) return null;

  const currentSlide =
    heroSlides.find((s) => s.id === selectedSlideId) || heroSlides[0];

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;
    const newSlides = [...heroSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    reorderSlides(newSlides);
  };

  const handleAddNew = () => {
    addSlide({
      imageUrl:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920',
      badge: 'New Cinematic Series',
      title: 'Moments Captured in Stillness',
      subtitle: 'Bespoke fine art photography preserving rare beauty and heirloom moments.',
      primaryCtaText: 'Reserve Your Session',
      primaryCtaAction: 'contact',
      secondaryCtaText: 'View Gallery',
      secondaryCtaAction: 'gallery',
      alignment: 'center',
      overlayOpacity: 0.45,
    });
  };

  const handleSelectMediaForCurrentSlide = () => {
    if (!currentSlide) return;
    openMediaPicker((asset) => {
      updateSlide(currentSlide.id, { imageUrl: asset.url });
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Sliders className="w-5 h-5 text-theme-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wide uppercase font-mono text-white flex items-center gap-2">
                  <span>Hero Cinematic Slider Studio</span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-sans font-normal">
                    {heroSlides.length} Slides
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Configure fullscreen hero slides, background images, and marketing CTAs.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={resetSlidesToDefault}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Reset slides to factory default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHeroSliderModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body - 2 Columns */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            {/* Left Column: Slide List & Reordering (5 cols) */}
            <div className="md:col-span-4 p-4 sm:p-5 space-y-4 bg-neutral-950/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  Slide Sequence
                </span>
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded text-xs font-sans flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {heroSlides.map((slide, index) => {
                  const isSelected = (currentSlide?.id || '') === slide.id;
                  return (
                    <div
                      key={slide.id}
                      onClick={() => setSelectedSlideId(slide.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 flex-shrink-0 relative">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 font-mono text-[9px] px-1 rounded text-neutral-300">
                          0{index + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest block truncate">
                          {slide.badge || 'Slide'}
                        </span>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {slide.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 block truncate">
                          CTA: {slide.primaryCtaText}
                        </span>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col space-y-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(index, 'up');
                          }}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === heroSlides.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(index, 'down');
                          }}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Slide Editor Form (8 cols) */}
            <div className="md:col-span-8 p-6 space-y-6 overflow-y-auto">
              {currentSlide ? (
                <div className="space-y-6">
                  {/* Slide Visual Preview & Image Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Background Visual & Media Storage
                    </label>

                    <div className="relative rounded-xl overflow-hidden border border-neutral-800 h-44 sm:h-52 bg-neutral-950 group">
                      <img
                        src={currentSlide.imageUrl}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent p-4 flex flex-col justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 bg-black/60 px-2 py-1 rounded w-max border border-amber-500/20">
                          {currentSlide.badge}
                        </span>

                        <div className="space-y-1">
                          <h3 className="font-sans font-bold text-lg sm:text-xl text-white">
                            {currentSlide.title}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {currentSlide.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Floating action overlay */}
                      <div className="absolute top-3 right-3 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleSelectMediaForCurrentSlide}
                          className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-amber-400 hover:text-amber-300 border border-amber-500/40 text-xs font-sans font-medium flex items-center space-x-1.5 shadow-xl transition-all cursor-pointer backdrop-blur-sm"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Select from Media Vault</span>
                        </button>

                        {heroSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteSlide(currentSlide.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete this slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Manual Image URL & Direct upload guidance */}
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Direct Image URL / Cloud Path
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentSlide.imageUrl}
                        onChange={(e) =>
                          updateSlide(currentSlide.id, { imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleSelectMediaForCurrentSlide}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg font-sans transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Browse Media Vault
                      </button>
                    </div>
                  </div>

                  {/* Text & Captions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Eyebrow / Studio Badge
                      </label>
                      <input
                        type="text"
                        value={currentSlide.badge}
                        onChange={(e) =>
                          updateSlide(currentSlide.id, { badge: e.target.value })
                        }
                        placeholder="e.g. Fine Art Medium Format"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Slide Alignment
                      </label>
                      <select
                        value={currentSlide.alignment || 'center'}
                        onChange={(e) =>
                          updateSlide(currentSlide.id, {
                            alignment: e.target.value as 'center' | 'left' | 'right',
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="center">Centered</option>
                        <option value="left">Left Aligned</option>
                        <option value="right">Right Aligned</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) =>
                          updateSlide(currentSlide.id, { title: e.target.value })
                        }
                        placeholder="e.g. Light, Emotion & Timeless Form"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Storytelling Subtitle & Description
                      </label>
                      <textarea
                        rows={3}
                        value={currentSlide.subtitle}
                        onChange={(e) =>
                          updateSlide(currentSlide.id, { subtitle: e.target.value })
                        }
                        placeholder="Describe the mood, vision, and essence of this slide..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* CTA Buttons Configuration */}
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-850 space-y-4">
                    <span className="font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold block">
                      Call-to-Action Buttons
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                          Primary Button Label (Highlight)
                        </label>
                        <input
                          type="text"
                          value={currentSlide.primaryCtaText}
                          onChange={(e) =>
                            updateSlide(currentSlide.id, {
                              primaryCtaText: e.target.value,
                            })
                          }
                          placeholder="e.g. Reserve Your Session"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                          Primary Button Destination Page
                        </label>
                        <select
                          value={currentSlide.primaryCtaAction}
                          onChange={(e) =>
                            updateSlide(currentSlide.id, {
                              primaryCtaAction: e.target.value,
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="contact">Booking / Reserve Session</option>
                          <option value="gallery">Master Gallery</option>
                          <option value="wedding">Weddings</option>
                          <option value="portrait">Portraits</option>
                          <option value="fashion">Fashion</option>
                          <option value="editorial">Editorial</option>
                          <option value="about">About Studio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                          Secondary Button Label
                        </label>
                        <input
                          type="text"
                          value={currentSlide.secondaryCtaText}
                          onChange={(e) =>
                            updateSlide(currentSlide.id, {
                              secondaryCtaText: e.target.value,
                            })
                          }
                          placeholder="e.g. Explore Master Galleries"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                          Secondary Button Destination Page
                        </label>
                        <select
                          value={currentSlide.secondaryCtaAction}
                          onChange={(e) =>
                            updateSlide(currentSlide.id, {
                              secondaryCtaAction: e.target.value,
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="gallery">Master Gallery</option>
                          <option value="contact">Booking / Reserve Session</option>
                          <option value="wedding">Weddings</option>
                          <option value="portrait">Portraits</option>
                          <option value="fashion">Fashion</option>
                          <option value="editorial">Editorial</option>
                          <option value="about">About Studio</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
            <span className="text-xs text-neutral-400">
              Changes are saved automatically and synchronized with the live website.
            </span>
            <button
              type="button"
              onClick={() => setShowHeroSliderModal(false)}
              className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/10 cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Done Editing</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
