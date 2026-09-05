import React, { useState, useMemo } from 'react';
import {
  X,
  Folder,
  FolderPlus,
  Upload,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  Cloud,
  Check,
  Eye,
  Plus,
  ArrowRight,
  HardDrive,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { MediaAsset } from '../types';
import { getCacheBustedUrl } from '../utils/mediaCache';

export default function SystemMediaModal() {
  const {
    showMediaStorageModal,
    setShowMediaStorageModal,
    mediaAssets,
    systemSettings,
    createGoogleDriveFolder,
    uploadToMediaStorage,
    deleteMediaAsset,
    selectMediaForPicker,
    isMediaPickerMode,
    clients
  } = useAdmin();

  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Ingestion & Folder Creation State
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<any>('portrait');
  const [uploadClientId, setUploadClientId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const folders = useMemo(() => {
    return systemSettings.googleDriveFolders || [
      'General Master Archive',
      'Portraits & Headshots',
      'Weddings 2026',
      'Fashion & Runways',
      'Editorial Client Deliveries'
    ];
  }, [systemSettings.googleDriveFolders]);

  // Set default upload folder if unset
  const targetUploadFolder = uploadFolder || (activeFolder !== 'all' ? activeFolder : folders[0] || 'General Master Archive');

  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      const matchesFolder = activeFolder === 'all' || asset.googleDriveFolder === activeFolder;
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.googleDriveFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.clientName && asset.clientName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFolder && matchesCategory && matchesSearch;
    });
  }, [mediaAssets, activeFolder, selectedCategory, searchQuery]);

  if (!showMediaStorageModal) return null;

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    createGoogleDriveFolder(trimmed);
    setActiveFolder(trimmed);
    setUploadFolder(trimmed);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const added = await uploadToMediaStorage(files, targetUploadFolder, uploadCategory, uploadClientId);
      if (added.length > 0) {
        setSelectedAsset(added[0]);
      }
      setShowUploadZone(false);
    } catch (err) {
      console.error('Upload to media storage failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    const url = getCacheBustedUrl(asset.url, asset.version);
    navigator.clipboard.writeText(url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectForPhoto = (asset: MediaAsset) => {
    selectMediaForPicker(asset);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-7xl h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold tracking-wide uppercase font-mono text-white">
                    System Media Storage Vault
                  </h2>
                  {isMediaPickerMode && (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-mono font-black uppercase tracking-wider animate-pulse">
                      Select Mode Active
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono mt-0.5">
                  <Cloud className="w-3.5 h-3.5 text-sky-400" />
                  <span>Google Drive: {systemSettings.googleDriveFolderRoot}</span>
                  <span className="text-neutral-600">•</span>
                  <span className={systemSettings.isGoogleDriveConnected ? 'text-emerald-400' : 'text-neutral-400'}>
                    {systemSettings.isGoogleDriveConnected
                      ? `● Synchronized (${systemSettings.googleAccountEmail || 'Connected'})`
                      : 'Local Storage Mirror'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadZone((prev) => !prev)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  showUploadZone
                    ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{showUploadZone ? 'Close Uploader' : '+ Upload to Folder'}</span>
              </button>

              <button
                onClick={() => setShowMediaStorageModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close Media Storage"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upload Ingestion Drawer */}
          {showUploadZone && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-amber-500/30 bg-neutral-950 p-5 space-y-3 shrink-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase">
                  <Upload className="w-4 h-4" />
                  <span>Mandatory Storage Ingestion Rule: Every image must be placed in a Google Drive folder</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  Target Cloud Folder: <strong className="text-white">📁 {targetUploadFolder}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Select Target Folder
                  </label>
                  <select
                    value={targetUploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-amber-300 font-mono"
                  >
                    {folders.map((f) => (
                      <option key={f} value={f}>
                        📁 {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Gallery Page / Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="wedding">Wedding</option>
                    <option value="editorial">Editorial</option>
                    <option value="fashion">Fashion</option>
                    <option value="fineart">Fine Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Assign to Client (Optional)
                  </label>
                  <select
                    value={uploadClientId}
                    onChange={(e) => setUploadClientId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="">-- General Studio Asset --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shootTitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl bg-neutral-900/50 text-center relative cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFilesUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5 pointer-events-none">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl inline-block text-amber-500 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-neutral-200">
                    {isUploading ? 'Ingesting into Google Drive Storage...' : 'Click or Drag Images to Ingest into Media Storage'}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Supports high-resolution JPG, PNG, TIFF, and WebP masters. Stored in {targetUploadFolder}.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Layout Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Folder Browser */}
            <div className="w-64 border-r border-neutral-800 bg-neutral-950/40 p-4 flex flex-col shrink-0 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 uppercase">
                <span>Folders Registry</span>
                <span className="text-[10px] text-neutral-500">{folders.length} Folders</span>
              </div>

              {/* All Media Assets Tab */}
              <button
                type="button"
                onClick={() => setActiveFolder('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeFolder === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4" />
                  <span>All Media Vault</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFolder === 'all' ? 'bg-neutral-950 text-amber-300' : 'bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {mediaAssets.length}
                </span>
              </button>

              {/* Folder List */}
              <div className="space-y-1">
                {folders.map((folder) => {
                  const count = mediaAssets.filter((a) => a.googleDriveFolder === folder).length;
                  const isActive = activeFolder === folder;
                  return (
                    <button
                      key={folder}
                      type="button"
                      onClick={() => setActiveFolder(folder)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-neutral-800 text-amber-400 font-bold border border-amber-500/40'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        <Folder className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                        <span className="truncate">{folder}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-900 text-neutral-500 shrink-0">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Inline Folder Creation */}
              <div className="pt-3 border-t border-neutral-900">
                {isCreatingFolder ? (
                  <div className="space-y-2 p-2 bg-neutral-900 rounded-xl border border-neutral-800">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateFolder();
                        }
                      }}
                      placeholder="Folder name..."
                      autoFocus
                      className="w-full px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded text-xs text-amber-300 font-mono focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleCreateFolder}
                        className="flex-1 py-1 bg-amber-500 text-neutral-950 font-bold text-[11px] font-mono rounded cursor-pointer"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingFolder(false);
                          setNewFolderName('');
                        }}
                        className="px-2 py-1 bg-neutral-800 text-neutral-400 text-[11px] font-mono rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(true)}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 text-xs font-mono border border-neutral-800 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ New Drive Folder</span>
                  </button>
                )}
              </div>
            </div>

            {/* Center & Right: Assets Grid & Details */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter and Search Bar */}
              <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center space-x-3 flex-1 min-w-[260px]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assets by title, folder, or client..."
                      className="w-full px-3 py-1.5 pl-8 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Filter className="w-3.5 h-3.5 text-neutral-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300"
                    >
                      <option value="all">All Pages</option>
                      <option value="portrait">Portrait</option>
                      <option value="wedding">Wedding</option>
                      <option value="editorial">Editorial</option>
                      <option value="fashion">Fashion</option>
                      <option value="fineart">Fine Art</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-400">
                  Showing <strong className="text-white">{filteredAssets.length}</strong> assets
                </div>
              </div>

              {/* Grid & Preview Split */}
              <div className="flex-1 flex overflow-hidden">
                {/* Thumbnails Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {filteredAssets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <Folder className="w-12 h-12 text-neutral-700 stroke-1" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-300 font-mono">No Media Assets Found</h4>
                        <p className="text-xs text-neutral-500 mt-1">
                          {activeFolder === 'all'
                            ? 'Upload photos to populate your Google Drive media storage'
                            : `Folder "${activeFolder}" is currently empty`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowUploadZone(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono transition-all cursor-pointer"
                      >
                        + Upload Images to This Folder
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                      {filteredAssets.map((asset) => {
                        const isSelected = selectedAsset?.id === asset.id;
                        const bustedUrl = getCacheBustedUrl(asset.url, asset.version);
                        return (
                          <div
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-neutral-950 ${
                              isSelected
                                ? 'border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                                : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <img
                              src={bustedUrl}
                              alt={asset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />

                            {/* Badge Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                              <span className="text-[11px] font-bold text-white truncate line-clamp-1">
                                {asset.title}
                              </span>
                              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-0.5">
                                <span className="truncate">📁 {asset.googleDriveFolder}</span>
                                <span>{asset.fileSize || '3.2 MB'}</span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute top-2 right-2 p-1 bg-amber-500 text-neutral-950 rounded-full shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Inspector Panel */}
                {selectedAsset && (
                  <div className="w-80 border-l border-neutral-800 bg-neutral-950/60 p-5 flex flex-col justify-between shrink-0 overflow-y-auto space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-400">
                          Asset Inspector
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedAsset(null)}
                          className="p-1 text-neutral-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Preview Image */}
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                        <img
                          src={getCacheBustedUrl(selectedAsset.url, selectedAsset.version)}
                          alt={selectedAsset.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Inspector Metadata */}
                      <div className="space-y-2.5 text-xs font-mono">
                        <div>
                          <label className="text-[10px] text-neutral-500 uppercase block">Asset Title</label>
                          <span className="text-neutral-200 font-bold">{selectedAsset.title}</span>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 uppercase block">Google Drive Folder</label>
                          <span className="text-amber-400">📁 {selectedAsset.googleDriveFolder}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-500 uppercase block">File Size</label>
                            <span className="text-neutral-300">{selectedAsset.fileSize || '3.4 MB'}</span>
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 uppercase block">Dimensions</label>
                            <span className="text-neutral-300">{selectedAsset.dimensions || '4000 × 6000'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 uppercase block">Google Drive Cloud Path</label>
                          <span className="text-[10px] text-neutral-400 break-all leading-tight block">
                            {selectedAsset.googleDrivePath || `${systemSettings.googleDriveFolderRoot} / ${selectedAsset.googleDriveFolder}`}
                          </span>
                        </div>

                        {selectedAsset.clientName && (
                          <div>
                            <label className="text-[10px] text-neutral-500 uppercase block">Client Association</label>
                            <span className="text-sky-400">👤 {selectedAsset.clientName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inspector Action Buttons */}
                    <div className="space-y-2 pt-4 border-t border-neutral-900">
                      {isMediaPickerMode && (
                        <button
                          type="button"
                          onClick={() => handleSelectForPhoto(selectedAsset)}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono tracking-wide shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Use This Image to Replace</span>
                        </button>
                      )}

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(selectedAsset)}
                          className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-800 transition-colors cursor-pointer"
                        >
                          {copiedId === selectedAsset.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied URL!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${selectedAsset.title}" from System Media Storage?`)) {
                              deleteMediaAsset(selectedAsset.id);
                              setSelectedAsset(null);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete from Media Storage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
