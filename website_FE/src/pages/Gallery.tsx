import { useState, useMemo } from 'react';
import { Search, Grid, LayoutGrid, Layers, MapPin, Eye, Film, Info, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from '../types';
import ImagePreloader from '../components/ImagePreloader';
import PhotoHoverOverlay from '../components/PhotoHoverOverlay';
import { getPhotoFilterStyle } from '../utils/photoFilters';
import { useAdmin } from '../context/AdminContext';

interface GalleryProps {
  openLightbox: (photosArr: Photo[], index: number) => void;
}

export default function Gallery({ openLightbox }: GalleryProps) {
  const { publicPhotos: allPhotos, isAdmin, setEditingPhoto } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart'>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'masonry' | 'reel'>('masonry');
  const [selectedReelIdx, setSelectedReelIdx] = useState(0);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'portrait', label: 'Portraiture' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'fineart', label: 'Fine Art' },
  ];

  // Search and filter logic
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || photo.category === activeCategory;

      // Search query filter
      const matchesSearch = 
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        photo.exif.camera.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allPhotos, searchQuery, activeCategory]);

  return (
    <div id="master-gallery-page" className="space-y-12">
      {/* Intro Header Section */}
      <section className="text-center space-y-3 pt-6">
        <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2.5 py-1.5 rounded inline-block">
          Universal Archive
        </span>
        <h1 className="font-sans font-semibold text-3xl md:text-5xl text-white tracking-tight leading-none">
          Master Portfolio Search
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Index, filter, and explore Julian Vance's complete visual archive spanning portraits, editorials, fashion runways, weddings, and abstract fine art series.
        </p>
      </section>

      {/* Exploration Control Bar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
          
          {/* Category Tabs list */}
          <div className="flex flex-wrap gap-2 order-2 lg:order-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`gallery-tab-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSelectedReelIdx(0);
                }}
                className={`px-4 py-2 rounded text-xs font-sans uppercase tracking-widest border focus:outline-none transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'border-amber-500/50 bg-amber-500/5 text-amber-500 font-semibold'
                    : 'border-neutral-900 bg-neutral-900/10 text-neutral-400 hover:text-white hover:border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box inputs */}
          <div className="relative w-full lg:max-w-xs order-1 lg:order-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              id="gallery-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedReelIdx(0);
              }}
              placeholder="Search lens, tag, keyword..."
              className="w-full bg-neutral-950 border border-neutral-900 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

        </div>

        {/* Layout Selector and Summary count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            Found {filteredPhotos.length} Masterworks
          </span>

          <div className="flex items-center space-x-2 bg-neutral-950 border border-neutral-900 rounded p-1">
            <button
              id="gallery-view-grid"
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 rounded transition-all cursor-pointer focus:outline-none ${
                viewStyle === 'grid' ? 'bg-amber-500/15 text-amber-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Symmetric Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="gallery-view-masonry"
              onClick={() => setViewStyle('masonry')}
              className={`p-1.5 rounded transition-all cursor-pointer focus:outline-none ${
                viewStyle === 'masonry' ? 'bg-amber-500/15 text-amber-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Vertical Masonry"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              id="gallery-view-reel"
              onClick={() => setViewStyle('reel')}
              className={`p-1.5 rounded transition-all cursor-pointer focus:outline-none ${
                viewStyle === 'reel' ? 'bg-amber-500/15 text-amber-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Cinematic Reel Viewer"
            >
              <Film className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Showcase Body */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <AnimatePresence mode="wait">
          {filteredPhotos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 border border-neutral-900 rounded-lg bg-neutral-900/10 space-y-4"
            >
              <Info className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="font-sans font-medium text-base text-white">No Archive Found</h3>
              <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any masterprints matching "{searchQuery}" under {activeCategory === 'all' ? 'any collection' : `the ${activeCategory} collection`}.
              </p>
              <button
                id="gallery-clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-amber-500 hover:text-amber-400 font-mono text-xs tracking-wider uppercase cursor-pointer"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : viewStyle === 'grid' ? (
            /* Symmetric Grid Layout */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredPhotos.map((photo, globalIndex) => {
                return (
                  <div
                    key={photo.id}
                    onClick={() => openLightbox(filteredPhotos, globalIndex)}
                    className="group relative aspect-square bg-neutral-950 border border-neutral-900 hover:border-amber-500/40 rounded overflow-hidden cursor-pointer transition-all duration-300"
                  >
                    {/* Hover Edit Overlay for Admins & Editors */}
                    <PhotoHoverOverlay photo={photo} />

                    <ImagePreloader
                      src={photo.url}
                      alt={photo.title}
                      version={photo.version}
                      style={getPhotoFilterStyle(photo.filters)}
                      className="opacity-50 group-hover:opacity-85 group-hover:scale-[1.02] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-left space-y-1">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-amber-500 block">
                        {photo.category} Collection
                      </span>
                      <h4 className="font-sans font-medium text-xs text-white truncate">
                        {photo.title}
                      </h4>
                      <span className="font-mono text-[8px] text-neutral-400 block truncate">
                        {photo.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : viewStyle === 'masonry' ? (
            /* Vertical Stagger Masonry Layout */
            <motion.div
              key="masonry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
            >
              {Array.from({ length: 3 }).map((_, colIndex) => {
                const colPhotos = filteredPhotos.filter((_, idx) => idx % 3 === colIndex);
                return (
                  <div key={colIndex} className="flex flex-col gap-8">
                    {colPhotos.map((photo) => {
                      const globalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                      return (
                        <div
                          key={photo.id}
                          onClick={() => openLightbox(filteredPhotos, globalIndex)}
                          className="group bg-neutral-950 border border-neutral-900 hover:border-amber-500/40 rounded overflow-hidden cursor-pointer flex flex-col justify-between relative transition-all duration-300"
                        >
                          {/* Hover Edit Overlay for Admins & Editors */}
                          <PhotoHoverOverlay photo={photo} />

                          <div className="relative overflow-hidden aspect-[4/5] sm:aspect-auto">
                            <ImagePreloader
                              src={photo.url}
                              alt={photo.title}
                              version={photo.version}
                              style={getPhotoFilterStyle(photo.filters)}
                              className="opacity-60 group-hover:opacity-85 group-hover:scale-[1.01] transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                          </div>

                          <div className="p-4 space-y-1.5 border-t border-neutral-900/50 bg-neutral-980">
                            <span className="font-mono text-[8px] uppercase tracking-wider text-amber-500 block">
                              {photo.category}
                            </span>
                            <h4 className="font-sans font-medium text-xs text-neutral-100 group-hover:text-amber-500 transition-colors">
                              {photo.title}
                            </h4>
                            <div className="flex items-center justify-between font-mono text-[8px] text-neutral-500 pt-1.5 border-t border-neutral-900/40">
                              <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-0.5" />
                                {photo.location}
                              </span>
                              <span>{photo.exif.aperture} • ISO {photo.exif.iso}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* Horizontal Cinematic Filmstrip Reel Layout */
            <motion.div
              key="reel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Selected Highlight Panel */}
              {filteredPhotos[selectedReelIdx] && (
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div
                    onClick={() => {
                      openLightbox(filteredPhotos, selectedReelIdx);
                    }}
                    className="lg:col-span-6 aspect-[4/3] rounded overflow-hidden bg-neutral-950 border border-neutral-850 cursor-pointer group relative"
                  >
                    <ImagePreloader
                      src={filteredPhotos[selectedReelIdx].url}
                      alt={filteredPhotos[selectedReelIdx].title}
                      className="w-full h-full object-contain p-4 opacity-75 group-hover:opacity-90 group-hover:scale-[1.01] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <span className="bg-black/60 backdrop-blur-sm text-amber-500 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                        Open Theater Mode
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-5 text-left">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded inline-block mb-2">
                        {filteredPhotos[selectedReelIdx].category}
                      </span>
                      <h3 className="font-sans font-semibold text-2xl text-white tracking-tight">
                        {filteredPhotos[selectedReelIdx].title}
                      </h3>
                      <p className="font-sans text-xs text-neutral-400 mt-2.5 leading-relaxed">
                        {filteredPhotos[selectedReelIdx].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 font-mono text-[10px] text-neutral-400 border-t border-neutral-900 pt-4">
                      <div>
                        <span className="text-neutral-500 block uppercase text-[8px] tracking-wider">LENS BODY</span>
                        <span>{filteredPhotos[selectedReelIdx].exif.lens}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[8px] tracking-wider">APERTURE</span>
                        <span>{filteredPhotos[selectedReelIdx].exif.aperture}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[8px] tracking-wider">CAMERA MODEL</span>
                        <span>{filteredPhotos[selectedReelIdx].exif.camera}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[8px] tracking-wider">LOCATION</span>
                        <span>{filteredPhotos[selectedReelIdx].location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Horizontal scroll strips */}
              <div className="space-y-2">
                <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Horizontal Filmstrip</span>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-800">
                  {filteredPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedReelIdx(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded border overflow-hidden cursor-pointer transition-all ${
                        selectedReelIdx === index
                          ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/15'
                          : 'border-neutral-900 opacity-50 hover:opacity-100 hover:border-neutral-800'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
