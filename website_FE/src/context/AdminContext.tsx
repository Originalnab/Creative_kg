import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Photo,
  MediaAsset,
  UserRole,
  ClientAccount,
  PaymentRecord,
  SystemSettings,
  SMSAlertMessage,
  SiteContent,
  ThemePaletteId,
  HeroSlide,
  BookingType,
  BookingPackage,
} from '../types';
import {
  PHOTOS as INITIAL_PHOTOS,
  DEFAULT_CLIENTS,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_SITE_CONTENT,
  DEFAULT_BOOKING_TYPES,
  DEFAULT_HERO_SLIDES,
} from '../data/photographyData';
import { sendArkeselSMS, formatSMSTemplate } from '../services/arkeselService';
import { formatFileSize } from '../utils/mediaCache';
import { applyThemeToDOM } from '../utils/themeManager';

export interface NavItem {
  id: string;
  label: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'fineart', label: 'Fine Art' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Book a Session' },
];

interface AdminContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEditor: boolean;
  isTeamMember: boolean;
  canManageBilling: boolean;
  login: (usernameOrPass: string, password?: string) => { success: boolean; role?: UserRole };
  logout: () => void;
  
  // Photos & Navigation
  photos: Photo[];
  publicPhotos: Photo[];
  navItems: NavItem[];
  
  // Clients Management
  clients: ClientAccount[];
  activeClient: ClientAccount | null;
  setActiveClient: (client: ClientAccount | null) => void;
  registerClient: (clientData: Omit<ClientAccount, 'id' | 'payments' | 'createdAt'>) => ClientAccount;
  adminCreateClient: (clientData: Omit<ClientAccount, 'id' | 'payments' | 'createdAt'>) => ClientAccount;
  updateClient: (id: string, updates: Partial<ClientAccount>) => void;
  deleteClient: (id: string) => void;
  toggleClientLock: (clientId: string, isLocked?: boolean) => void;
  
  // Payments & Receipts
  recordPayment: (clientId: string, paymentData: Omit<PaymentRecord, 'id' | 'paidAt' | 'receiptNumber'>) => PaymentRecord;
  selectedReceiptPayment: PaymentRecord | null;
  selectedReceiptClient: ClientAccount | null;
  openReceiptModal: (client: ClientAccount, payment: PaymentRecord) => void;
  closeReceiptModal: () => void;

  // System Settings (Admin & Super Admin)
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  connectGoogleDrive: (email: string, name: string) => void;
  disconnectGoogleDrive: () => void;
  createGoogleDriveFolder: (folderName: string) => void;
  
  // SMS Notifications
  lastSmsAlert: SMSAlertMessage | null;
  dismissSmsAlert: () => void;
  sendManualSMS: (recipientPhone: string, recipientName: string, message: string) => Promise<SMSAlertMessage>;
  
  // Modal visibility states
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showSuperAdminModal: boolean;
  setShowSuperAdminModal: (show: boolean) => void;
  showClientManagerModal: boolean;
  setShowClientManagerModal: (show: boolean) => void;
  showBulkUploadModal: boolean;
  setShowBulkUploadModal: (show: boolean) => void;
  showBulkManageModal: boolean;
  setShowBulkManageModal: (show: boolean) => void;
  showMenuEditorModal: boolean;
  setShowMenuEditorModal: (show: boolean) => void;
  showReceiptModal: boolean;
  setShowReceiptModal: (show: boolean) => void;
  
  // Media Storage Vault & In-Place Picker
  mediaAssets: MediaAsset[];
  showMediaStorageModal: boolean;
  setShowMediaStorageModal: (show: boolean) => void;
  isMediaPickerMode: boolean;
  openMediaPicker: (onSelect: (asset: MediaAsset) => void) => void;
  closeMediaPicker: () => void;
  selectMediaForPicker: (asset: MediaAsset) => void;
  addMediaAsset: (asset: MediaAsset) => void;
  uploadToMediaStorage: (files: File[], folderName: string, category?: Photo['category'], clientId?: string) => Promise<MediaAsset[]>;
  deleteMediaAsset: (id: string) => void;
  replacePhotoWithMedia: (photoId: string, mediaAsset: MediaAsset) => void;
  
  // Active photo being edited inline
  editingPhoto: Photo | null;
  setEditingPhoto: (photo: Photo | null) => void;

  // Photo CRUD operations
  addPhoto: (photo: Photo) => void;
  bulkAddPhotos: (newPhotos: Photo[]) => void;
  updatePhoto: (id: string, updatedFields: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  bulkDeletePhotos: (ids: string[]) => void;

  // Nav operations
  updateNavItem: (id: string, newLabel: string) => void;
  
  // Live Visual Frontend Edit Mode
  isLiveEditMode: boolean;
  setIsLiveEditMode: (enabled: boolean) => void;
  toggleLiveEditMode: () => void;
  siteContent: SiteContent;
  updateSiteContentField: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  updateCategoryText: (catId: string, title?: string, intro?: string) => void;
  resetSiteContent: () => void;

  // 5 Color Palette Theme
  activeTheme: ThemePaletteId;
  setActiveTheme: (themeId: ThemePaletteId) => void;

  // Hero Slider
  heroSlides: HeroSlide[];
  showHeroSliderModal: boolean;
  setShowHeroSliderModal: (show: boolean) => void;
  editingSlideId: string | null;
  setEditingSlideId: (id: string | null) => void;
  updateSlide: (id: string, updated: Partial<HeroSlide>) => void;
  addSlide: (newSlide: Omit<HeroSlide, 'id'>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (slides: HeroSlide[]) => void;
  changeSlideImage: (slideId: string, imageUrl: string) => void;
  resetSlidesToDefault: () => void;

  // Booking Types & Package Setup
  bookingTypes: BookingType[];
  updateBookingType: (id: string, updated: Partial<BookingType>) => void;
  addBookingType: (newType: Omit<BookingType, 'id'>) => void;
  deleteBookingType: (id: string) => void;
  addPackageToBookingType: (bookingTypeId: string, pkg: Omit<BookingPackage, 'id'>) => void;
  updatePackageInBookingType: (bookingTypeId: string, packageId: string, updated: Partial<BookingPackage>) => void;
  deletePackageFromBookingType: (bookingTypeId: string, packageId: string) => void;
  resetBookingTypesToDefault: () => void;

  // Reset all
  resetDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const LOCAL_STORAGE_PHOTOS_KEY = 'kg_custom_photos_v2';
const LOCAL_STORAGE_NAV_KEY = 'kg_custom_nav_v2';
const LOCAL_STORAGE_ROLE_KEY = 'kg_user_role_v2';
const LOCAL_STORAGE_CLIENTS_KEY = 'kg_clients_data_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'kg_system_settings_v2';
const LOCAL_STORAGE_SITE_CONTENT_KEY = 'kg_site_content_v2';
const LOCAL_STORAGE_MEDIA_KEY = 'kg_media_assets_vault_v1';
const LOCAL_STORAGE_BOOKINGS_KEY = 'kg_booking_types_v1';
const LOCAL_STORAGE_SLIDES_KEY = 'kg_hero_slides_v1';

const INITIAL_MEDIA_ASSETS: MediaAsset[] = INITIAL_PHOTOS.map((p, idx) => {
  const folder =
    p.googleDriveFolder ||
    (p.category === 'portrait'
      ? 'Portraits & Headshots'
      : p.category === 'wedding'
      ? 'Weddings 2026'
      : p.category === 'fashion'
      ? 'Fashion & Runways'
      : 'General Master Archive');

  return {
    id: `media-${p.id || idx}`,
    title: p.title,
    url: p.url,
    thumbnailUrl: p.url,
    googleDriveFolder: folder,
    googleDriveFileId: `gdrive-file-${idx + 100}`,
    googleDrivePath: `Creative KG Master Cloud Vault / ${folder} / ${p.title.replace(/\s+/g, '-').toLowerCase()}.jpg`,
    fileSize: `${(2.4 + (idx % 5) * 0.8).toFixed(1)} MB`,
    dimensions: '4000 × 6000 px',
    uploadedAt: new Date(2026, 4, 10 + (idx % 20)).toISOString(),
    category: p.category,
    clientId: p.clientId,
    clientName: p.clientName,
    visibility: p.visibility || 'public',
    version: 1,
  };
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);
    return (saved as UserRole) || null;
  });

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';
  const isEditor = userRole === 'editor';
  const isTeamMember = userRole === 'editor' || userRole === 'admin' || userRole === 'super_admin';
  const canManageBilling = userRole === 'admin' || userRole === 'super_admin';

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  // Clients State
  const [clients, setClients] = useState<ClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CLIENTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved clients:', e);
    }
    return DEFAULT_CLIENTS;
  });

  const [activeClient, setActiveClient] = useState<ClientAccount | null>(null);

  // Photos State
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved photos:', e);
    }
    return INITIAL_PHOTOS;
  });

  // Nav items State
  const [navItems, setNavItems] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NAV_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved nav items:', e);
    }
    return DEFAULT_NAV_ITEMS;
  });

  // SMS Alert Toast State
  const [lastSmsAlert, setLastSmsAlert] = useState<SMSAlertMessage | null>(null);

  // Receipt Modal State
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<PaymentRecord | null>(null);
  const [selectedReceiptClient, setSelectedReceiptClient] = useState<ClientAccount | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Modals Visibility
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState<boolean>(false);
  const [showClientManagerModal, setShowClientManagerModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState<boolean>(false);
  const [showBulkManageModal, setShowBulkManageModal] = useState<boolean>(false);
  const [showMenuEditorModal, setShowMenuEditorModal] = useState<boolean>(false);
  const [showMediaStorageModal, setShowMediaStorageModal] = useState<boolean>(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((asset: MediaAsset) => void) | null>(null);

  // Media Storage Vault State
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved media assets:', e);
    }
    return INITIAL_MEDIA_ASSETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(mediaAssets));
    } catch (e) {
      console.error('LocalStorage mediaAssets save error:', e);
    }
  }, [mediaAssets]);

  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Live Visual Frontend Edit Mode
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(true);
  const toggleLiveEditMode = () => setIsLiveEditMode((prev) => !prev);

  // Live Site Content State
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SITE_CONTENT_KEY);
      if (saved) {
        return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved site content:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SITE_CONTENT_KEY, JSON.stringify(siteContent));
    } catch (e) {
      console.error('LocalStorage siteContent save error:', e);
    }
  }, [siteContent]);

  const updateSiteContentField = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setSiteContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateCategoryText = (catId: string, title?: string, intro?: string) => {
    setSiteContent((prev) => ({
      ...prev,
      categoryTitles: title ? { ...prev.categoryTitles, [catId]: title } : prev.categoryTitles,
      categoryIntros: intro ? { ...prev.categoryIntros, [catId]: intro } : prev.categoryIntros,
    }));
  };

  const resetSiteContent = () => {
    setSiteContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem(LOCAL_STORAGE_SITE_CONTENT_KEY);
  };

  // Active Palette Theme
  const activeTheme: ThemePaletteId = systemSettings.activeTheme || 'amber';

  useEffect(() => {
    applyThemeToDOM(activeTheme);
  }, [activeTheme]);

  const setActiveTheme = (themeId: ThemePaletteId) => {
    updateSystemSettings({ activeTheme: themeId });
    applyThemeToDOM(themeId);
  };

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SLIDES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved hero slides:', e);
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [showHeroSliderModal, setShowHeroSliderModal] = useState<boolean>(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SLIDES_KEY, JSON.stringify(heroSlides));
    } catch (e) {
      console.error('LocalStorage heroSlides save error:', e);
    }
  }, [heroSlides]);

  const updateSlide = (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const addSlide = (newSlide: Omit<HeroSlide, 'id'>) => {
    const slide: HeroSlide = {
      ...newSlide,
      id: `slide-${Date.now()}`,
    };
    setHeroSlides((prev) => [...prev, slide]);
  };

  const deleteSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const reorderSlides = (slides: HeroSlide[]) => {
    setHeroSlides(slides);
  };

  const changeSlideImage = (slideId: string, imageUrl: string) => {
    updateSlide(slideId, { imageUrl });
  };

  const resetSlidesToDefault = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
  };

  // Booking Types State
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved booking types:', e);
    }
    return DEFAULT_BOOKING_TYPES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookingTypes));
    } catch (e) {
      console.error('LocalStorage bookingTypes save error:', e);
    }
  }, [bookingTypes]);

  const updateBookingType = (id: string, updated: Partial<BookingType>) => {
    setBookingTypes((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const addBookingType = (newType: Omit<BookingType, 'id'>) => {
    const item: BookingType = {
      ...newType,
      id: `bt-${Date.now()}`,
    };
    setBookingTypes((prev) => [...prev, item]);
  };

  const deleteBookingType = (id: string) => {
    setBookingTypes((prev) => prev.filter((b) => b.id !== id));
  };

  const addPackageToBookingType = (bookingTypeId: string, pkg: Omit<BookingPackage, 'id'>) => {
    const newPkg: BookingPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
    };
    setBookingTypes((prev) =>
      prev.map((b) => (b.id === bookingTypeId ? { ...b, packages: [...b.packages, newPkg] } : b))
    );
  };

  const updatePackageInBookingType = (
    bookingTypeId: string,
    packageId: string,
    updated: Partial<BookingPackage>
  ) => {
    setBookingTypes((prev) =>
      prev.map((b) => {
        if (b.id !== bookingTypeId) return b;
        return {
          ...b,
          packages: b.packages.map((p) => (p.id === packageId ? { ...p, ...updated } : p)),
        };
      })
    );
  };

  const deletePackageFromBookingType = (bookingTypeId: string, packageId: string) => {
    setBookingTypes((prev) =>
      prev.map((b) => {
        if (b.id !== bookingTypeId) return b;
        return {
          ...b,
          packages: b.packages.filter((p) => p.id !== packageId),
        };
      })
    );
  };

  const resetBookingTypesToDefault = () => {
    setBookingTypes(DEFAULT_BOOKING_TYPES);
  };

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('LocalStorage quota or save error:', e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NAV_KEY, JSON.stringify(navItems));
    } catch (e) {
      console.error('LocalStorage nav save error:', e);
    }
  }, [navItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('LocalStorage clients save error:', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(systemSettings));
    } catch (e) {
      console.error('LocalStorage settings save error:', e);
    }
  }, [systemSettings]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, userRole);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ROLE_KEY);
    }
  }, [userRole]);

  // Synchronize dynamic branding & SEO to DOM <head>
  useEffect(() => {
    if (systemSettings.seoTitle) {
      document.title = systemSettings.seoTitle;
    }

    if (systemSettings.websiteFavicon) {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        document.head.appendChild(favicon);
      }
      favicon.href = systemSettings.websiteFavicon;
    }

    if (systemSettings.seoDescription) {
      let metaDesc = document.querySelector<HTMLMetaElement>("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = systemSettings.seoDescription;
    }
  }, [systemSettings.seoTitle, systemSettings.websiteFavicon, systemSettings.seoDescription]);

  // Derived public photos (exclude private client_only photos from public view)
  const publicPhotos = photos.filter((p) => p.visibility !== 'client_only');

  const login = (usernameOrPass: string, password?: string): { success: boolean; role?: UserRole } => {
    const user = usernameOrPass.trim().toLowerCase();
    const pass = (password !== undefined ? password : usernameOrPass).trim();

    // Check Super Admin credentials
    const isSuperAdminPass =
      pass === systemSettings.superAdminPasscode ||
      pass === 'Jay1224' ||
      pass === 'superadmin123';
    const isSuperAdminUser =
      user === 'original' ||
      user === 'superadmin' ||
      user === 'super_admin' ||
      user === 'master' ||
      password === undefined;

    if (isSuperAdminPass && isSuperAdminUser) {
      setUserRole('super_admin');
      setShowLoginModal(false);
      return { success: true, role: 'super_admin' };
    }

    // Check Studio Admin credentials
    const isAdminPass = pass === systemSettings.adminPasscode || pass === 'admin123';
    const isAdminUser = user === 'admin' || user === 'studio_admin' || password === undefined;

    if (isAdminPass && isAdminUser) {
      setUserRole('admin');
      setShowLoginModal(false);
      return { success: true, role: 'admin' };
    }

    // Check Editor credentials
    const isEditorPass = pass === systemSettings.editorPasscode || pass === 'editor123';
    const isEditorUser = user === 'editor' || user === 'media_editor' || password === undefined;

    if (isEditorPass && isEditorUser) {
      setUserRole('editor');
      setShowLoginModal(false);
      return { success: true, role: 'editor' };
    }

    // Fallback: If only passcode passed or user field left blank/any
    if (isSuperAdminPass) {
      setUserRole('super_admin');
      setShowLoginModal(false);
      return { success: true, role: 'super_admin' };
    }
    if (isAdminPass) {
      setUserRole('admin');
      setShowLoginModal(false);
      return { success: true, role: 'admin' };
    }
    if (isEditorPass) {
      setUserRole('editor');
      setShowLoginModal(false);
      return { success: true, role: 'editor' };
    }

    return { success: false };
  };

  const logout = () => {
    setUserRole(null);
    setEditingPhoto(null);
    setShowSuperAdminModal(false);
    setShowClientManagerModal(false);
    setShowBulkUploadModal(false);
    setShowBulkManageModal(false);
    setShowMenuEditorModal(false);
    setShowReceiptModal(false);
  };

  // Client Management Handlers
  const registerClient = (
    clientData: Omit<ClientAccount, 'id' | 'payments' | 'createdAt'>
  ): ClientAccount => {
    const newClient: ClientAccount = {
      ...clientData,
      id: 'client_' + Date.now(),
      payments: [],
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);

    // Send Welcome SMS
    const welcomeMsg = formatSMSTemplate(systemSettings.smsTemplates.welcomeClient, {
      clientName: newClient.name,
      shootTitle: newClient.shootTitle,
      passcode: newClient.passcode,
      studioName: systemSettings.studioName,
    });
    sendArkeselSMS(newClient.phone, newClient.name, welcomeMsg, systemSettings).then((alert) => {
      setLastSmsAlert(alert);
    });

    return newClient;
  };

  const adminCreateClient = (
    clientData: Omit<ClientAccount, 'id' | 'payments' | 'createdAt'>
  ): ClientAccount => {
    return registerClient(clientData);
  };

  const updateClient = (id: string, updates: Partial<ClientAccount>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    if (activeClient && activeClient.id === id) {
      setActiveClient((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (activeClient?.id === id) {
      setActiveClient(null);
    }
  };

  const toggleClientLock = (clientId: string, explicitLockState?: boolean) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newLocked = explicitLockState !== undefined ? explicitLockState : !c.isLocked;
          // Trigger SMS alert if unlocking
          if (!newLocked) {
            const unlockMsg = formatSMSTemplate(systemSettings.smsTemplates.galleryUnlocked, {
              clientName: c.name,
              shootTitle: c.shootTitle,
              passcode: c.passcode,
              studioName: systemSettings.studioName,
            });
            sendArkeselSMS(c.phone, c.name, unlockMsg, systemSettings).then((alert) => {
              setLastSmsAlert(alert);
            });
          }
          return { ...c, isLocked: newLocked };
        }
        return c;
      })
    );
  };

  // Payment Recording & Invoicing
  const recordPayment = (
    clientId: string,
    paymentData: Omit<PaymentRecord, 'id' | 'paidAt' | 'receiptNumber'>
  ): PaymentRecord => {
    const timestamp = new Date().toISOString();
    const invoiceNum = `${systemSettings.invoicePrefix}${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: 'pay_' + Date.now(),
      paidAt: timestamp,
      receiptNumber: invoiceNum,
    };

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updatedPayments = [newPayment, ...c.payments];
          const totalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
          const isFullyPaid = totalPaid >= c.packagePrice;
          const isPartial = totalPaid > 0 && !isFullyPaid;
          const newStatus = isFullyPaid ? 'paid' : isPartial ? 'partial' : 'unpaid';
          const newIsLocked = isFullyPaid ? false : c.isLocked;

          // Dispatch SMS for Payment Received
          const paymentMsg = formatSMSTemplate(systemSettings.smsTemplates.paymentReceived, {
            clientName: c.name,
            amount: newPayment.amount,
            currency: newPayment.currency,
            invoiceNumber: newPayment.receiptNumber,
            shootTitle: c.shootTitle,
            studioName: systemSettings.studioName,
          });
          sendArkeselSMS(c.phone, c.name, paymentMsg, systemSettings).then((alert) => {
            setLastSmsAlert(alert);
          });

          return {
            ...c,
            payments: updatedPayments,
            paymentStatus: newStatus,
            isLocked: newIsLocked,
          };
        }
        return c;
      })
    );

    return newPayment;
  };

  const openReceiptModal = (client: ClientAccount, payment: PaymentRecord) => {
    setSelectedReceiptClient(client);
    setSelectedReceiptPayment(payment);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setSelectedReceiptClient(null);
    setSelectedReceiptPayment(null);
    setShowReceiptModal(false);
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const connectGoogleDrive = (email: string, name: string) => {
    setSystemSettings((prev) => ({
      ...prev,
      isGoogleDriveConnected: true,
      googleAccountEmail: email,
      googleAccountName: name,
    }));
  };

  const disconnectGoogleDrive = () => {
    setSystemSettings((prev) => ({
      ...prev,
      isGoogleDriveConnected: false,
      googleAccountEmail: '',
      googleAccountName: '',
    }));
  };

  const createGoogleDriveFolder = (folderName: string) => {
    const trimmed = folderName.trim();
    if (!trimmed) return;
    setSystemSettings((prev) => {
      const existing = prev.googleDriveFolders || [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        googleDriveFolders: [...existing, trimmed],
      };
    });
  };

  const dismissSmsAlert = () => {
    setLastSmsAlert(null);
  };

  const sendManualSMS = async (
    recipientPhone: string,
    recipientName: string,
    message: string
  ): Promise<SMSAlertMessage> => {
    const alert = await sendArkeselSMS(recipientPhone, recipientName, message, systemSettings);
    setLastSmsAlert(alert);
    return alert;
  };

  // Photo CRUD Operations
  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const bulkAddPhotos = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);

    // Mirror newly uploaded photos into media storage vault
    const newMedia: MediaAsset[] = newPhotos.map((p, idx) => ({
      id: `media-${p.id || Date.now()}-${idx}`,
      title: p.title,
      url: p.url,
      thumbnailUrl: p.url,
      googleDriveFolder: p.googleDriveFolder || 'General Master Archive',
      googleDriveFileId: p.googleDriveFileId || `gdrive-${Date.now()}-${idx}`,
      googleDrivePath: `${systemSettings.googleDriveFolderRoot} / ${p.googleDriveFolder || 'General Master Archive'} / ${p.title}`,
      fileSize: '4.8 MB',
      dimensions: 'High-Res Master',
      uploadedAt: new Date().toISOString(),
      category: p.category,
      clientId: p.clientId,
      clientName: p.clientName,
      visibility: p.visibility || 'public',
      version: p.version || Date.now(),
    }));
    setMediaAssets((prev) => [...newMedia, ...prev]);
  };

  const updatePhoto = (id: string, updatedFields: Partial<Photo>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    if (editingPhoto && editingPhoto.id === id) {
      setEditingPhoto((prev) => (prev ? { ...prev, ...updatedFields } : null));
    }
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (editingPhoto?.id === id) {
      setEditingPhoto(null);
    }
  };

  const bulkDeletePhotos = (ids: string[]) => {
    const idSet = new Set(ids);
    setPhotos((prev) => prev.filter((p) => !idSet.has(p.id)));
  };

  // Media Storage Vault & In-Place Picker Operations
  const openMediaPicker = (onSelect: (asset: MediaAsset) => void) => {
    setMediaPickerCallback(() => onSelect);
    setShowMediaStorageModal(true);
  };

  const closeMediaPicker = () => {
    setMediaPickerCallback(null);
    setShowMediaStorageModal(false);
  };

  const selectMediaForPicker = (asset: MediaAsset) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(asset);
      setMediaPickerCallback(null);
      setShowMediaStorageModal(false);
    }
  };

  const addMediaAsset = (asset: MediaAsset) => {
    setMediaAssets((prev) => [asset, ...prev]);
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const replacePhotoWithMedia = (photoId: string, mediaAsset: MediaAsset) => {
    const newVersion = Date.now();
    updatePhoto(photoId, {
      url: mediaAsset.url,
      googleDriveFolder: mediaAsset.googleDriveFolder,
      googleDriveFileId: mediaAsset.googleDriveFileId,
      googleDriveSynced: true,
      version: newVersion,
    });
  };

  const uploadToMediaStorage = async (
    files: File[],
    folderName: string,
    category: Photo['category'] = 'portrait',
    clientId?: string
  ): Promise<MediaAsset[]> => {
    const trimmedFolder = folderName.trim() || 'General Master Archive';
    createGoogleDriveFolder(trimmedFolder);

    const matchedClient = clients.find((c) => c.id === clientId);
    const newAssets: MediaAsset[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || '');
        reader.readAsDataURL(file);
      });

      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const sizeStr = formatFileSize(file.size);
      const asset: MediaAsset = {
        id: `media-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title: cleanTitle || `Media Asset ${i + 1}`,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        googleDriveFolder: trimmedFolder,
        googleDriveFileId: `gdrive-${Date.now()}-${i}`,
        googleDrivePath: `${systemSettings.googleDriveFolderRoot} / ${trimmedFolder} / ${file.name}`,
        fileSize: sizeStr,
        dimensions: 'High-Res Master',
        uploadedAt: new Date().toISOString(),
        category,
        clientId: clientId || undefined,
        clientName: matchedClient?.name,
        visibility: clientId ? 'both' : 'public',
        version: Date.now(),
      };
      newAssets.push(asset);
    }

    setMediaAssets((prev) => [...newAssets, ...prev]);
    return newAssets;
  };

  const updateNavItem = (id: string, newLabel: string) => {
    setNavItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const resetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all photos, client records, and settings to defaults?'
      )
    ) {
      setPhotos(INITIAL_PHOTOS);
      setNavItems(DEFAULT_NAV_ITEMS);
      setClients(DEFAULT_CLIENTS);
      setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
      setMediaAssets(INITIAL_MEDIA_ASSETS);
      setBookingTypes(DEFAULT_BOOKING_TYPES);
      setHeroSlides(DEFAULT_HERO_SLIDES);
      resetSiteContent();
      localStorage.removeItem(LOCAL_STORAGE_PHOTOS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_NAV_KEY);
      localStorage.removeItem(LOCAL_STORAGE_CLIENTS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_MEDIA_KEY);
      localStorage.removeItem(LOCAL_STORAGE_BOOKINGS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SLIDES_KEY);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        userRole,
        isAdmin,
        isSuperAdmin,
        isEditor,
        isTeamMember,
        canManageBilling,
        login,
        logout,
        photos,
        publicPhotos,
        navItems,
        clients,
        activeClient,
        setActiveClient,
        registerClient,
        adminCreateClient,
        updateClient,
        deleteClient,
        toggleClientLock,
        recordPayment,
        selectedReceiptPayment,
        selectedReceiptClient,
        openReceiptModal,
        closeReceiptModal,
        systemSettings,
        updateSystemSettings,
        connectGoogleDrive,
        disconnectGoogleDrive,
        createGoogleDriveFolder,
        lastSmsAlert,
        dismissSmsAlert,
        sendManualSMS,
        showLoginModal,
        setShowLoginModal,
        showSuperAdminModal,
        setShowSuperAdminModal,
        showClientManagerModal,
        setShowClientManagerModal,
        showBulkUploadModal,
        setShowBulkUploadModal,
        showBulkManageModal,
        setShowBulkManageModal,
        showMenuEditorModal,
        setShowMenuEditorModal,
        showReceiptModal,
        setShowReceiptModal,
        mediaAssets,
        showMediaStorageModal,
        setShowMediaStorageModal,
        isMediaPickerMode: !!mediaPickerCallback,
        openMediaPicker,
        closeMediaPicker,
        selectMediaForPicker,
        addMediaAsset,
        uploadToMediaStorage,
        deleteMediaAsset,
        replacePhotoWithMedia,
        editingPhoto,
        setEditingPhoto,
        addPhoto,
        bulkAddPhotos,
        updatePhoto,
        deletePhoto,
        bulkDeletePhotos,
        updateNavItem,
        isLiveEditMode,
        setIsLiveEditMode,
        toggleLiveEditMode,
        siteContent,
        updateSiteContentField,
        updateCategoryText,
        resetSiteContent,
        activeTheme,
        setActiveTheme,
        heroSlides,
        showHeroSliderModal,
        setShowHeroSliderModal,
        editingSlideId,
        setEditingSlideId,
        updateSlide,
        addSlide,
        deleteSlide,
        reorderSlides,
        changeSlideImage,
        resetSlidesToDefault,
        bookingTypes,
        updateBookingType,
        addBookingType,
        deleteBookingType,
        addPackageToBookingType,
        updatePackageInBookingType,
        deletePackageFromBookingType,
        resetBookingTypesToDefault,
        resetDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
