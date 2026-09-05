import React from 'react';
import { Sliders, Sparkles, Tag, Eye } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Photo } from '../types';

interface PhotoHoverOverlayProps {
  photo: Photo;
  className?: string;
}

export default function PhotoHoverOverlay({ photo, className = '' }: PhotoHoverOverlayProps) {
  const { isTeamMember, isLiveEditMode, setEditingPhoto } = useAdmin();

  if (!isTeamMember) return null;

  return (
    <div
      className={`absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
        isLiveEditMode ? 'bg-black/50 backdrop-blur-[2px] ring-2 ring-amber-500/60' : 'bg-black/30'
      } ${className}`}
    >
      {/* Top Bar with Tags/Category */}
      <div className="flex items-center justify-between pointer-events-auto">
        <span className="px-2 py-0.5 bg-neutral-900/90 text-amber-400 font-mono text-[9px] uppercase tracking-wider rounded border border-amber-500/30 flex items-center gap-1 shadow-lg">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{photo.category}</span>
        </span>

        {photo.tags && photo.tags.length > 0 && (
          <span className="px-2 py-0.5 bg-neutral-900/90 text-neutral-300 font-mono text-[9px] rounded border border-neutral-700 shadow-lg">
            #{photo.tags[0]}
          </span>
        )}
      </div>

      {/* Center Action Button */}
      <div className="flex items-center justify-center pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditingPhoto(photo);
          }}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-all cursor-pointer"
          title="Click to edit and adjust this picture in-place"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Edit & Adjust</span>
        </button>
      </div>

      {/* Bottom info pill */}
      <div className="text-[9px] font-mono text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800 pointer-events-auto truncate text-center">
        {photo.title || 'Untitled Photo'} • {photo.aspectRatio}
      </div>
    </div>
  );
}
