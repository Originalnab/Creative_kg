import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Trash2, Layers, Lock, Globe, Users, Cloud, Folder, FolderPlus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { Photo, PhotoVisibility } from '../types';

interface StagedPhoto {
  tempId: string;
  url: string;
  title: string;
  category: 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart';
  description: string;
  visibility: PhotoVisibility;
  clientId: string;
  googleDriveFolder: string;
}

export default function BulkUploadModal() {
  const {
    showBulkUploadModal,
    setShowBulkUploadModal,
    bulkAddPhotos,
    clients,
    systemSettings,
    createGoogleDriveFolder
  } = useAdmin();

  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart'>('portrait');
  const [defaultVisibility, setDefaultVisibility] = useState<PhotoVisibility>('public');
  const [defaultClientId, setDefaultClientId] = useState<string>('');
  const [defaultDriveFolder, setDefaultDriveFolder] = useState<string>(
    systemSettings.googleDriveFolders?.[0] || 'General Master Archive'
  );
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showBulkUploadModal) return null;

  const handleCreateNewFolder = () => {
    const trimmed = newFolderInput.trim();
    if (!trimmed) return;
    createGoogleDriveFolder(trimmed);
    setDefaultDriveFolder(trimmed);
    setNewFolderInput('');
    setIsCreatingFolder(false);
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessing(true);
    let loadedCount = 0;
    const newItems: StagedPhoto[] = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

          newItems.push({
            tempId: `bulk-${Date.now()}-${index}-${Math.random()}`,
            url: reader.result as string,
            title: cleanTitle || `New Asset ${index + 1}`,
            category: defaultCategory,
            description: `Uploaded asset on ${new Date().toLocaleDateString()}`,
            visibility: defaultVisibility,
            clientId: defaultClientId,
            googleDriveFolder: defaultDriveFolder,
          });
        }

        loadedCount++;
        if (loadedCount === files.length) {
          setStagedPhotos(prev => [...prev, ...newItems]);
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleApplyDefaultsToAll = () => {
    setStagedPhotos(prev =>
      prev.map(p => ({
        ...p,
        category: defaultCategory,
        visibility: defaultVisibility,
        clientId: defaultClientId,
        googleDriveFolder: defaultDriveFolder,
      }))
    );
  };

  const updateStagedItem = (id: string, key: keyof StagedPhoto, val: any) => {
    setStagedPhotos(prev =>
      prev.map(p => (p.tempId === id ? { ...p, [key]: val } : p))
    );
  };

  const removeStagedItem = (id: string) => {
    setStagedPhotos(prev => prev.filter(p => p.tempId !== id));
  };

  const handlePublishAll = () => {
    if (!stagedPhotos.length) return;

    const formattedPhotos: Photo[] = stagedPhotos.map(p => {
      const matchedClient = clients.find(c => c.id === p.clientId);
      return {
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: p.title || 'Untitled Work',
        description: p.description || '',
        category: p.category,
        url: p.url,
        aspectRatio: '3:4',
        orientation: 'portrait',
        colorPalette: 'vibrant',
        tags: [p.category, 'uploaded'],
        location: 'Creative Studio',
        year: new Date().getFullYear(),
        visibility: p.visibility,
        clientId: p.clientId || undefined,
        clientName: matchedClient?.name,
        googleDriveFolder: p.googleDriveFolder || defaultDriveFolder,
        googleDriveSynced: systemSettings.isGoogleDriveConnected ? true : false,
        googleDriveFileId: `gdrive-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        version: Date.now(),
        exif: {
          camera: 'Professional Cinema System',
          lens: '50mm Prime f/1.4',
          shutterSpeed: '1/250s',
          aperture: 'f/1.8',
          iso: '100',
          focalLength: '50mm',
        },
      };
    });

    bulkAddPhotos(formattedPhotos);
    setStagedPhotos([]);
    setShowBulkUploadModal(false);
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
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Bulk Upload & Client Vault Assignment</h2>
            </div>
            <button
              onClick={() => setShowBulkUploadModal(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Drag & Drop File Picker Zone */}
            <div className="p-8 border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-2xl bg-neutral-950/50 transition-all text-center group cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleFiles}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl inline-block text-amber-500 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-200">
                    Click or Drag & Drop Multiple Images
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Select 1, 5, 20, or more image files simultaneously
                  </p>
                </div>
              </div>
            </div>

            {/* Batch Routing Configuration */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
              <span className="block text-xs font-mono uppercase text-amber-400 font-bold">
                Batch Defaults for Uploaded Images
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Target Category</label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="wedding">Wedding</option>
                    <option value="editorial">Editorial</option>
                    <option value="fashion">Fashion</option>
                    <option value="fineart">Fine Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Visibility Mode</label>
                  <select
                    value={defaultVisibility}
                    onChange={(e) => setDefaultVisibility(e.target.value as PhotoVisibility)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  >
                    <option value="public">🌐 Public Portfolio Only</option>
                    <option value="client_only">🔒 Client Vault Only (Private)</option>
                    <option value="both">⚡ Both (Client + Public Page)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Assign to Client</label>
                  <select
                    value={defaultClientId}
                    onChange={(e) => setDefaultClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                  >
                    <option value="">-- General Studio / No Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shootTitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Google Drive Target Cloud Folder & Inline Folder Creation */}
              <div className="pt-3 border-t border-neutral-900 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-mono text-neutral-300 font-bold uppercase">
                      Google Drive Cloud Destination:
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        systemSettings.isGoogleDriveConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {systemSettings.isGoogleDriveConnected
                        ? `● Connected (${systemSettings.googleAccountEmail || 'Drive'})`
                        : 'Local storage (Connect Google Drive in System Setup for auto-backup)'}
                    </span>
                  </div>

                  {!isCreatingFolder && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingFolder(true)}
                      className="flex items-center space-x-1 text-xs font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>+ Create New Google Drive Folder</span>
                    </button>
                  )}
                </div>

                {isCreatingFolder ? (
                  <div className="flex items-center space-x-2 p-2 bg-neutral-900/90 border border-amber-500/40 rounded-xl">
                    <Folder className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      value={newFolderInput}
                      onChange={(e) => setNewFolderInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateNewFolder();
                        }
                      }}
                      placeholder="Folder name (e.g. Elena Rostova - Luxury Editorial 2026)..."
                      autoFocus
                      className="flex-1 px-3 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewFolder}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono rounded-lg cursor-pointer"
                    >
                      Save & Select Folder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderInput('');
                      }}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-mono rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={defaultDriveFolder}
                      onChange={(e) => setDefaultDriveFolder(e.target.value)}
                      className="w-full px-3 py-2 pl-9 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-amber-300 font-mono"
                    >
                      {systemSettings.googleDriveFolders?.map((f) => (
                        <option key={f} value={f}>
                          📁 {f} ({systemSettings.googleDriveFolderRoot}/{f})
                        </option>
                      ))}
                    </select>
                    <Folder className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>

              {stagedPhotos.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyDefaultsToAll}
                  className="text-xs text-amber-400 hover:underline font-mono cursor-pointer"
                >
                  Apply category, client, visibility & Google Drive folder defaults to all {stagedPhotos.length} staged images
                </button>
              )}
            </div>

            {/* Staged Items List */}
            {stagedPhotos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-neutral-300">
                    Staged Photos ({stagedPhotos.length})
                  </span>
                  <button
                    onClick={() => setStagedPhotos([])}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {stagedPhotos.map((photo) => (
                    <div
                      key={photo.tempId}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg bg-neutral-900 overflow-hidden flex-shrink-0 border border-neutral-800">
                        <img src={photo.url} alt="staged" className="w-full h-full object-cover" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 flex-1 w-full text-xs">
                        <div>
                          <label className="block text-[10px] text-neutral-500 font-mono">Title</label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={(e) => updateStagedItem(photo.tempId, 'title', e.target.value)}
                            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-500 font-mono">Category / Page</label>
                          <select
                            value={photo.category}
                            onChange={(e) => updateStagedItem(photo.tempId, 'category', e.target.value)}
                            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white"
                          >
                            <option value="portrait">Portrait</option>
                            <option value="wedding">Wedding</option>
                            <option value="editorial">Editorial</option>
                            <option value="fashion">Fashion</option>
                            <option value="fineart">Fine Art</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-500 font-mono">Client Account</label>
                          <select
                            value={photo.clientId}
                            onChange={(e) => updateStagedItem(photo.tempId, 'clientId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white"
                          >
                            <option value="">-- None (Public) --</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-500 font-mono">Visibility</label>
                          <select
                            value={photo.visibility}
                            onChange={(e) => updateStagedItem(photo.tempId, 'visibility', e.target.value)}
                            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white"
                          >
                            <option value="public">🌐 Public</option>
                            <option value="client_only">🔒 Client Only</option>
                            <option value="both">⚡ Both</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                            <Cloud className="w-2.5 h-2.5 text-sky-400" />
                            <span>Google Drive Folder</span>
                          </label>
                          <select
                            value={photo.googleDriveFolder || defaultDriveFolder}
                            onChange={(e) => updateStagedItem(photo.tempId, 'googleDriveFolder', e.target.value)}
                            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-amber-300 font-mono text-[11px]"
                          >
                            {systemSettings.googleDriveFolders?.map((f) => (
                              <option key={f} value={f}>📁 {f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => removeStagedItem(photo.tempId)}
                        className="p-2 text-neutral-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">
                {stagedPhotos.length} Photos Ready for Publishing
              </span>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!stagedPhotos.length}
                  onClick={handlePublishAll}
                  className="flex items-center space-x-1.5 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish All Staged Photos</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
