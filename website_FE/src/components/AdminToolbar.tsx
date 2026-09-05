import { ShieldAlert, Upload, Layers, Edit3, RotateCcw, LogOut, Settings, Users, Crown, Palette, HardDrive, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminContext';

export default function AdminToolbar() {
  const {
    isTeamMember,
    isAdmin,
    isSuperAdmin,
    isEditor,
    canManageBilling,
    logout,
    setShowSuperAdminModal,
    setShowClientManagerModal,
    setShowMediaStorageModal,
    mediaAssets,
    setShowHeroSliderModal,
    heroSlides,
    setShowBulkUploadModal,
    setShowBulkManageModal,
    setShowMenuEditorModal,
    resetDefaults,
    photos,
    clients,
    isLiveEditMode,
    toggleLiveEditMode,
    systemSettings,
  } = useAdmin();

  if (!isTeamMember) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[90] bg-gradient-to-r from-amber-950/95 via-neutral-900/98 to-amber-950/95 border-b border-amber-500/30 backdrop-blur-md text-white shadow-xl py-2 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Status Badge */}
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-mono font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
            {isSuperAdmin ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Super Admin Active</span>
              </>
            ) : isEditor ? (
              <>
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Editor Mode (Media & Content)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Edit Mode</span>
              </>
            )}
          </span>
          <span className="hidden sm:inline text-neutral-400 font-mono">
            ({photos.length} Photos {canManageBilling && `• ${clients.length} Clients`})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Frontend Visual Edit Mode Toggle */}
          <button
            onClick={toggleLiveEditMode}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-md ${
              isLiveEditMode
                ? 'bg-amber-500 text-neutral-950 shadow-amber-500/25 ring-1 ring-amber-300'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
            }`}
            title="Toggle Live Visual Edit Mode (Click directly on headings, captions, and pictures to edit)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Live Edit: {isLiveEditMode ? 'ON' : 'OFF'}</span>
            {isLiveEditMode && (
              <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse ml-0.5" />
            )}
          </button>

          {/* System Setup Button (Admin & Super Admin) */}
          {isAdmin && (
            <button
              onClick={() => setShowSuperAdminModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold tracking-wide transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              title="Configure Website Branding, Favicon, SEO, Google Drive & Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>⚙️ System Setup</span>
              {systemSettings?.isGoogleDriveConnected && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-800 border border-emerald-300 ml-0.5" title="Google Drive Connected" />
              )}
            </button>
          )}

          {/* Client & Billing Management Button (Admin & Super Admin only) */}
          {canManageBilling && (
            <button
              onClick={() => setShowClientManagerModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold border border-amber-500/30 transition-all cursor-pointer"
              title="Manage client accounts, lock galleries, and record payments"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients & Billing</span>
            </button>
          )}

          {/* System Media Storage Vault Button */}
          <button
            onClick={() => setShowMediaStorageModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sky-300 font-semibold border border-sky-500/30 transition-all cursor-pointer shadow-sm"
            title="Open System Media Storage Vault and Google Drive Folders"
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>📁 Media Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-950 text-sky-300 border border-sky-800/50">
              {mediaAssets.length}
            </span>
          </button>

          {/* Hero Slider Button */}
          <button
            onClick={() => setShowHeroSliderModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium border border-neutral-700 transition-all cursor-pointer"
            title="Manage Hero Slides, Background Images & Headings"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>🎞️ Hero Slider ({heroSlides.length})</span>
          </button>

          {/* Bulk Upload Button */}
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold tracking-wide transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            title="Upload single or multiple images and assign pages"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Bulk Upload</span>
          </button>

          {/* Photo Manager Button */}
          <button
            onClick={() => setShowBulkManageModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium border border-neutral-700 transition-all cursor-pointer"
            title="Manage photos, filter by page, or bulk delete"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Photos</span>
          </button>

          {/* Menu Editor */}
          <button
            onClick={() => setShowMenuEditorModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium border border-neutral-700 transition-all cursor-pointer"
            title="Rename page navigation labels"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Menus</span>
          </button>

          {/* Reset Defaults */}
          <button
            onClick={resetDefaults}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-all cursor-pointer"
            title="Reset to original demo content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
            title="Exit Team Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
