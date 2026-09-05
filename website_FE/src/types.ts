export interface ExifData {
  camera: string;
  lens: string;
  shutterSpeed: string;
  aperture: string;
  iso: string;
  focalLength: string;
}

export type PhotoVisibility = 'public' | 'client_only' | 'both';

export interface PhotoFilters {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sepia?: number;
  grayscale?: number;
  blur?: number;
  hueRotate?: number;
  preset?: string;
  rotate?: number;
  flipH?: boolean;
  flipV?: boolean;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  category: 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart';
  url: string;
  aspectRatio: '1:1' | '16:9' | '3:4' | '4:3' | '9:16' | '2:3' | '3:2';
  orientation: 'portrait' | 'landscape' | 'square';
  colorPalette: 'warm' | 'cool' | 'monochrome' | 'vibrant' | 'muted';
  tags: string[];
  location: string;
  year: number;
  exif: ExifData;
  visibility?: PhotoVisibility;
  clientId?: string;
  clientName?: string;
  isWatermarked?: boolean;
  filters?: PhotoFilters;
  googleDriveFolder?: string;
  googleDriveFileId?: string;
  googleDriveSynced?: boolean;
  version?: number;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  googleDriveFolder: string;
  googleDriveFileId?: string;
  googleDrivePath?: string;
  fileSize?: string;
  dimensions?: string;
  uploadedAt: string;
  category: 'portrait' | 'wedding' | 'editorial' | 'fashion' | 'fineart';
  clientId?: string;
  clientName?: string;
  visibility: PhotoVisibility;
  version: number;
}

export type ThemePaletteId = 'amber' | 'emerald' | 'sapphire' | 'rose' | 'monochrome';

export interface ThemePaletteConfig {
  id: ThemePaletteId;
  name: string;
  description: string;
  primaryHex: string;
  primaryHoverHex: string;
  primaryRgb: string;
  accentHex: string;
  surfaceHex: string;
  glowRgba: string;
  badge: string;
  previewColors: string[];
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaAction: string;
  secondaryCtaText: string;
  secondaryCtaAction: string;
  alignment?: 'center' | 'left' | 'right';
  overlayOpacity?: number;
}

export interface BookingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  deliverables: string[];
  description: string;
  isPopular?: boolean;
}

export interface BookingType {
  id: string;
  name: string;
  slug: string;
  startingPrice: number;
  currency: string;
  badge?: string;
  description: string;
  packages: BookingPackage[];
  active: boolean;
}

export interface BookingInquiry {
  id: string;
  bookingTypeId: string;
  bookingTypeName: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  currency: string;
  date: string;
  preferredTimeSlot?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  instagram?: string;
  message: string;
  status: 'pending' | 'reviewed' | 'confirmed' | 'archived';
  createdAt: string;
}

export interface SiteContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  showcaseHeading: string;
  showcaseSubheading: string;
  aboutStudioBadge: string;
  aboutStudioTitle: string;
  aboutPhotographerTitle: string;
  aboutBio: string;
  aboutMainBase: string;
  aboutRepresentation: string;
  aboutCoreLenses: string;
  aboutMediumFormat: string;
  gearBagHeading: string;
  gearBagDescription: string;
  footerTagline: string;
  footerAddress: string;
  categoryTitles: Record<string, string>;
  categoryIntros: Record<string, string>;
}

export interface GearItem {
  id: string;
  name: string;
  type: 'camera' | 'lens' | 'accessory';
  specs: string;
  description: string;
}

export interface Milestone {
  year: string;
  title: string;
  location: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  category: string;
  avatar: string;
}

export interface ProjectPackage {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  deliverables: string[];
  duration: string;
  idealFor: string;
}

export interface ProofPhoto {
  id: string;
  url: string;
  title: string;
  isFavorite: boolean;
  notes?: string;
}

export interface ProofGallery {
  id: string;
  passcode: string;
  clientName: string;
  eventDate: string;
  title: string;
  description: string;
  photos: ProofPhoto[];
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'client' | null;

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  method: 'mobile_money' | 'cash' | 'bank_transfer' | 'card';
  networkProvider?: 'MTN' | 'Telecel' | 'AirtelTigo' | 'M-Pesa';
  momoPhoneNumber?: string;
  transactionReference: string;
  paidAt: string;
  recordedBy: 'client' | 'admin' | 'super_admin';
  receiptNumber: string;
  notes?: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passcode: string;
  shootTitle: string;
  shootType: 'wedding' | 'portrait' | 'editorial' | 'fashion' | 'fineart' | 'event';
  eventDate: string;
  packagePrice: number;
  currency: string;
  isLocked: boolean;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  payments: PaymentRecord[];
  createdAt: string;
}

export interface SMSTemplateConfig {
  paymentReceived: string;
  galleryUnlocked: string;
  welcomeClient: string;
}

export interface SystemSettings {
  // Branding & SEO Setup
  websiteName: string;
  websiteLogo?: string;
  websiteFavicon?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage?: string;
  activeTheme?: ThemePaletteId;

  // Google Account & Drive Integration
  isGoogleDriveConnected: boolean;
  googleAccountEmail: string;
  googleAccountName: string;
  googleDriveFolderRoot: string;
  googleDriveFolders: string[];
  autoBackupToDrive: boolean;

  // Paystack
  paystackPublicKey: string;
  paystackSecretKey?: string;
  paystackCurrency: 'GHS' | 'USD' | 'NGN';
  paystackMode: 'test' | 'live';

  // Arkesel SMS
  arkeselApiKey: string;
  arkeselSenderId: string;
  smsTemplates: SMSTemplateConfig;

  // Studio Profile
  studioName: string;
  studioPhone: string;
  studioEmail: string;
  studioAddress: string;
  invoicePrefix: string;
  momoMerchantNumber?: string;

  // Security Passcodes
  adminPasscode: string;
  superAdminPasscode: string;
  editorPasscode: string;
}

export interface SMSAlertMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  senderId: string;
  timestamp: string;
  status: 'sent' | 'simulated' | 'failed';
}
