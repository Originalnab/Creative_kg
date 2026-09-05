import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
  label?: string;
}

export default function EditableText({
  value,
  onSave,
  as: Component = 'span',
  className = '',
  multiline = false,
  label = 'Content'
}: EditableTextProps) {
  const { isTeamMember, isLiveEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCommit = () => {
    const trimmed = currentValue.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // If visitor or edit mode is toggled off, render clean standard typography
  if (!isTeamMember || !isLiveEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full max-w-full my-1 z-30 group/edit">
        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-1 bg-neutral-900/90 px-2 py-0.5 rounded border border-amber-500/30">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Editing {label}
          </span>
          <span className="text-neutral-400">{multiline ? 'Ctrl+Enter to save' : 'Enter to save • Esc to cancel'}</span>
        </div>

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full p-2.5 bg-neutral-900/95 border-2 border-amber-500 rounded-xl text-white font-inherit text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xl resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 bg-neutral-900/95 border-2 border-amber-500 rounded-xl text-white font-inherit text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xl"
          />
        )}

        <div className="mt-1.5 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <X className="w-3 h-3 text-rose-400" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleCommit}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold font-mono transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      title={`Click to edit ${label}`}
      className={`relative inline-block cursor-text transition-all group/editable ${className} border border-transparent hover:border-dashed hover:border-amber-500/60 hover:bg-amber-500/5 rounded px-1 -mx-1`}
    >
      {value}

      {/* Floating Edit Pencil Pill on Hover */}
      <span className="absolute -top-3 -right-2 hidden group-hover/editable:flex items-center space-x-1 px-1.5 py-0.5 bg-amber-500 text-neutral-950 text-[9px] font-mono font-black uppercase rounded shadow-lg pointer-events-none z-20">
        <Edit3 className="w-2.5 h-2.5" />
        <span>Edit</span>
      </span>

      {/* Mini saved indicator */}
      {justSaved && (
        <span className="absolute -top-3.5 left-0 px-2 py-0.5 bg-emerald-500 text-neutral-950 text-[9px] font-mono font-bold rounded shadow-lg z-20 animate-bounce">
          Saved ✓
        </span>
      )}
    </div>
  );
}
