import { useState } from 'react';
import { X, Trash2, Edit3, Filter, CheckSquare, Square, CornerUpRight, Lock, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { PhotoVisibility } from '../types';

export default function BulkManageModal() {
  const {
    showBulkManageModal,
    setShowBulkManageModal,
    photos,
    setEditingPhoto,
    bulkDeletePhotos,
    updatePhoto,
    clients,
  } = useAdmin();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeVisibilityFilter, setActiveVisibilityFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkTargetCategory, setBulkTargetCategory] = useState<'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart'>('portrait');
  const [bulkTargetVisibility, setBulkTargetVisibility] = useState<PhotoVisibility>('public');

  if (!showBulkManageModal) return null;

  const filteredPhotos = photos.filter(p => {
    const matchesCategory = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
    const matchesVisibility =
      activeVisibilityFilter === 'all' ||
      (activeVisibilityFilter === 'public' && (!p.visibility || p.visibility === 'public')) ||
      p.visibility === activeVisibilityFilter;
    return matchesCategory && matchesVisibility;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedIds.length === filteredPhotos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPhotos.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} photo(s)?`)) {
      bulkDeletePhotos(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkReassignCategory = () => {
    if (!selectedIds.length) return;
    selectedIds.forEach(id => {
      updatePhoto(id, { category: bulkTargetCategory });
    });
    setSelectedIds([]);
  };

  const handleBulkReassignVisibility = () => {
    if (!selectedIds.length) return;
    selectedIds.forEach(id => {
      updatePhoto(id, { visibility: bulkTargetVisibility });
    });
    setSelectedIds([]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Photo Archive, Visibility & Bulk Manager</h2>
            </div>
            <button
              onClick={() => setShowBulkManageModal(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Filter Tabs */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-neutral-400 mr-2">Category:</span>
                {(['all', 'portrait', 'wedding', 'editorial', 'fashion', 'fineart'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategoryFilter(cat);
                      setSelectedIds([]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Visibility Filter */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-900">
                <span className="text-[10px] font-mono uppercase text-neutral-400 mr-2">Visibility:</span>
                {[
                  { id: 'all', label: 'All Visibility' },
                  { id: 'public', label: '🌐 Public Only' },
                  { id: 'client_only', label: '🔒 Client Only' },
                  { id: 'both', label: '⚡ Dual (Client + Public)' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVisibilityFilter(v.id);
                      setSelectedIds([]);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeVisibilityFilter === v.id
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selection & Batch Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-950/80 border border-neutral-850 rounded-xl">
              <div className="flex items-center space-x-3">
                <button
                  onClick={selectAllFiltered}
                  className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  {selectedIds.length === filteredPhotos.length && filteredPhotos.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-500" />
                  )}
                  <span>Select All ({selectedIds.length}/{filteredPhotos.length})</span>
                </button>

                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-1 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-mono transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedIds.length})</span>
                  </button>
                )}
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={bulkTargetVisibility}
                    onChange={(e) => setBulkTargetVisibility(e.target.value as PhotoVisibility)}
                    className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="public">Make Public</option>
                    <option value="client_only">Make Client Only</option>
                    <option value="both">Make Dual Published</option>
                  </select>
                  <button
                    onClick={handleBulkReassignVisibility}
                    className="px-3 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Apply Visibility
                  </button>
                </div>
              )}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPhotos.map(photo => {
                const isSelected = selectedIds.includes(photo.id);

                return (
                  <div
                    key={photo.id}
                    onClick={() => toggleSelect(photo.id)}
                    className={`group relative aspect-[3/4] bg-neutral-950 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover opacity-75 group-hover:opacity-90" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <div className="p-1 rounded bg-black/60 backdrop-blur-sm text-white">
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> : <Square className="w-3.5 h-3.5 opacity-60" />}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPhoto(photo);
                        }}
                        className="p-1 rounded bg-amber-500 text-neutral-950 shadow-md hover:scale-110 transition-transform"
                        title="Edit Photo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1">
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase">
                        <span className="text-amber-400">{photo.category}</span>
                        <span className={photo.visibility === 'client_only' ? 'text-rose-400' : photo.visibility === 'both' ? 'text-amber-400' : 'text-neutral-400'}>
                          {photo.visibility === 'client_only' ? '🔒 Client' : photo.visibility === 'both' ? '⚡ Dual' : '🌐 Public'}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{photo.title}</h4>
                      {photo.clientName && (
                        <p className="text-[9px] text-neutral-400 truncate">Client: {photo.clientName}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
