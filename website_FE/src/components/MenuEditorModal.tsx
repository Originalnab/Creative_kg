import React from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';

export default function MenuEditorModal() {
  const { showMenuEditorModal, setShowMenuEditorModal, navItems, updateNavItem } = useAdmin();

  if (!showMenuEditorModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Navigation Menu Names</h2>
            </div>
            <button
              onClick={() => setShowMenuEditorModal(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <p className="text-xs text-neutral-400">
              Rename page menu titles as they appear across the Navbar and mobile navigation drawer.
            </p>

            <div className="space-y-3 pt-2">
              {navItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="w-24 font-mono text-xs uppercase text-amber-400 font-semibold shrink-0">
                    ID: {item.id}
                  </span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateNavItem(item.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-neutral-800 flex justify-end bg-neutral-950/60">
            <button
              onClick={() => setShowMenuEditorModal(false)}
              className="flex items-center space-x-1.5 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Done Editing</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
