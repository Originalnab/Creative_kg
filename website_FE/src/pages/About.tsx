import { useState } from 'react';
import { Camera, BookOpen, Award, Target, Landmark, HelpCircle, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PHOTOGRAPHER_NAME, GEAR_ITEMS, MILESTONES } from '../data/photographyData';
import { useAdmin } from '../context/AdminContext';
import EditableText from '../components/EditableText';

export default function About() {
  const { siteContent, updateSiteContentField } = useAdmin();
  const [selectedGearId, setSelectedGearId] = useState('g1');

  const selectedGear = GEAR_ITEMS.find(g => g.id === selectedGearId);

  return (
    <div id="about-page" className="space-y-24 py-12">
      {/* Bio Visual Block */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Portrait/Hero */}
        <div className="lg:col-span-5 relative aspect-[3/4] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900/10">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
            alt={PHOTOGRAPHER_NAME}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-75 filter grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold block">Self Portrait</span>
            <h3 className="font-sans font-medium text-lg text-white mt-1">{siteContent.aboutStudioTitle}</h3>
            <span className="font-mono text-[8px] text-neutral-500 block uppercase tracking-widest">SoHo Studio, 2026</span>
          </div>
        </div>

        {/* Right Side Bio Text */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-2.5">
            <EditableText
              value={siteContent.aboutStudioBadge}
              onSave={(val) => updateSiteContentField('aboutStudioBadge', val)}
              label="Studio Badge"
              className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-semibold block"
            />
            <div>
              <EditableText
                value={siteContent.aboutStudioTitle}
                onSave={(val) => updateSiteContentField('aboutStudioTitle', val)}
                as="h1"
                label="Studio Brand Title"
                className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight leading-none inline-block"
              />
            </div>
            <div>
              <EditableText
                value={siteContent.aboutPhotographerTitle}
                onSave={(val) => updateSiteContentField('aboutPhotographerTitle', val)}
                as="h2"
                label="Photographer Discipline Title"
                className="font-sans text-neutral-400 text-xs md:text-sm tracking-wide uppercase inline-block"
              />
            </div>
          </div>

          <div className="w-12 h-0.5 bg-amber-500/80 rounded" />

          <div>
            <EditableText
              value={siteContent.aboutBio}
              onSave={(val) => updateSiteContentField('aboutBio', val)}
              as="p"
              multiline
              label="Photographer Bio Statement"
              className="font-sans text-neutral-300 text-xs md:text-sm leading-relaxed whitespace-pre-line inline-block"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-neutral-900/15 border border-neutral-900/40 rounded-lg p-5">
            <div className="space-y-1">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Main Base</span>
              <EditableText
                value={siteContent.aboutMainBase}
                onSave={(val) => updateSiteContentField('aboutMainBase', val)}
                label="Main Base"
                className="font-sans text-xs text-neutral-200 block font-medium"
              />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Representation</span>
              <EditableText
                value={siteContent.aboutRepresentation}
                onSave={(val) => updateSiteContentField('aboutRepresentation', val)}
                label="Agency Representation"
                className="font-sans text-xs text-neutral-200 block font-medium"
              />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Core Lenses</span>
              <EditableText
                value={siteContent.aboutCoreLenses}
                onSave={(val) => updateSiteContentField('aboutCoreLenses', val)}
                label="Core Lenses"
                className="font-sans text-xs text-neutral-200 block font-medium"
              />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">Medium Format</span>
              <EditableText
                value={siteContent.aboutMediumFormat}
                onSave={(val) => updateSiteContentField('aboutMediumFormat', val)}
                label="Medium Format Camera"
                className="font-sans text-xs text-neutral-200 block font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio Gear Bag */}
      <section id="gear-bag" className="bg-neutral-900/10 border-y border-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">The Hardware</span>
            <h2 className="font-sans font-semibold text-2xl md:text-3xl text-white tracking-tight">
              Interactive Gear Bag Explorer
            </h2>
            <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Every photograph is bounded by the optical tool that resolves it. Select an item below to see detailed tech specifications and creative rationale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column list */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {GEAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`gear-item-${item.id}`}
                  onClick={() => setSelectedGearId(item.id)}
                  className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus:outline-none cursor-pointer ${
                    selectedGearId === item.id
                      ? 'border-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/5'
                      : 'border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900/50 hover:border-neutral-850'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2 rounded-md ${selectedGearId === item.id ? 'bg-amber-500/15 text-amber-500' : 'bg-neutral-900 text-neutral-400'}`}>
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-sans font-medium text-xs text-white block">{item.name}</span>
                      <span className="font-mono text-[9px] text-neutral-500 uppercase mt-0.5 block">{item.type}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500">0{GEAR_ITEMS.indexOf(item) + 1}</span>
                </button>
              ))}
            </div>

            {/* Right Column details card */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-lg p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {selectedGear && (
                  <motion.div
                    key={selectedGear.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 relative z-10"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">
                        Active Selection Specs
                      </span>
                      <h3 className="font-sans font-semibold text-xl text-white mt-4 tracking-tight">
                        {selectedGear.name}
                      </h3>
                      <p className="font-sans text-xs text-neutral-300 mt-2 font-medium">
                        {selectedGear.specs}
                      </p>
                    </div>

                    <div className="w-12 h-0.5 bg-neutral-900" />

                    <div className="space-y-4">
                      <span className="text-neutral-500 font-mono text-[8px] uppercase tracking-wider block">Studio Rationale</span>
                      <p className="font-sans text-xs text-neutral-400 leading-relaxed italic">
                        "{selectedGear.description}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-8 border-t border-neutral-900 mt-8 flex items-center justify-between font-mono text-[10px] text-neutral-500 relative z-10">
                <span className="flex items-center">
                  <HardDrive className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  Archival Calibrated
                </span>
                <span>Calibrated for RGB & Adobe sRGB</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Milestones timeline */}
      <section id="timeline" className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Career Genesis</span>
          <h2 className="font-sans font-semibold text-2xl md:text-3xl text-white tracking-tight">
            Visionary Chronology
          </h2>
          <p className="font-sans text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            A decade-long dedication tracing solo museum exhibitions, prestigious publication cover assignments, and global photography accolades.
          </p>
        </div>

        <div className="relative border-l border-neutral-900 pl-6 md:pl-10 ml-4 space-y-12">
          {MILESTONES.map((milestone, index) => (
            <div key={milestone.year} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full border border-amber-500/50 bg-neutral-950 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              </div>

              <div className="space-y-2 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-sans font-bold text-lg text-amber-500 tracking-tight block">
                    {milestone.year} — {milestone.title}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">
                    {milestone.location}
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-2xl">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
