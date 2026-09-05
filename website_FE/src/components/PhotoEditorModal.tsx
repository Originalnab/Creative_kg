import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Trash2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Tag,
  Plus,
  Layers,
  Camera,
  Eye,
  Lock,
  Globe,
  Cloud,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { PhotoVisibility, PhotoFilters } from '../types';

export default function PhotoEditorModal() {
  const {
    editingPhoto,
    setEditingPhoto,
    updatePhoto,
    deletePhoto,
    clients,
    systemSettings,
    openMediaPicker,
    uploadToMediaStorage,
  } = useAdmin();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'adjustments' | 'replace' | 'tags' | 'details'>('adjustments');

  // Photo details
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart'>('portrait');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '3:4' | '4:3' | '9:16' | '2:3' | '3:2'>('3:4');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Client & Visibility
  const [visibility, setVisibility] = useState<PhotoVisibility>('public');
  const [clientId, setClientId] = useState<string>('');
  const [googleDriveFolder, setGoogleDriveFolder] = useState<string>('');

  // Image Filter Adjustments State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [activePreset, setActivePreset] = useState('none');

  // EXIF
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [aperture, setAperture] = useState('');
  const [iso, setIso] = useState('');
  const [focalLength, setFocalLength] = useState('');

  // Canvas Ref for baking adjustments
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (editingPhoto) {
      setUrl(editingPhoto.url || '');
      setTitle(editingPhoto.title || '');
      setDescription(editingPhoto.description || '');
      setCategory(editingPhoto.category || 'portrait');
      setLocation(editingPhoto.location || '');
      setYear(editingPhoto.year || 2026);
      setAspectRatio(editingPhoto.aspectRatio || '3:4');
      setTags(editingPhoto.tags || []);
      setVisibility(editingPhoto.visibility || 'public');
      setClientId(editingPhoto.clientId || '');
      setGoogleDriveFolder(
        editingPhoto.googleDriveFolder || systemSettings.googleDriveFolders?.[0] || 'General Master Archive'
      );

      // Load filters if existing
      const f = editingPhoto.filters || {};
      setBrightness(f.brightness ?? 100);
      setContrast(f.contrast ?? 100);
      setSaturation(f.saturation ?? 100);
      setSepia(f.sepia ?? 0);
      setGrayscale(f.grayscale ?? 0);
      setBlur(f.blur ?? 0);
      setHueRotate(f.hueRotate ?? 0);
      setRotate(f.rotate ?? 0);
      setFlipH(f.flipH ?? false);
      setFlipV(f.flipV ?? false);
      setActivePreset(f.preset || 'none');

      // EXIF
      setCamera(editingPhoto.exif?.camera || '');
      setLens(editingPhoto.exif?.lens || '');
      setShutterSpeed(editingPhoto.exif?.shutterSpeed || '');
      setAperture(editingPhoto.exif?.aperture || '');
      setIso(editingPhoto.exif?.iso || '');
      setFocalLength(editingPhoto.exif?.focalLength || '');
    }
  }, [editingPhoto]);

  if (!editingPhoto) return null;

  // Compute CSS filter string for live preview
  const cssFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
  const cssTransform = `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  // Preset Filters
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    switch (presetName) {
      case 'cinematic':
        setBrightness(105);
        setContrast(125);
        setSaturation(110);
        setSepia(15);
        setGrayscale(0);
        setBlur(0);
        setHueRotate(350);
        break;
      case 'noir':
        setBrightness(110);
        setContrast(140);
        setSaturation(0);
        setSepia(0);
        setGrayscale(100);
        setBlur(0);
        setHueRotate(0);
        break;
      case 'vintage':
        setBrightness(100);
        setContrast(90);
        setSaturation(85);
        setSepia(45);
        setGrayscale(0);
        setBlur(0);
        setHueRotate(15);
        break;
      case 'vivid':
        setBrightness(105);
        setContrast(120);
        setSaturation(150);
        setSepia(0);
        setGrayscale(0);
        setBlur(0);
        setHueRotate(0);
        break;
      case 'matte':
        setBrightness(115);
        setContrast(85);
        setSaturation(80);
        setSepia(10);
        setGrayscale(0);
        setBlur(0);
        setHueRotate(0);
        break;
      case 'none':
      default:
        resetAdjustments();
        break;
    }
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setGrayscale(0);
    setBlur(0);
    setHueRotate(0);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    setActivePreset('none');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const matchedClient = clients.find((c) => c.id === clientId);

    const updatedFilters: PhotoFilters = {
      brightness,
      contrast,
      saturation,
      sepia,
      grayscale,
      blur,
      hueRotate,
      rotate,
      flipH,
      flipV,
      preset: activePreset
    };

    updatePhoto(editingPhoto.id, {
      url,
      title,
      description,
      category,
      location,
      year: Number(year),
      aspectRatio,
      tags,
      visibility,
      clientId: clientId || undefined,
      clientName: matchedClient?.name,
      googleDriveFolder: googleDriveFolder || editingPhoto.googleDriveFolder,
      googleDriveSynced: editingPhoto.googleDriveSynced ?? (systemSettings.isGoogleDriveConnected ? true : false),
      googleDriveFileId: editingPhoto.googleDriveFileId || `gdrive-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      filters: updatedFilters,
      exif: {
        camera,
        lens,
        shutterSpeed,
        aperture,
        iso,
        focalLength,
      },
    });

    setEditingPhoto(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${editingPhoto.title}"?`)) {
      deletePhoto(editingPhoto.id);
      setEditingPhoto(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-6 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Studio Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                  <span>Photo Studio & In-Place Editor</span>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                    Live Editing
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Replace imagery, adjust optical color balance, manage captions & tags
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 px-6 pt-3 border-b border-neutral-800/80 bg-neutral-950/40 text-xs font-mono shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('adjustments')}
              className={`pb-2.5 px-3 border-b-2 font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'adjustments'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Image Adjustments & Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('replace')}
              className={`pb-2.5 px-3 border-b-2 font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'replace'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Image File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tags')}
              className={`pb-2.5 px-3 border-b-2 font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'tags'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Tags & Categories ({tags.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-2.5 px-3 border-b-2 font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'details'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Heading, Caption & Client Vault</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Live Canvas/Image Preview */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase tracking-wider">Live Viewport</span>
                  <span className="text-amber-400 text-[10px]">{aspectRatio} Ratio</span>
                </div>

                <div className="relative aspect-[3/4] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center group">
                  {url ? (
                    <img
                      src={url}
                      alt={title || 'Preview'}
                      style={{
                        filter: cssFilter,
                        transform: cssTransform,
                        transition: 'filter 0.15s ease, transform 0.2s ease',
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-neutral-600">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No image loaded</span>
                    </div>
                  )}

                  {/* Transform overlay buttons on hover */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setRotate((prev) => (prev + 90) % 360)}
                      className="p-1.5 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={`p-1.5 hover:bg-neutral-700 rounded transition-colors ${flipH ? 'text-amber-400' : 'text-neutral-200'}`}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={`p-1.5 hover:bg-neutral-700 rounded transition-colors ${flipV ? 'text-amber-400' : 'text-neutral-200'}`}
                      title="Flip Vertical"
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={resetAdjustments}
                      className="p-1.5 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
                      title="Reset Adjustments"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preset Badge */}
                  {activePreset !== 'none' && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[9px] font-mono text-amber-400 border border-amber-500/30 uppercase">
                      Preset: {activePreset}
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] font-mono text-neutral-500">
                  Changes render in real time and are saved directly to the photo.
                </div>
              </div>

              {/* Right Column: Tabbed Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* Tab 1: Image Adjustments & Presets */}
                {activeTab === 'adjustments' && (
                  <div className="space-y-4">
                    {/* Creative Presets */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono uppercase text-amber-400 tracking-wider font-semibold">
                          Creative Visual Presets
                        </label>
                        <button
                          type="button"
                          onClick={resetAdjustments}
                          className="text-[10px] font-mono text-neutral-400 hover:text-amber-400 underline cursor-pointer"
                        >
                          Reset to Neutral
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { id: 'none', label: 'Neutral' },
                          { id: 'cinematic', label: 'Cinematic' },
                          { id: 'noir', label: 'Noir B&W' },
                          { id: 'vintage', label: 'Vintage' },
                          { id: 'vivid', label: 'Vivid Pop' },
                          { id: 'matte', label: 'Fine Matte' }
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => applyPreset(p.id)}
                            className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                              activePreset === p.id
                                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20'
                                : 'bg-neutral-950/70 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fine-Tuning Sliders */}
                    <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-3.5 text-xs">
                      <span className="block text-[11px] font-mono uppercase text-neutral-400 font-bold">
                        Studio Color & Light Sliders
                      </span>

                      {/* Brightness */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Brightness</span>
                          <span className="text-amber-400 font-bold">{brightness}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="160"
                          value={brightness}
                          onChange={(e) => {
                            setBrightness(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Contrast</span>
                          <span className="text-amber-400 font-bold">{contrast}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="180"
                          value={contrast}
                          onChange={(e) => {
                            setContrast(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Saturation */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Color Saturation</span>
                          <span className="text-amber-400 font-bold">{saturation}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={saturation}
                          onChange={(e) => {
                            setSaturation(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Sepia */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Warm Sepia Tone</span>
                          <span className="text-amber-400 font-bold">{sepia}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sepia}
                          onChange={(e) => {
                            setSepia(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Grayscale */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Monochrome / Grayscale</span>
                          <span className="text-amber-400 font-bold">{grayscale}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grayscale}
                          onChange={(e) => {
                            setGrayscale(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Blur */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Atmospheric Soft Blur</span>
                          <span className="text-amber-400 font-bold">{blur}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={blur}
                          onChange={(e) => {
                            setBlur(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Hue Rotate */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-400">Hue Color Rotation</span>
                          <span className="text-amber-400 font-bold">{hueRotate}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={hueRotate}
                          onChange={(e) => {
                            setHueRotate(Number(e.target.value));
                            setActivePreset('custom');
                          }}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Replace Image File via Media Storage */}
                {activeTab === 'replace' && (
                  <div className="space-y-4">
                    {/* Primary Action: Choose from Media Storage */}
                    <div className="p-5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase">
                        <Folder className="w-4 h-4" />
                        <span>System Media Storage Vault</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        To maintain organized cloud storage and Google Drive backups, images must be chosen from a dedicated storage folder.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          openMediaPicker((chosenAsset) => {
                            setUrl(chosenAsset.url);
                            setGoogleDriveFolder(chosenAsset.googleDriveFolder);
                          });
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <Folder className="w-4 h-4" />
                        <span>Browse & Choose from System Media Storage</span>
                      </button>
                    </div>

                    {/* Secondary: Upload Directly into a Media Storage Folder */}
                    <div className="p-5 border border-neutral-800 rounded-2xl bg-neutral-950/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Upload New Master Asset to Folder</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          📁 Folder: {googleDriveFolder || 'General Master Archive'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400">
                        Select a high-resolution JPG, PNG, or WebP photo. It will automatically upload to Google Drive under folder <strong className="text-amber-300">{googleDriveFolder || 'General Master Archive'}</strong> and replace this photo.
                      </p>

                      <div className="flex items-center space-x-3">
                        <label className="inline-flex items-center space-x-2 py-2 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs font-mono uppercase tracking-wider cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Choose Local File...</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const targetFolder = googleDriveFolder || systemSettings.googleDriveFolders?.[0] || 'General Master Archive';
                              const added = await uploadToMediaStorage([file], targetFolder, category, clientId);
                              if (added.length > 0) {
                                setUrl(added[0].url);
                                setGoogleDriveFolder(added[0].googleDriveFolder);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Tags & Categories */}
                {activeTab === 'tags' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        Display Page / Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500/60 font-mono"
                      >
                        <option value="portrait">Portrait Gallery</option>
                        <option value="wedding">Wedding Gallery</option>
                        <option value="editorial">Editorial Gallery</option>
                        <option value="fashion">Fashion Gallery</option>
                        <option value="fineart">Fine Art Gallery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        Framing Aspect Ratio
                      </label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60 font-mono"
                      >
                        <option value="3:4">3:4 Portrait Medium Format</option>
                        <option value="4:3">4:3 Standard Frame</option>
                        <option value="16:9">16:9 Cinematic Widescreen</option>
                        <option value="1:1">1:1 Square Album Frame</option>
                        <option value="9:16">9:16 Vertical Mobile</option>
                        <option value="2:3">2:3 Classic 35mm</option>
                        <option value="3:2">3:2 Landscape 35mm</option>
                      </select>
                    </div>

                    {/* Tag Manager */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase text-neutral-400">
                        Image Tags (Used for search & filters)
                      </label>
                      
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="e.g. golden hour, monochrome, studio..."
                          className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/60 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs rounded-xl border border-neutral-700 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Tag</span>
                        </button>
                      </div>

                      {/* Tag list badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-lg font-mono"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-white transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Details & Client Vault */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                        Photo Heading / Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Elowen in Neon"
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                        Caption / Story Description
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the mood, concept, or technical lighting story..."
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-500/60"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Brooklyn Studio, NY"
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Client Vault & Visibility */}
                    <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                      <span className="block text-xs font-mono uppercase text-amber-400 font-bold">
                        Client Vault & Visibility
                      </span>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                            Visibility Mode
                          </label>
                          <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as PhotoVisibility)}
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                          >
                            <option value="public">Public Gallery Only</option>
                            <option value="client_only">Private Client Vault Only</option>
                            <option value="both">Both (Public & Client)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                            Assign to Client Account
                          </label>
                          <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                          >
                            <option value="">-- No Client Assigned --</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.shootTitle})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Google Drive Destination */}
                      <div className="pt-2 border-t border-neutral-900">
                        <label className="block text-[10px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Cloud className="w-3 h-3 text-sky-400" />
                            <span>Google Drive Storage Folder</span>
                          </span>
                          {editingPhoto.googleDriveSynced && (
                            <span className="text-[9px] text-emerald-400 font-mono">
                              ● Synchronized to Cloud
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            value={googleDriveFolder}
                            onChange={(e) => setGoogleDriveFolder(e.target.value)}
                            className="w-full px-2.5 py-1.5 pl-8 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-amber-300 font-mono"
                          >
                            {systemSettings.googleDriveFolders?.map((f) => (
                              <option key={f} value={f}>
                                📁 {f}
                              </option>
                            ))}
                          </select>
                          <Folder className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
