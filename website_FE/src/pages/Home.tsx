import { useState } from 'react';
import { Camera, ArrowRight, Quote, Heart, MapPin, Sparkles, Sliders, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PHOTOGRAPHER_NAME, PHOTOGRAPHER_TITLE, TESTIMONIALS } from '../data/photographyData';
import { useAdmin } from '../context/AdminContext';
import { Photo } from '../types';
import EditableText from '../components/EditableText';
import PhotoHoverOverlay from '../components/PhotoHoverOverlay';
import { getPhotoFilterStyle } from '../utils/photoFilters';
import { getCacheBustedUrl } from '../utils/mediaCache';
import HeroSlider from '../components/HeroSlider';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  openLightbox: (photosArr: Photo[], index: number) => void;
}

export default function Home({ setCurrentPage, openLightbox }: HomeProps) {
  const {
    publicPhotos: allPhotos,
    isAdmin,
    isTeamMember,
    siteContent,
    updateSiteContentField,
    setEditingPhoto
  } = useAdmin();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Style advisor quiz states
  const [quizStep, setQuizStep] = useState(0); // 0 = not started, 1 = q1, 2 = q2, 3 = q3, 4 = results
  const [quizAnswers, setQuizAnswers] = useState({
    environment: '', // 'studio' or 'natural'
    tone: '',        // 'monochrome' or 'vibrant' or 'warm'
    mood: ''         // 'candid' or 'conceptual'
  });

  const featuredPhotos = allPhotos.slice(0, 4);

  const stats = [
    { value: '10+', label: 'Years of Vision' },
    { value: '30+', label: 'Published Covers' },
    { value: '15+', label: 'Global Cities' },
    { value: '180+', label: 'Happy Clients' }
  ];

  const categories = [
    { id: 'portrait', title: 'Portraiture', desc: 'Sincere storytelling exploring authentic character under custom lighting.', bg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600' },
    { id: 'wedding', title: 'Weddings', desc: 'Timeless documentations of candid connection and romantic celebrations.', bg: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600' },
    { id: 'editorial', title: 'Editorial', desc: 'Narrative-heavy, moody street and cinematic architectural imagery.', bg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600' },
    { id: 'fashion', title: 'Fashion', desc: 'High-contrast avant-garde couture, street styles, and studio lookbooks.', bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600' },
    { id: 'fineart', title: 'Fine Art', desc: 'Minimalist, conceptual, double-exposures and landscape rollers.', bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600' }
  ];

  // Advisor logic
  const handleQuizAnswer = (key: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [key]: value }));
    setQuizStep(prev => prev + 1);
  };

  const getQuizRecommendation = () => {
    const { environment, tone, mood } = quizAnswers;
    if (mood === 'candid' && environment === 'natural') {
      return {
        category: 'wedding',
        title: 'Documentary & Candid Celebrations',
        desc: 'You cherish unposed, timeless storytelling. You gravitate toward raw, heartfelt connections occurring naturally in glorious locations.',
        photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800'
      };
    }
    if (environment === 'studio' && tone === 'vibrant') {
      return {
        category: 'fashion',
        title: 'High-Fashion & Studio Couture',
        desc: 'You love bold visual statements, architectural structures, vibrant block styling, and dramatic professional lighting control.',
        photo: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'
      };
    }
    if (tone === 'monochrome' || mood === 'conceptual') {
      return {
        category: 'fineart',
        title: 'Conceptual Fine Art',
        desc: 'You seek quiet contemplation and museum-grade aesthetics. Minimal landscapes, abstract shadows, and double-exposure details speak to your artistic soul.',
        photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800'
      };
    }
    if (environment === 'studio') {
      return {
        category: 'portrait',
        title: 'Legacy Fine Art Portraiture',
        desc: 'You value deep character exploration. A studio environment with focused lighting setup will bring out your striking, classical form.',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800'
      };
    }
    return {
      category: 'editorial',
      title: 'Cinematic Street & Editorial',
      desc: 'You are inspired by films, narratives, urban shadows, and environmental backdrops that speak volumes about a person\'s journey.',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800'
    };
  };

  const recommendation = getQuizRecommendation();

  return (
    <div id="home-page" className="space-y-24">
      {/* Modern Cinematic Hero Slider with Full Live Editing */}
      <HeroSlider onNavigate={setCurrentPage} />

      {/* Philosophy Statement */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-semibold block">
            Creative Creed
          </span>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            We believe that photography and cinema are not just recordings of physical matter.
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="font-sans text-neutral-400 text-sm leading-relaxed">
            It is a meticulous, painterly sculpture created from photons, shadow densities, and emotional timings. Whether capturing a high-fashion lookbook in Paris, producing a premium cinematic commercial, or printing a monochrome abstract wave, our mandate remains constant: <strong>reveal the deeper poetic truth.</strong>
          </p>
        </div>
      </section>

      {/* Dynamic Staggered Category Bento */}
      <section id="categories-grid" className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
            Curated Collections
          </span>
          <h2 className="font-sans font-medium text-3xl text-white tracking-tight">
            Explore Portfolio Spheres
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setCurrentPage(cat.id)}
              className="group relative h-96 rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900/10 flex flex-col justify-end p-6 cursor-pointer"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.bg}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <span className="font-mono text-[10px] text-amber-500">0{idx + 1}</span>
                <h3 className="font-sans font-medium text-lg text-white leading-tight group-hover:text-amber-500 transition-colors">
                  {cat.title}
                </h3>
                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center space-x-1.5 text-neutral-300 group-hover:text-amber-500 transition-colors font-mono text-[10px] uppercase tracking-wider">
                  <span>Enter Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase Showcase Horizontal Split Slider */}
      <section className="bg-neutral-900/20 py-20 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <EditableText
                value={siteContent.showcaseSubheading}
                onSave={(newVal) => updateSiteContentField('showcaseSubheading', newVal)}
                label="Featured Section Subtitle"
                className="font-mono text-[10px] uppercase tracking-widest text-amber-500 block"
              />
              <EditableText
                value={siteContent.showcaseHeading}
                onSave={(newVal) => updateSiteContentField('showcaseHeading', newVal)}
                as="h2"
                label="Featured Section Heading"
                className="font-sans font-medium text-3xl text-white tracking-tight block"
              />
            </div>
            <button
              id="showcase-view-all"
              onClick={() => setCurrentPage('gallery')}
              className="font-mono text-xs text-amber-500 hover:text-amber-400 flex items-center space-x-1.5 focus:outline-none cursor-pointer"
            >
              <span>View All 20+ Masterprints</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(featuredPhotos, index)}
                className="group relative aspect-square md:aspect-[3/4] overflow-hidden rounded-lg bg-neutral-950 border border-neutral-900 hover:border-amber-500/40 cursor-pointer transition-all duration-300"
              >
                {/* Hover Edit Overlay for Admins & Editors */}
                <PhotoHoverOverlay photo={photo} />

                <img
                  key={photo.id + (photo.version || '')}
                  src={getCacheBustedUrl(photo.url, photo.version)}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  style={getPhotoFilterStyle(photo.filters)}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-left space-y-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500 block">
                    {photo.category} Collection
                  </span>
                  <h4 className="font-sans font-medium text-sm text-white truncate">
                    {photo.title}
                  </h4>
                  <span className="font-mono text-[9px] text-neutral-400 block">
                    {photo.location} • ISO {photo.exif.iso}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Visual Advisor Quiz */}
      <section id="style-advisor" className="max-w-4xl mx-auto px-6">
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-semibold block">
              Digital Style Advisor
            </span>
            <h2 className="font-sans font-semibold text-2xl md:text-3xl text-white tracking-tight">
              Find Your Creative Photography Vibe
            </h2>
            <p className="font-sans text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Answer 3 brief questions and our visual algorithm will recommend the photography category, lighting mood, and services tailored to your aesthetic.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {quizStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 py-6"
              >
                <div className="flex justify-center space-x-2 text-amber-500/80">
                  <Sliders className="w-8 h-8" />
                </div>
                <button
                  id="quiz-start-btn"
                  onClick={() => setQuizStep(1)}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans font-medium text-xs tracking-widest uppercase px-8 py-3.5 rounded transition-all focus:outline-none cursor-pointer inline-block"
                >
                  Start Aesthetics Quiz
                </button>
              </motion.div>
            )}

            {quizStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="font-sans font-medium text-base text-center text-white">
                  1. Which environment captures your attention most?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    id="quiz-ans-studio"
                    onClick={() => handleQuizAnswer('environment', 'studio')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Controlled Studio Settings</span>
                    <span className="font-sans text-xs text-neutral-500 block mt-1.5 leading-relaxed">Cross lighting, deep shadows, neon crosscolors, absolute visual control.</span>
                  </button>
                  <button
                    id="quiz-ans-natural"
                    onClick={() => handleQuizAnswer('environment', 'natural')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Raw Environmental Outdoors</span>
                    <span className="font-sans text-xs text-neutral-500 block mt-1.5 leading-relaxed">Golden hours, wind, coastline rollers, forests, dynamic weather elements.</span>
                  </button>
                </div>
              </motion.div>
            )}

            {quizStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="font-sans font-medium text-base text-center text-white">
                  2. What color tone spectrum resonates with your soul?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    id="quiz-ans-mono"
                    onClick={() => handleQuizAnswer('tone', 'monochrome')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Stark Monochrome</span>
                    <span className="font-sans text-[11px] text-neutral-500 block mt-1 leading-relaxed">High-contrast blacks and whites, rich silver tones, architectural geometry.</span>
                  </button>
                  <button
                    id="quiz-ans-warm"
                    onClick={() => handleQuizAnswer('tone', 'warm')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Warm Golden Amber</span>
                    <span className="font-sans text-[11px] text-neutral-500 block mt-1 leading-relaxed">Sunset tones, candlelit warmth, rich bronze skin highlights, inviting warmth.</span>
                  </button>
                  <button
                    id="quiz-ans-vibrant"
                    onClick={() => handleQuizAnswer('tone', 'vibrant')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Vibrant Avant-Garde</span>
                    <span className="font-sans text-[11px] text-neutral-500 block mt-1 leading-relaxed">Neon saturation, high saturation contrast, modern, dynamic.</span>
                  </button>
                </div>
              </motion.div>
            )}

            {quizStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="font-sans font-medium text-base text-center text-white">
                  3. What style of capture captures the truth for you?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    id="quiz-ans-candid"
                    onClick={() => handleQuizAnswer('mood', 'candid')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Documentary & Candid</span>
                    <span className="font-sans text-xs text-neutral-500 block mt-1.5 leading-relaxed">Unposed, authentic laughter, tears, spontaneous gestures, direct connection.</span>
                  </button>
                  <button
                    id="quiz-ans-concept"
                    onClick={() => handleQuizAnswer('mood', 'conceptual')}
                    className="p-5 rounded border border-neutral-800 hover:border-amber-500/50 bg-neutral-950 text-left hover:bg-neutral-900 transition-all cursor-pointer group"
                  >
                    <span className="font-sans font-medium text-sm text-neutral-200 block group-hover:text-amber-500 transition-colors">Conceptual & Art-Directed</span>
                    <span className="font-sans text-xs text-neutral-500 block mt-1.5 leading-relaxed">Deliberate composition, cinematic storytelling, double-exposures, deliberate posture.</span>
                  </button>
                </div>
              </motion.div>
            )}

            {quizStep === 4 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 aspect-[4/5] rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img
                      src={recommendation.photo}
                      alt={recommendation.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-7 space-y-4 text-left">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">
                      Ideal Aesthetic: {recommendation.category.toUpperCase()}
                    </span>
                    <h3 className="font-sans font-semibold text-xl text-white tracking-tight">
                      {recommendation.title}
                    </h3>
                    <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                      {recommendation.desc}
                    </p>
                    <div className="flex gap-3 pt-2">
                      <button
                        id="quiz-btn-enter-category"
                        onClick={() => setCurrentPage(recommendation.category)}
                        className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans font-medium text-xs tracking-widest uppercase px-5 py-3 rounded transition-all cursor-pointer"
                      >
                        Enter Collection
                      </button>
                      <button
                        id="quiz-btn-retry"
                        onClick={() => {
                          setQuizStep(0);
                          setQuizAnswers({ environment: '', tone: '', mood: '' });
                        }}
                        className="bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white border border-neutral-850 px-5 py-3 rounded text-xs font-sans uppercase tracking-widest cursor-pointer"
                      >
                        Reset Advisor
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Elegant Testimonial Slider */}
      <section id="testimonials" className="max-w-4xl mx-auto px-6">
        <div className="bg-neutral-900/10 border border-neutral-900/50 rounded-lg p-8 md:p-12 relative text-center">
          <Quote className="w-8 h-8 text-amber-500/30 mx-auto mb-6" />

          <div className="h-44 md:h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="font-sans text-sm md:text-base text-neutral-300 italic leading-relaxed max-w-2xl mx-auto">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                <div>
                  <h4 className="font-sans font-medium text-sm text-white">
                    {TESTIMONIALS[activeTestimonial].name}
                  </h4>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                    {TESTIMONIALS[activeTestimonial].role} ({TESTIMONIALS[activeTestimonial].category})
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                id={`testimonial-dot-${idx}`}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all focus:outline-none cursor-pointer ${
                  activeTestimonial === idx ? 'bg-amber-500 w-6' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Publications Board */}
      <section id="publications" className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        <div className="text-center space-y-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Press & Prints</span>
          <h2 className="font-sans font-medium text-2xl text-white tracking-tight">Editorial Publications</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40">
          <div className="text-center font-sans font-bold text-lg tracking-[0.25em] text-neutral-400 hover:text-white transition-colors cursor-default">VOGUE</div>
          <div className="text-center font-serif italic text-xl tracking-wider text-neutral-400 hover:text-white transition-colors cursor-default">Kinfolk</div>
          <div className="text-center font-sans font-semibold text-lg tracking-widest text-neutral-400 hover:text-white transition-colors cursor-default">BAZAAR</div>
          <div className="text-center font-mono text-sm tracking-widest text-neutral-400 hover:text-white transition-colors cursor-default">CEREAL</div>
          <div className="text-center font-serif font-bold text-lg tracking-tight text-neutral-400 hover:text-white transition-colors cursor-default">GEO TRAVEL</div>
        </div>
      </section>

      {/* Metrics Board */}
      <section id="metrics" className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-y border-neutral-900 py-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <span className="font-sans font-extrabold text-3xl md:text-5xl text-amber-500 block tracking-tight">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
