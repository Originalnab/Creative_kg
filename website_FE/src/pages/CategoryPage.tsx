import { useState, useMemo } from 'react';
import { Eye, SlidersHorizontal, MapPin, Grid, Layers, HelpCircle, ArrowRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo, ProjectPackage } from '../types';
import { PACKAGES } from '../data/photographyData';
import ImagePreloader from '../components/ImagePreloader';
import EditableText from '../components/EditableText';
import PhotoHoverOverlay from '../components/PhotoHoverOverlay';
import { getPhotoFilterStyle } from '../utils/photoFilters';
import { useAdmin } from '../context/AdminContext';

interface CategoryPageProps {
  category: 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart';
  setCurrentPage: (page: string) => void;
  openLightbox: (photosArr: Photo[], index: number) => void;
}

export default function CategoryPage({ category, setCurrentPage, openLightbox }: CategoryPageProps) {
  const {
    publicPhotos: allPhotos,
    isAdmin,
    isTeamMember,
    siteContent,
    updateCategoryText,
    setEditingPhoto
  } = useAdmin();
  // Filters
  const [orientationFilter, setOrientationFilter] = useState<'all' | 'portrait' | 'landscape' | 'square'>('all');
  const [toneFilter, setToneFilter] = useState<'all' | 'warm' | 'cool' | 'monochrome' | 'vibrant' | 'muted'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Category specific thematic attributes
  const themeAttrs = useMemo(() => {
    switch (category) {
      case 'portrait':
        return {
          title: 'Portraiture',
          tagline: 'Authentic character, soft textures, and storytelling lights.',
          intro: 'A celebration of human vulnerability and character. Using precise light sculpting and intimate focal lengths, this collection uncovers the raw, elegant, and sincere narratives of individuals.',
          accent: 'from-amber-200/10 via-amber-500/5 to-transparent',
          quote: "A portrait is not made in the camera but on either side of it.",
          quoteAuthor: "Edward Steichen"
        };
      case 'wedding':
        return {
          title: 'Weddings of Distinction',
          tagline: 'Romantic storytelling, candid laughter, and historic venues.',
          intro: 'Documenting real connections and heirloom celebrations of love. These are timeless records capturing fleeting emotional expressions, delicate couture laces, and the grand atmospheric details of historic wedding locations.',
          accent: 'from-orange-200/10 via-amber-500/5 to-transparent',
          quote: "To love and be loved is to feel the sun from both sides.",
          quoteAuthor: "David Viscott"
        };
      case 'editorial':
        return {
          title: 'Editorial Works',
          tagline: 'Cinematic compositions, street reflections, and narrative shadows.',
          intro: 'Visual articles reporting on locations and atmospheres. Blending documentary instincts with dramatic art-direction, this series captures urban street lights, moody architectural shadows, and isolation with cinematic precision.',
          accent: 'from-blue-200/10 via-amber-500/5 to-transparent',
          quote: "Photography is a way of feeling, of touching, of loving.",
          quoteAuthor: "Aaron Siskind"
        };
      case 'fashion':
        return {
          title: 'Fashion & Couture',
          tagline: 'Avant-garde block styling, stark shadows, and high contrast.',
          intro: 'Exploring garments, movement, and dramatic geometry. This series is characterized by sharp angles, deliberate posture, color blocks, and extreme lighting setups designed for luxury labels and publications.',
          accent: 'from-fuchsia-200/10 via-amber-500/5 to-transparent',
          quote: "Fashion is about dressing according to what’s fashionable. Style is more about being yourself.",
          quoteAuthor: "Oscar de la Renta"
        };
      case 'fineart':
        return {
          title: 'Fine Art Prints',
          tagline: 'Minimalist abstracts, double-exposures, and meditative scales.',
          intro: 'Quiet contemplation of organic structures and geometric light. From long-exposure sea rollers in Scotland to double-exposure forest canopies in California, this collection focuses on abstract serenity and museum-grade masterprints.',
          accent: 'from-neutral-200/10 via-amber-500/5 to-transparent',
          quote: "The camera is an instrument that teaches people how to see without a camera.",
          quoteAuthor: "Dorothea Lange"
        };
    }
  }, [category]);

  // Load photos
  const filteredPhotos = useMemo(() => {
    let items = allPhotos.filter((p) => p.category === category);

    // Filter by orientation
    if (orientationFilter !== 'all') {
      items = items.filter((p) => p.orientation === orientationFilter);
    }

    // Filter by tone
    if (toneFilter !== 'all') {
      items = items.filter((p) => p.colorPalette === toneFilter);
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'newest') return b.year - a.year;
      return a.year - b.year;
    });

    return items;
  }, [allPhotos, category, orientationFilter, toneFilter, sortBy]);

  // Match package
  const matchingPackage = useMemo(() => {
    if (category === 'portrait') return PACKAGES.find(p => p.id === 'pkg1');
    if (category === 'wedding') return PACKAGES.find(p => p.id === 'pkg3');
    return PACKAGES.find(p => p.id === 'pkg2');
  }, [category]);

  const handleResetFilters = () => {
    setOrientationFilter('all');
    setToneFilter('all');
    setSortBy('newest');
  };

  return (
    <div id={`${category}-gallery-page`} className="space-y-16 py-12">
      {/* Category Header Banner */}
      <section className={`relative rounded-xl border border-neutral-900 bg-gradient-to-b ${themeAttrs.accent} p-8 md:p-16 max-w-7xl mx-auto overflow-hidden`}>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2.5 py-1.5 rounded inline-block">
              Portfolio Category No. 0{['portrait', 'wedding', 'editorial', 'fashion', 'fineart'].indexOf(category) + 1}
            </span>
            <div className="space-y-2">
              <EditableText
                value={siteContent.categoryTitles[category] || themeAttrs.title}
                onSave={(newVal) => updateCategoryText(category, newVal)}
                as="h1"
                label={`${themeAttrs.title} Heading`}
                className="font-sans font-semibold text-3xl md:text-5xl text-white tracking-tight leading-none inline-block"
              />
            </div>
            <p className="font-sans text-xs md:text-sm text-neutral-300 tracking-wide font-medium">
              {themeAttrs.tagline}
            </p>
            <div>
              <EditableText
                value={siteContent.categoryIntros[category] || themeAttrs.intro}
                onSave={(newVal) => updateCategoryText(category, undefined, newVal)}
                as="p"
                multiline
                label={`${themeAttrs.title} Curatorial Intro`}
                className="font-sans text-xs text-neutral-400 leading-relaxed max-w-xl inline-block"
              />
            </div>
          </div>

          <div className="lg:col-span-4 border-l border-neutral-900 pl-6 lg:pl-8 space-y-3.5">
            <p className="font-sans text-xs text-neutral-300 italic leading-relaxed">
              "{themeAttrs.quote}"
            </p>
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
              — {themeAttrs.quoteAuthor}
            </span>
          </div>
        </div>
      </section>

      {/* Control Filters Toolbar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            id="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
              showFilters 
                ? 'border-amber-500/50 bg-amber-500/5 text-amber-500 font-medium' 
                : 'border-neutral-900 bg-neutral-900/10 text-neutral-400 hover:text-white hover:border-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <span className="font-mono text-[10px] text-neutral-500">
            Showing {filteredPhotos.length} of {allPhotos.filter(p => p.category === category).length} Masters
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">Chronology:</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 text-neutral-300 font-sans text-xs rounded px-3 py-1.5 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="newest">Latest Work</option>
            <option value="oldest">Legacy Archives</option>
          </select>
        </div>
      </section>

      {/* Advanced Filter Sliders Panel Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            id="filters-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden"
          >
            <div className="bg-neutral-900/10 border border-neutral-900 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Orientation Filter */}
              <div className="space-y-3">
                <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Image Aspect/Orientation</span>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'portrait', 'landscape', 'square'] as const).map((orient) => (
                    <button
                      key={orient}
                      id={`btn-filter-orient-${orient}`}
                      onClick={() => setOrientationFilter(orient)}
                      className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-widest border focus:outline-none transition-all cursor-pointer ${
                        orientationFilter === orient
                          ? 'border-amber-500/40 bg-amber-500/5 text-amber-500 font-semibold'
                          : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {orient}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tones Filter */}
              <div className="space-y-3">
                <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Vibe & Tone Filter</span>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'warm', 'cool', 'monochrome', 'vibrant', 'muted'] as const).map((tone) => (
                    <button
                      key={tone}
                      id={`btn-filter-tone-${tone}`}
                      onClick={() => setToneFilter(tone)}
                      className={`px-3 py-1.5 rounded text-[10px] font-sans uppercase tracking-widest border focus:outline-none transition-all cursor-pointer ${
                        toneFilter === tone
                          ? 'border-amber-500/40 bg-amber-500/5 text-amber-500 font-semibold'
                          : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Box */}
              <div className="flex flex-col justify-end space-y-3">
                <button
                  id="btn-filter-reset"
                  onClick={handleResetFilters}
                  className="w-full py-2 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all rounded text-[10px] font-sans font-semibold uppercase tracking-widest cursor-pointer"
                >
                  Clear All Selection Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Photographic Masonry Stagger Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 border border-neutral-900 rounded-lg bg-neutral-900/10 space-y-4">
            <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-sans font-medium text-base text-white">No Matching Works Found</h3>
            <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any masterprints matching the selected orientation or color tone parameters. Try resetting filters.
            </p>
            <button
              id="no-match-reset-btn"
              onClick={handleResetFilters}
              className="text-amber-500 hover:text-amber-400 font-mono text-xs tracking-wider uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Split photos into columns for perfect masonry look */}
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const colPhotos = filteredPhotos.filter((_, idx) => idx % 3 === colIndex);
              return (
                <div key={colIndex} className="flex flex-col gap-8">
                  {colPhotos.map((photo) => {
                    const originalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                    return (
                      <motion.div
                        key={photo.id}
                        layoutId={`grid-card-${photo.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-neutral-950 border border-neutral-900 hover:border-amber-500/40 rounded overflow-hidden flex flex-col justify-between shadow-lg relative transition-all duration-300"
                      >
                        {/* Hover Edit Overlay for Admins & Editors */}
                        <PhotoHoverOverlay photo={photo} />

                        {/* Img Box */}
                        <div
                          onClick={() => openLightbox(filteredPhotos, originalIndex)}
                          className="relative overflow-hidden cursor-pointer bg-neutral-900 aspect-[3/4] sm:aspect-auto"
                        >
                          <ImagePreloader
                            src={photo.url}
                            alt={photo.title}
                            version={photo.version}
                            style={getPhotoFilterStyle(photo.filters)}
                            className="opacity-60 group-hover:opacity-85 group-hover:scale-[1.01] transition-all duration-500"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                            <span className="flex items-center space-x-1.5 text-amber-500 font-mono text-[10px] uppercase tracking-wider">
                              <Eye className="w-4 h-4" />
                              <span>View Settings & Story</span>
                            </span>
                          </div>
                        </div>

                        {/* Metadata Box */}
                        <div className="p-5 space-y-3 bg-neutral-980 border-t border-neutral-900/50">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-sans font-medium text-sm text-neutral-100 group-hover:text-amber-500 transition-colors">
                              {photo.title}
                            </h3>
                            <span className="font-mono text-[9px] text-neutral-500">{photo.year}</span>
                          </div>

                          <p className="font-sans text-xs text-neutral-400 leading-relaxed truncate">
                            {photo.description}
                          </p>

                          <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500 pt-1.5 border-t border-neutral-900">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {photo.location}
                            </span>
                            <span>{photo.exif.aperture} • {photo.exif.shutterSpeed}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Services and Pricing Commissions Board */}
      {matchingPackage && (
        <section id="category-services-pitch" className="max-w-7xl mx-auto px-6 md:px-12 pt-12 border-t border-neutral-900">
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">
                Available Booking Services
              </span>
              <h2 className="font-sans font-semibold text-2xl text-white tracking-tight">
                {matchingPackage.name}
              </h2>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                {matchingPackage.description} <em>Best suited for: {matchingPackage.idealFor}</em>
              </p>

              <div className="space-y-2 mt-2">
                <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Service Deliverables include:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-neutral-300">
                  {matchingPackage.deliverables.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-900 pt-6 lg:pt-0 lg:pl-12 flex flex-col justify-center items-center text-center space-y-5">
              <div>
                <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Investiment Range</span>
                <span className="text-2xl font-sans font-bold text-amber-500 mt-1 block">{matchingPackage.priceRange}</span>
                <span className="text-neutral-400 font-mono text-[10px] mt-0.5 block">Estimated duration: {matchingPackage.duration}</span>
              </div>

              <button
                id="booking-pitch-btn"
                onClick={() => setCurrentPage('contact')}
                className="w-full max-w-xs btn-theme-primary py-3.5 rounded-xl text-xs font-sans font-bold uppercase tracking-widest transition-all cursor-pointer inline-flex items-center justify-center space-x-1.5 shadow-lg"
              >
                <span>Reserve This Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
