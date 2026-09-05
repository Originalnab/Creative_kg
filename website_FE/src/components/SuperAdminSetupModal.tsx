import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CreditCard,
  MessageSquare,
  Building,
  KeyRound,
  FileCode,
  Check,
  Send,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Globe,
  Cloud,
  FolderPlus,
  Folder,
  Upload,
  Link,
  Trash2,
  ExternalLink,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Image as ImageIcon,
  Palette,
  Calendar,
  DollarSign,
  Clock,
  Plus,
  ListChecks,
  RotateCcw,
  Edit2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { SystemSettings, ThemePaletteId, BookingType, BookingPackage } from '../types';
import { THEME_PALETTES } from '../utils/themeManager';

export default function SuperAdminSetupModal() {
  const {
    showSuperAdminModal,
    setShowSuperAdminModal,
    systemSettings,
    updateSystemSettings,
    sendManualSMS,
    activeTheme,
    setActiveTheme,
    bookingTypes,
    updateBookingType,
    addBookingType,
    deleteBookingType,
    addPackageToBookingType,
    updatePackageInBookingType,
    deletePackageFromBookingType,
    resetBookingTypesToDefault,
    isSuperAdmin,
    isAdmin,
    userRole,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<
    | 'branding'
    | 'themes'
    | 'bookings'
    | 'googledrive'
    | 'paystack'
    | 'arkesel'
    | 'studio'
    | 'security'
    | 'env'
  >('branding');

  // Form State
  const [formData, setFormData] = useState<SystemSettings>(systemSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (showSuperAdminModal) {
      setFormData(systemSettings);
    }
  }, [showSuperAdminModal, systemSettings]);

  // Safety guard: If regular admin is logged in, ensure technical tabs cannot be active
  useEffect(() => {
    if (!isSuperAdmin && ['paystack', 'arkesel', 'security', 'env'].includes(activeTab)) {
      setActiveTab('branding');
    }
  }, [isSuperAdmin, activeTab]);

  // Test SMS State
  const [testPhone, setTestPhone] = useState('+233 24 555 0199');
  const [testName, setTestName] = useState('Super Admin Test');
  const [testMessage, setTestMessage] = useState('Test SMS alert from Creative KG via Arkesel Gateway.');
  const [isSendingTestSMS, setIsSendingTestSMS] = useState(false);
  const [testSMSSuccess, setTestSMSSuccess] = useState(false);

  // Copy .env State
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Booking Types management modal states
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [editingBookingType, setEditingBookingType] = useState<BookingType | null>(null);
  const [isCreatingBookingType, setIsCreatingBookingType] = useState(false);
  const [newBookingTypeForm, setNewBookingTypeForm] = useState<Omit<BookingType, 'id'>>({
    name: '',
    slug: '',
    startingPrice: 1500,
    currency: 'USD',
    badge: 'Curated Session',
    description: '',
    packages: [],
    active: true,
  });
  const [editingPackageState, setEditingPackageState] = useState<{
    bookingTypeId: string;
    packageData: BookingPackage;
    isNew: boolean;
  } | null>(null);

  if (!showSuperAdminModal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      // Regular admin can update branding, themes, packages, google drive settings, and studio profile,
      // but technical credentials (Paystack keys, Arkesel API, passcodes) remain protected
      updateSystemSettings({
        ...systemSettings,
        websiteName: formData.websiteName,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        studioLogo: formData.studioLogo,
        websiteFavicon: formData.websiteFavicon,
        themeColor: formData.themeColor,
        isGoogleDriveConnected: formData.isGoogleDriveConnected,
        googleAccountEmail: formData.googleAccountEmail,
        googleAccountName: formData.googleAccountName,
        googleDriveFolderRoot: formData.googleDriveFolderRoot,
        googleDriveFolders: formData.googleDriveFolders,
        autoBackupToDrive: formData.autoBackupToDrive,
        studioName: formData.studioName,
        studioPhone: formData.studioPhone,
        studioEmail: formData.studioEmail,
        studioAddress: formData.studioAddress,
        invoicePrefix: formData.invoicePrefix,
        momoMerchantNumber: formData.momoMerchantNumber,
      });
    } else {
      updateSystemSettings(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTestSMS = async () => {
    setIsSendingTestSMS(true);
    setTestSMSSuccess(false);
    try {
      await sendManualSMS(testPhone, testName, testMessage);
      setTestSMSSuccess(true);
      setTimeout(() => setTestSMSSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTestSMS(false);
    }
  };

  const generateEnvContent = () => {
    return `# Website Branding & SEO
VITE_WEBSITE_NAME="${formData.websiteName || ''}"
VITE_SEO_TITLE="${formData.seoTitle || ''}"
VITE_SEO_DESCRIPTION="${formData.seoDescription || ''}"
VITE_GOOGLE_DRIVE_ROOT="${formData.googleDriveFolderRoot || ''}"

# Paystack Integration
VITE_PAYSTACK_PUBLIC_KEY="${formData.paystackPublicKey}"
VITE_PAYSTACK_CURRENCY="${formData.paystackCurrency}"

# Arkesel SMS Integration
VITE_ARKESEL_API_KEY="${formData.arkeselApiKey}"
VITE_ARKESEL_SENDER_ID="${formData.arkeselSenderId}"

# Studio Invoicing & Identity
VITE_STUDIO_NAME="${formData.studioName}"
VITE_STUDIO_PHONE="${formData.studioPhone}"
VITE_STUDIO_EMAIL="${formData.studioEmail}"
VITE_STUDIO_ADDRESS="${formData.studioAddress}"
VITE_INVOICE_PREFIX="${formData.invoicePrefix}"

# Passcodes
VITE_ADMIN_PASSCODE="${formData.adminPasscode}"
VITE_SUPER_ADMIN_PASSCODE="${formData.superAdminPasscode}"
VITE_EDITOR_PASSCODE="${formData.editorPasscode}"
`;
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(generateEnvContent());
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isSuperAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wide uppercase font-mono text-white flex items-center gap-2">
                  <span>{isSuperAdmin ? 'System Setup & Master Control' : 'System Setup & Studio Controls'}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest ${
                    isSuperAdmin ? 'bg-amber-500 text-neutral-950' : 'bg-sky-500 text-neutral-950'
                  }`}>
                    {isSuperAdmin ? 'SUPER ADMIN MASTER' : 'STUDIO ADMIN'}
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  {isSuperAdmin
                    ? 'Configure Website Branding, Favicon, SEO Metadata, Google Drive Cloud Storage, Payment Gateways & API Keys'
                    : 'Configure Website Branding, Favicon, SEO Metadata, Google Drive Cloud Storage, Booking Packages & Themes'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSuperAdminModal(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 overflow-x-auto text-xs">
            {/* 1. Branding & SEO (Admin & Super Admin) */}
            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Branding & SEO</span>
            </button>

            {/* 2. Palette Themes (Admin & Super Admin) */}
            <button
              type="button"
              onClick={() => setActiveTab('themes')}
              className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'themes'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Palette Themes</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </button>

            {/* 3. Booking & Packages (Admin & Super Admin) */}
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Booking & Packages</span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded-full">
                {bookingTypes.length}
              </span>
            </button>

            {/* 4. Google Drive Cloud (Admin & Super Admin) */}
            <button
              type="button"
              onClick={() => setActiveTab('googledrive')}
              className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'googledrive'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Google Drive Cloud</span>
              {formData.isGoogleDriveConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* 5. Studio & Invoicing (Admin & Super Admin) */}
            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Studio & Invoicing</span>
            </button>

            {/* TECHNICAL STUFF (Strictly Super Admin Only) */}
            {isSuperAdmin && (
              <>
                {/* 6. Paystack & MoMo */}
                <button
                  type="button"
                  onClick={() => setActiveTab('paystack')}
                  className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'paystack'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paystack & MoMo</span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                    SUPER
                  </span>
                </button>

                {/* 7. Arkesel SMS Gateway */}
                <button
                  type="button"
                  onClick={() => setActiveTab('arkesel')}
                  className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'arkesel'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Arkesel SMS Gateway</span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                    SUPER
                  </span>
                </button>

                {/* 8. Access & Passcodes */}
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Access & Passcodes</span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                    SUPER
                  </span>
                </button>

                {/* 9. .env Export */}
                <button
                  type="button"
                  onClick={() => setActiveTab('env')}
                  className={`flex items-center space-x-2 py-3 px-4 font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'env'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>.env Export</span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                    SUPER
                  </span>
                </button>
              </>
            )}
          </div>

          <form onSubmit={handleSave} className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Tab: Branding & SEO Setup */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Globe className="w-4 h-4" />
                    <span>Website Branding & Search Engine Optimization (SEO)</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Personalize your brand identity, upload your custom studio logo, update the browser favicon, and optimize page titles and meta descriptions for Google search visibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Website Name & Basic Identity */}
                  <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" />
                      <span>Studio & Website Identity</span>
                    </h3>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono uppercase text-neutral-300">
                        Website / Studio Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.websiteName || ''}
                        onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                        placeholder="e.g. Creative KG"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-neutral-500">
                        Appears in the header navigation, footer, receipts, and watermark default.
                      </span>
                    </div>

                    {/* Logo Config */}
                    <div className="space-y-2 pt-2 border-t border-neutral-900">
                      <label className="block text-xs font-mono uppercase text-neutral-300">
                        Website Logo
                      </label>
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-16 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 overflow-hidden shrink-0">
                          {formData.websiteLogo ? (
                            <img
                              src={formData.websiteLogo}
                              alt="Logo Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-neutral-600 text-center">
                              Default Monogram
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <label className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono cursor-pointer border border-neutral-700 transition-colors flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>Upload Logo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (reader.result) {
                                      setFormData(prev => ({ ...prev, websiteLogo: reader.result as string }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                            {formData.websiteLogo && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, websiteLogo: '' })}
                                className="px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 text-xs font-mono transition-colors"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          <input
                            type="url"
                            value={formData.websiteLogo || ''}
                            onChange={(e) => setFormData({ ...formData, websiteLogo: e.target.value })}
                            placeholder="Or paste image URL (PNG, SVG, JPG)"
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Favicon Config */}
                    <div className="space-y-2 pt-2 border-t border-neutral-900">
                      <label className="block text-xs font-mono uppercase text-neutral-300">
                        Website Favicon (Browser Tab Icon)
                      </label>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {formData.websiteFavicon ? (
                            <img
                              src={formData.websiteFavicon}
                              alt="Favicon"
                              className="w-8 h-8 object-contain rounded"
                            />
                          ) : (
                            <span className="text-[9px] font-mono text-neutral-600">None</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <label className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono cursor-pointer border border-neutral-700 transition-colors flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>Upload Favicon</span>
                              <input
                                type="file"
                                accept="image/*,.ico"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (reader.result) {
                                      setFormData(prev => ({ ...prev, websiteFavicon: reader.result as string }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                            {formData.websiteFavicon && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, websiteFavicon: '' })}
                                className="px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 text-xs font-mono transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <input
                            type="url"
                            value={formData.websiteFavicon || ''}
                            onChange={(e) => setFormData({ ...formData, websiteFavicon: e.target.value })}
                            placeholder="Favicon URL (PNG / ICO)"
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO Metadata & Live Preview */}
                  <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Search Engine Optimization (SEO)</span>
                    </h3>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono uppercase text-neutral-300">
                          SEO Title Tag
                        </label>
                        <span className={`text-[10px] font-mono ${(formData.seoTitle?.length || 0) > 60 ? 'text-amber-400' : 'text-neutral-500'}`}>
                          {formData.seoTitle?.length || 0} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.seoTitle || ''}
                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder="e.g. Creative KG | Luxury Editorial, Portrait & Wedding Photography Studio"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono uppercase text-neutral-300">
                          SEO Meta Description
                        </label>
                        <span className={`text-[10px] font-mono ${(formData.seoDescription?.length || 0) > 160 ? 'text-amber-400' : 'text-neutral-500'}`}>
                          {formData.seoDescription?.length || 0} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.seoDescription || ''}
                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                        placeholder="Provide a compelling summary of your photography studio services..."
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-sans text-neutral-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono uppercase text-neutral-300">
                        Meta Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.seoKeywords || ''}
                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                        placeholder="wedding photographer, luxury portraits, Accra, fashion films"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Google Search Result Preview Card */}
                    <div className="pt-2 border-t border-neutral-900">
                      <div className="text-[10px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Live Google SERP Search Snippet Preview</span>
                      </div>
                      <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1">
                        <div className="flex items-center space-x-1.5 text-xs text-neutral-400">
                          {formData.websiteFavicon ? (
                            <img src={formData.websiteFavicon} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 inline-block" />
                          )}
                          <span className="text-[11px] text-neutral-300">https://creativekg.com</span>
                        </div>
                        <div className="text-sm text-blue-400 hover:underline cursor-pointer font-medium line-clamp-1">
                          {formData.seoTitle || 'Creative KG Studios'}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {formData.seoDescription || 'Award-winning visual artistry and photography.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Palette Themes */}
            {activeTab === 'themes' && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Palette className="w-4 h-4" />
                    <span>Curated Luxury Color Palette Themes</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Select from 5 master color palettes tailored for high-end photography and cinema. Selecting a theme instantly updates the website’s primary accents, buttons, glows, active navigation lines, and interactive states.
                  </p>
                </div>

                {/* Grid of 5 Palette Themes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Object.values(THEME_PALETTES).map((theme) => {
                    const isActive = (formData.activeTheme || activeTheme) === theme.id;
                    return (
                      <div
                        key={theme.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                          isActive
                            ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/30 shadow-2xl'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <span
                                className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-semibold border"
                                style={{
                                  color: theme.primaryHex,
                                  borderColor: `${theme.primaryHex}40`,
                                  backgroundColor: `${theme.primaryHex}15`,
                                }}
                              >
                                {theme.badge}
                              </span>
                              <h3 className="font-sans font-bold text-base text-white mt-1.5">
                                {theme.name}
                              </h3>
                            </div>

                            {isActive && (
                              <span className="flex items-center space-x-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30">
                                <Check className="w-3 h-3" />
                                <span>Active</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed min-h-[38px]">
                            {theme.description}
                          </p>

                          {/* Swatch Bar */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                              Color Swatches
                            </span>
                            <div className="flex h-6 rounded-lg overflow-hidden border border-neutral-800">
                              {theme.previewColors.map((hex, i) => (
                                <div
                                  key={i}
                                  className="flex-1 transition-transform hover:scale-105"
                                  style={{ backgroundColor: hex }}
                                  title={hex}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Live Mini Preview Box */}
                          <div
                            className="p-3 rounded-xl border border-neutral-850 flex items-center justify-between"
                            style={{ backgroundColor: theme.surfaceHex }}
                          >
                            <span
                              className="text-xs font-semibold"
                              style={{ color: theme.accentHex }}
                            >
                              Sample Accent
                            </span>
                            <div
                              className="px-3 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider shadow"
                              style={{
                                backgroundColor: theme.primaryHex,
                                color: '#0a0a0a',
                                boxShadow: `0 0 12px ${theme.glowRgba}`,
                              }}
                            >
                              Action Button
                            </div>
                          </div>
                        </div>

                        {/* Activation Button */}
                        <div className="pt-3 border-t border-neutral-850">
                          {isActive ? (
                            <div className="w-full py-2 rounded-xl text-xs font-mono font-bold uppercase text-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Currently Active Theme
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTheme(theme.id);
                                setFormData((prev) => ({ ...prev, activeTheme: theme.id }));
                              }}
                              className="w-full py-2.5 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
                              <span>Activate {theme.name}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Booking Types & Packages Setup */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/20 rounded-xl space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                      <Calendar className="w-4 h-4" />
                      <span>Booking Types & Package Tiers Setup</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={resetBookingTypesToDefault}
                        className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Defaults</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCreatingBookingType(true)}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-sans font-bold flex items-center space-x-1 cursor-pointer transition-all shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Booking Type</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Tailor what photography experiences clients can reserve (Weddings, Birthdays, Parties, Fine Art Portraits). Configure rates, descriptions, and create detailed packages with duration and deliverable breakdowns.
                  </p>
                </div>

                {/* Create New Booking Type Drawer/Card */}
                {isCreatingBookingType && (
                  <div className="p-5 bg-neutral-900 border border-amber-500/50 rounded-2xl space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <h4 className="font-mono text-xs text-amber-400 uppercase font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create New Booking Experience</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsCreatingBookingType(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Booking Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newBookingTypeForm.name}
                          onChange={(e) =>
                            setNewBookingTypeForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="e.g. Quinceañera & Debutante Balls"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Slug / Category ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={newBookingTypeForm.slug}
                          onChange={(e) =>
                            setNewBookingTypeForm((prev) => ({
                              ...prev,
                              slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                            }))
                          }
                          placeholder="e.g. quinceanera"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Starting Price ($) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newBookingTypeForm.startingPrice}
                          onChange={(e) =>
                            setNewBookingTypeForm((prev) => ({
                              ...prev,
                              startingPrice: Number(e.target.value),
                            }))
                          }
                          placeholder="1500"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={newBookingTypeForm.badge}
                          onChange={(e) =>
                            setNewBookingTypeForm((prev) => ({ ...prev, badge: e.target.value }))
                          }
                          placeholder="e.g. Signature Experience, High Demand"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Marketing Description *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={newBookingTypeForm.description}
                          onChange={(e) =>
                            setNewBookingTypeForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Compelling description of this session for clients..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingBookingType(false)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs text-neutral-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newBookingTypeForm.name || !newBookingTypeForm.description) {
                            alert('Please enter a name and description.');
                            return;
                          }
                          addBookingType({
                            ...newBookingTypeForm,
                            packages: [
                              {
                                id: `pkg-${Date.now()}-std`,
                                name: `${newBookingTypeForm.name} Signature`,
                                price: newBookingTypeForm.startingPrice,
                                duration: '3 Hours Coverage',
                                deliverables: [
                                  '75+ Master Retouched Photos',
                                  'Private Online Client Vault',
                                  'High-Resolution Digital Download',
                                ],
                                description: 'Essential complete coverage for this session.',
                                isPopular: true,
                              },
                            ],
                          });
                          setIsCreatingBookingType(false);
                          setNewBookingTypeForm({
                            name: '',
                            slug: '',
                            startingPrice: 1500,
                            currency: 'USD',
                            badge: 'Curated Session',
                            description: '',
                            packages: [],
                            active: true,
                          });
                        }}
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider"
                      >
                        Save Booking Type
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Booking Types */}
                <div className="space-y-4">
                  {bookingTypes.map((bt) => {
                    const isExpanded = expandedBookingId === bt.id;
                    const isEditingThis = editingBookingType?.id === bt.id;

                    return (
                      <div
                        key={bt.id}
                        className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4 transition-all"
                      >
                        {/* Booking Header */}
                        {isEditingThis ? (
                          /* Inline Edit Booking Type */
                          <div className="space-y-4 bg-neutral-900/80 p-4 rounded-xl border border-amber-500/40">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={editingBookingType.name}
                                  onChange={(e) =>
                                    setEditingBookingType({
                                      ...editingBookingType,
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                                  Starting Price ($)
                                </label>
                                <input
                                  type="number"
                                  value={editingBookingType.startingPrice}
                                  onChange={(e) =>
                                    setEditingBookingType({
                                      ...editingBookingType,
                                      startingPrice: Number(e.target.value),
                                    })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                                  Badge
                                </label>
                                <input
                                  type="text"
                                  value={editingBookingType.badge || ''}
                                  onChange={(e) =>
                                    setEditingBookingType({
                                      ...editingBookingType,
                                      badge: e.target.value,
                                    })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                                  Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={editingBookingType.description}
                                  onChange={(e) =>
                                    setEditingBookingType({
                                      ...editingBookingType,
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingBookingType(null)}
                                className="px-3 py-1 rounded text-xs text-neutral-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateBookingType(bt.id, editingBookingType);
                                  setEditingBookingType(null);
                                }}
                                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Normal View */
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400">
                                <Calendar className="w-5 h-5 text-theme-primary" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-sans font-bold text-sm text-white">
                                    {bt.name}
                                  </h4>
                                  {bt.badge && (
                                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      {bt.badge}
                                    </span>
                                  )}
                                  <span
                                    className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded ${
                                      bt.active
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-neutral-800 text-neutral-500'
                                    }`}
                                  >
                                    {bt.active ? 'Active' : 'Disabled'}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 max-w-2xl">
                                  {bt.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <span className="text-[10px] font-mono text-neutral-500 block">
                                  Starting Rate
                                </span>
                                <span className="font-mono font-bold text-sm text-amber-400">
                                  ${bt.startingPrice.toLocaleString()}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setEditingBookingType(bt)}
                                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800"
                                title="Edit Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedBookingId(isExpanded ? null : bt.id)
                                }
                                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-sans font-medium flex items-center space-x-1.5 cursor-pointer"
                              >
                                <ListChecks className="w-3.5 h-3.5 text-amber-400" />
                                <span>
                                  {isExpanded ? 'Hide Packages' : `Packages (${bt.packages.length})`}
                                </span>
                              </button>

                              {bookingTypes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete "${bt.name}" booking experience?`
                                      )
                                    ) {
                                      deleteBookingType(bt.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                  title="Delete Booking Type"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expanded Packages Section */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-neutral-850 space-y-4 bg-black/30 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-neutral-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                <span>Configured Packages ({bt.packages.length})</span>
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setEditingPackageState({
                                    bookingTypeId: bt.id,
                                    packageData: {
                                      id: `pkg-${Date.now()}`,
                                      name: '',
                                      price: bt.startingPrice,
                                      duration: '4 Hours Coverage',
                                      deliverables: [
                                        '100+ Master Retouched Photos',
                                        'Private Online Client Vault',
                                      ],
                                      description: '',
                                      isPopular: false,
                                    },
                                    isNew: true,
                                  })
                                }
                                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-sans flex items-center space-x-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Package Tier</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {bt.packages.map((pkg) => (
                                <div
                                  key={pkg.id}
                                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                                    pkg.isPopular
                                      ? 'bg-neutral-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                                      : 'bg-neutral-950 border-neutral-800'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h5 className="font-sans font-bold text-xs text-white">
                                          {pkg.name}
                                        </h5>
                                        <span className="font-mono text-[11px] text-amber-400 font-bold block">
                                          ${pkg.price.toLocaleString()}
                                        </span>
                                      </div>

                                      {pkg.isPopular && (
                                        <span className="font-mono text-[8px] uppercase tracking-wider bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.5 rounded">
                                          Popular
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center space-x-1 text-neutral-400 text-[11px]">
                                      <Clock className="w-3 h-3 text-neutral-500" />
                                      <span>{pkg.duration}</span>
                                    </div>

                                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                                      {pkg.description}
                                    </p>

                                    {/* Deliverables Bullet List */}
                                    <div className="space-y-1 pt-1 border-t border-neutral-900">
                                      {pkg.deliverables.slice(0, 4).map((d, dIdx) => (
                                        <div
                                          key={dIdx}
                                          className="flex items-center space-x-1.5 text-[10px] text-neutral-300"
                                        >
                                          <Check className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                                          <span className="truncate">{d}</span>
                                        </div>
                                      ))}
                                      {pkg.deliverables.length > 4 && (
                                        <span className="text-[9px] text-neutral-500 block font-mono">
                                          +{pkg.deliverables.length - 4} more deliverables
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingPackageState({
                                          bookingTypeId: bt.id,
                                          packageData: pkg,
                                          isNew: false,
                                        })
                                      }
                                      className="text-xs text-neutral-400 hover:text-amber-400 flex items-center space-x-1"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      <span>Edit Tier</span>
                                    </button>

                                    {bt.packages.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          deletePackageFromBookingType(bt.id, pkg.id)
                                        }
                                        className="text-xs text-neutral-500 hover:text-rose-400 p-1"
                                        title="Delete Tier"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Package Tier Edit / Add Modal */}
                {editingPackageState && (
                  <div className="p-5 bg-neutral-900 border border-amber-500/60 rounded-2xl space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <h4 className="font-mono text-xs text-amber-400 uppercase font-bold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {editingPackageState.isNew
                            ? 'Add New Package Tier'
                            : `Edit Package: ${editingPackageState.packageData.name}`}
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingPackageState(null)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Package Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPackageState.packageData.name}
                          onChange={(e) =>
                            setEditingPackageState({
                              ...editingPackageState,
                              packageData: {
                                ...editingPackageState.packageData,
                                name: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. Gold Legacy, Royal Bespoke"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingPackageState.packageData.price}
                          onChange={(e) =>
                            setEditingPackageState({
                              ...editingPackageState,
                              packageData: {
                                ...editingPackageState.packageData,
                                price: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Duration Coverage *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPackageState.packageData.duration}
                          onChange={(e) =>
                            setEditingPackageState({
                              ...editingPackageState,
                              packageData: {
                                ...editingPackageState.packageData,
                                duration: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. 6 Hours Coverage, Full Day"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Package Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingPackageState.packageData.description}
                          onChange={(e) =>
                            setEditingPackageState({
                              ...editingPackageState,
                              packageData: {
                                ...editingPackageState.packageData,
                                description: e.target.value,
                              },
                            })
                          }
                          placeholder="Describe who this package is recommended for..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Tier Badge / Status
                        </label>
                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="pkg-popular-toggle"
                            checked={!!editingPackageState.packageData.isPopular}
                            onChange={(e) =>
                              setEditingPackageState({
                                ...editingPackageState,
                                packageData: {
                                  ...editingPackageState.packageData,
                                  isPopular: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                          />
                          <label
                            htmlFor="pkg-popular-toggle"
                            className="text-xs text-neutral-300 cursor-pointer"
                          >
                            Mark as "Most Popular" / Recommended
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          Deliverables (One item per line)
                        </label>
                        <textarea
                          rows={4}
                          value={editingPackageState.packageData.deliverables.join('\n')}
                          onChange={(e) =>
                            setEditingPackageState({
                              ...editingPackageState,
                              packageData: {
                                ...editingPackageState.packageData,
                                deliverables: e.target.value
                                  .split('\n')
                                  .filter((item) => item.trim().length > 0),
                              },
                            })
                          }
                          placeholder="e.g.&#10;300+ Master Retouched High-Res Photos&#10;Private Online Client Vault&#10;12x12 Handcrafted Italian Leather Album"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingPackageState(null)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs text-neutral-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editingPackageState.packageData.name) {
                            alert('Please enter a package name.');
                            return;
                          }
                          if (editingPackageState.isNew) {
                            addPackageToBookingType(
                              editingPackageState.bookingTypeId,
                              editingPackageState.packageData
                            );
                          } else {
                            updatePackageInBookingType(
                              editingPackageState.bookingTypeId,
                              editingPackageState.packageData.id,
                              editingPackageState.packageData
                            );
                          }
                          setEditingPackageState(null);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider"
                      >
                        Save Package Tier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Google Drive Storage Integration */}
            {activeTab === 'googledrive' && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-sky-950/40 border border-sky-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase">
                    <Cloud className="w-4 h-4" />
                    <span>Google Account & Google Drive Cloud Storage</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Connect your Google Account so all uploaded full-resolution images are automatically synchronized to your private Google Drive cloud storage. Organize uploads by folders and assign them to website pages and client vaults seamlessly.
                  </p>
                </div>

                {/* Google Account Status & Auth Card */}
                <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white font-mono">
                            {formData.isGoogleDriveConnected
                              ? formData.googleAccountName || 'Connected Google Account'
                              : 'Google Drive Storage'}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              formData.isGoogleDriveConnected
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {formData.isGoogleDriveConnected ? '● Connected' : 'Disconnected'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-mono mt-0.5">
                          {formData.isGoogleDriveConnected
                            ? formData.googleAccountEmail
                            : 'Connect to automatically save all original uploaded assets'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      {formData.isGoogleDriveConnected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const newEmail = prompt('Switch to another Google Account:', formData.googleAccountEmail);
                              if (newEmail) {
                                setFormData(prev => ({
                                  ...prev,
                                  googleAccountEmail: newEmail,
                                  googleAccountName: newEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                }));
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono border border-neutral-700 transition-colors"
                          >
                            Switch Account
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                isGoogleDriveConnected: false,
                                googleAccountEmail: '',
                                googleAccountName: ''
                              }));
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono border border-rose-800/40 transition-colors"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const email = prompt(
                              'Enter your Google account email to connect Google Drive storage:',
                              'original.creativekg@gmail.com'
                            );
                            if (email) {
                              setFormData(prev => ({
                                ...prev,
                                isGoogleDriveConnected: true,
                                googleAccountEmail: email,
                                googleAccountName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                              }));
                            }
                          }}
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
                        >
                          <span>Connect Google Account</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.isGoogleDriveConnected && (
                    <div className="pt-3 border-t border-neutral-900 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Google Drive Cloud Quota:</span>
                        <span className="text-amber-400">28.4 GB used / 200 GB (14.2%)</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full w-[14.2%]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Root Directory & Sync Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Google Drive Root Vault Directory
                    </label>
                    <input
                      type="text"
                      value={formData.googleDriveFolderRoot}
                      onChange={(e) => setFormData({ ...formData, googleDriveFolderRoot: e.target.value })}
                      placeholder="e.g. Creative KG Master Cloud Vault"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-neutral-500">
                      All created folders and photo archives are grouped under this top-level directory in Google Drive.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-mono uppercase text-neutral-300">
                        Automatic Cloud Backup
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        When enabled, all newly uploaded pictures will automatically mirror into your Google Drive folder.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, autoBackupToDrive: !formData.autoBackupToDrive })}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all w-fit cursor-pointer ${
                        formData.autoBackupToDrive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{formData.autoBackupToDrive ? 'Auto-Backup Enabled' : 'Auto-Backup Paused'}</span>
                    </button>
                  </div>
                </div>

                {/* Google Drive Folder Registry & Manager */}
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5" />
                        <span>Google Drive Folders Registry</span>
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Create and organize dedicated folders in Google Drive for quick selection during bulk uploads.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">
                      {formData.googleDriveFolders?.length || 0} Folders Active
                    </span>
                  </div>

                  {/* Add Folder Bar */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const trimmed = newFolderName.trim();
                          if (trimmed && !formData.googleDriveFolders.includes(trimmed)) {
                            setFormData(prev => ({
                              ...prev,
                              googleDriveFolders: [...prev.googleDriveFolders, trimmed]
                            }));
                            setNewFolderName('');
                          }
                        }
                      }}
                      placeholder="Enter new folder name (e.g. Weddings 2026 / Milan Runway)..."
                      className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newFolderName.trim();
                        if (trimmed && !formData.googleDriveFolders.includes(trimmed)) {
                          setFormData(prev => ({
                            ...prev,
                            googleDriveFolders: [...prev.googleDriveFolders, trimmed]
                          }));
                          setNewFolderName('');
                        }
                      }}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono transition-all cursor-pointer whitespace-nowrap"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>+ Create Folder</span>
                    </button>
                  </div>

                  {/* Folders List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                    {formData.googleDriveFolders?.map((folder) => (
                      <div
                        key={folder}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all group"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs font-mono text-neutral-200 truncate" title={folder}>
                            {folder}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              googleDriveFolders: prev.googleDriveFolders.filter(f => f !== folder)
                            }));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-rose-400 transition-opacity cursor-pointer"
                          title="Delete Folder from Registry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Paystack Gateway (Super Admin Only) */}
            {isSuperAdmin && activeTab === 'paystack' && (
              <div className="space-y-5">
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Paystack Mobile Money & Card Gateway</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Powers instant online client gallery unlocks via MTN Mobile Money, Telecel Cash, AirtelTigo, and Visa/Mastercard.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Paystack Public Key (Client-Side)
                    </label>
                    <input
                      type="text"
                      value={formData.paystackPublicKey}
                      onChange={(e) => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                      placeholder="Enter Paystack Public Key (pk_...)"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Paystack Public API Key
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Paystack Secret Key (Optional Server/Webhook)
                    </label>
                    <input
                      type="password"
                      value={formData.paystackSecretKey || ''}
                      onChange={(e) => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                      placeholder="Enter Paystack Secret Key (sk_...)"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Kept securely in browser storage
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Default Currency
                    </label>
                    <select
                      value={formData.paystackCurrency}
                      onChange={(e) => setFormData({ ...formData, paystackCurrency: e.target.value as any })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="GHS">GHS (Ghanaian Cedi)</option>
                      <option value="USD">USD (United States Dollar)</option>
                      <option value="NGN">NGN (Nigerian Naira)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Gateway Mode
                    </label>
                    <select
                      value={formData.paystackMode}
                      onChange={(e) => setFormData({ ...formData, paystackMode: e.target.value as any })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="test">Test Mode (Sandbox / Demo)</option>
                      <option value="live">Live Production Mode</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Arkesel SMS Gateway (Super Admin Only) */}
            {isSuperAdmin && activeTab === 'arkesel' && (
              <div className="space-y-6">
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <MessageSquare className="w-4 h-4" />
                    <span>Arkesel SMS Gateway Configuration</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Sends automated real-time SMS alerts to client phones on payment receipt, gallery unlock, and client registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Arkesel API Key
                    </label>
                    <input
                      type="text"
                      value={formData.arkeselApiKey}
                      onChange={(e) => setFormData({ ...formData, arkeselApiKey: e.target.value })}
                      placeholder="Enter your Arkesel API key..."
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Arkesel Sender ID (Max 11 Alphanumeric chars)
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={formData.arkeselSenderId}
                      onChange={(e) => setFormData({ ...formData, arkeselSenderId: e.target.value.toUpperCase() })}
                      placeholder="CREATIVE-KG"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Approved Sender ID in your Arkesel portal
                    </span>
                  </div>
                </div>

                {/* SMS Templates Editor */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                      Automated SMS Message Templates
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Tokens: {'{clientName}'}, {'{amount}'}, {'{currency}'}, {'{invoiceNumber}'}, {'{shootTitle}'}, {'{passcode}'}, {'{studioName}'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        1. Payment Received Confirmation SMS
                      </label>
                      <textarea
                        rows={2}
                        value={formData.smsTemplates.paymentReceived}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smsTemplates: { ...formData.smsTemplates, paymentReceived: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        2. Gallery Unlocked Notification SMS
                      </label>
                      <textarea
                        rows={2}
                        value={formData.smsTemplates.galleryUnlocked}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smsTemplates: { ...formData.smsTemplates, galleryUnlocked: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        3. New Client Welcome SMS
                      </label>
                      <textarea
                        rows={2}
                        value={formData.smsTemplates.welcomeClient}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smsTemplates: { ...formData.smsTemplates, welcomeClient: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Test SMS Console */}
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-neutral-200 uppercase">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Test Arkesel SMS Deliverability</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 mb-1">Recipient Phone</label>
                      <input
                        type="text"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        placeholder="+233240000000"
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono text-neutral-400 mb-1">Test Message</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={testMessage}
                          onChange={(e) => setTestMessage(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={handleSendTestSMS}
                          disabled={isSendingTestSMS}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs whitespace-nowrap cursor-pointer transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSendingTestSMS ? 'Sending...' : 'Send SMS'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {testSMSSuccess && (
                    <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Test SMS alert dispatched successfully! Check the floating toast.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Studio & Invoicing */}
            {activeTab === 'studio' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">Studio Name</label>
                    <input
                      type="text"
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">Official Phone</label>
                    <input
                      type="text"
                      value={formData.studioPhone}
                      onChange={(e) => setFormData({ ...formData, studioPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">Official Email</label>
                    <input
                      type="email"
                      value={formData.studioEmail}
                      onChange={(e) => setFormData({ ...formData, studioEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">Invoice Number Prefix</label>
                    <input
                      type="text"
                      value={formData.invoicePrefix}
                      onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                      placeholder="CKG-INV-"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Physical Studio Address</label>
                  <input
                    type="text"
                    value={formData.studioAddress}
                    onChange={(e) => setFormData({ ...formData, studioAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">
                    Offline MoMo Merchant Account (Displayed on Invoices)
                  </label>
                  <input
                    type="text"
                    value={formData.momoMerchantNumber || ''}
                    onChange={(e) => setFormData({ ...formData, momoMerchantNumber: e.target.value })}
                    placeholder="+233 24 555 0199 (Creative KG Studios)"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300"
                  />
                </div>
              </div>
            )}

            {/* Tab: Security & Passcodes (Super Admin Only) */}
            {isSuperAdmin && activeTab === 'security' && (
              <div className="space-y-5">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-xs text-neutral-300">
                  <span className="font-mono font-bold text-amber-400 uppercase block">Role Separation & Access Hierarchy</span>
                  <p>
                    <strong>👑 Super Admin:</strong> Has master access to system setup, API credentials, billing, and all galleries.
                  </p>
                  <p>
                    <strong>⚡ Standard Admin:</strong> Daily operational access to upload photos, manage client accounts, lock/unlock shoots, and record manual payments.
                  </p>
                  <p>
                    <strong>🎨 Editor (In-House Team):</strong> Photo upload, title/caption edits, category/menu curation (strictly blocked from payments, revenue & client accounts).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-amber-400 font-bold">
                      Super Admin Passcode
                    </label>
                    <input
                      type="text"
                      value={formData.superAdminPasscode}
                      onChange={(e) => setFormData({ ...formData, superAdminPasscode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-amber-400 font-bold"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">Default: superadmin123</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Standard Admin Passcode
                    </label>
                    <input
                      type="text"
                      value={formData.adminPasscode}
                      onChange={(e) => setFormData({ ...formData, adminPasscode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white font-semibold"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">Default: admin123</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase text-neutral-300">
                      Editor Passcode (In-House Staff)
                    </label>
                    <input
                      type="text"
                      value={formData.editorPasscode}
                      onChange={(e) => setFormData({ ...formData, editorPasscode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white font-semibold"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono">Default: editor123</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: .env Export (Super Admin Only) */}
            {isSuperAdmin && activeTab === 'env' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-neutral-200">
                      Environment Configuration File (.env)
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Copy these variables into your hosting server or local `.env` file to persist defaults across builds.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEnv}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-amber-400 border border-neutral-700 transition-all cursor-pointer"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
                    <span>{copiedEnv ? 'Copied to Clipboard!' : 'Copy .env Content'}</span>
                  </button>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <pre className="font-mono text-xs text-amber-300/90 whitespace-pre-wrap select-all leading-relaxed">
                    {generateEnvContent()}
                  </pre>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> System settings saved successfully!
                </span>
              ) : (
                <span className="text-xs font-mono text-neutral-500">
                  Settings sync immediately with live session and storage
                </span>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSuperAdminModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-white transition-all"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
