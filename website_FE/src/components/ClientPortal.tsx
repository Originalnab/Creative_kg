import { useState, useEffect, FormEvent } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Heart,
  Download,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Send,
  CreditCard,
  Receipt,
  Smartphone,
  Sparkles,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { ClientAccount, Photo, ProofPhoto } from '../types';
import { initializePaystackCheckout } from '../services/paystackService';

interface ClientPortalProps {
  onClose: () => void;
}

export default function ClientPortal({ onClose }: ClientPortalProps) {
  const {
    clients,
    photos,
    registerClient,
    recordPayment,
    openReceiptModal,
    systemSettings,
    setShowLoginModal,
  } = useAdmin();

  // Auth Mode: login vs register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('+233 ');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+233 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regShootTitle, setRegShootTitle] = useState('');
  const [regShootType, setRegShootType] = useState<ClientAccount['shootType']>('wedding');

  // Authenticated Client State
  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(() => {
    const savedId = localStorage.getItem('ckg_active_client_id');
    if (savedId) {
      return clients.find((c) => c.id === savedId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem('ckg_active_client_id', currentClient.id);
    } else {
      localStorage.removeItem('ckg_active_client_id');
    }
  }, [currentClient]);

  // Gallery interactive states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedMomoNetwork, setSelectedMomoNetwork] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | 'M-Pesa'>('MTN');

  // Retrieve photos assigned to this client
  const clientPhotos = currentClient
    ? photos.filter((p) => p.clientId === currentClient.id)
    : [];

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmedPasscode = passcode.trim().toLowerCase();
    const cleanPhone = loginPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

    // Match client in registry by phone and passcode
    const matched = clients.find((c) => {
      const cPhone = c.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
      const phoneMatches = !cleanPhone || cleanPhone === '+233' || cPhone.includes(cleanPhone) || cleanPhone.includes(cPhone);
      const passcodeMatches = c.passcode.toLowerCase() === trimmedPasscode;
      return passcodeMatches && phoneMatches;
    });

    if (matched) {
      setCurrentClient(matched);
      setErrorMsg('');
    } else if (trimmedPasscode === 'client2026' || trimmedPasscode === 'demo') {
      // Demo client fallback
      if (clients.length > 0) {
        setCurrentClient(clients[0]);
      }
    } else {
      setErrorMsg('No client vault matched that phone number and passcode combination.');
    }
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regPasscode) return;

    const newClient = registerClient({
      name: regName,
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      phone: regPhone,
      passcode: regPasscode,
      shootTitle: regShootTitle || `${regName}'s Session`,
      shootType: regShootType,
      eventDate: new Date().toLocaleDateString(),
      packagePrice: 3000,
      currency: systemSettings.paystackCurrency || 'GHS',
      isLocked: true,
      paymentStatus: 'unpaid',
    });

    setCurrentClient(newClient);
  };

  const handlePayWithPaystack = async () => {
    if (!currentClient) return;

    const totalPaid = currentClient.payments.reduce((acc, p) => acc + p.amount, 0);
    const amountToPay = Math.max(0, currentClient.packagePrice - totalPaid);

    if (amountToPay <= 0) return;

    setIsProcessingPayment(true);

    try {
      await initializePaystackCheckout({
        amount: amountToPay,
        email: currentClient.email || 'client@creativekg.com',
        clientName: currentClient.name,
        currency: currentClient.currency,
        settings: systemSettings,
        onSuccess: (transactionRef) => {
          setIsProcessingPayment(false);

          // Record payment and auto-unlock
          const newPayment = recordPayment(currentClient.id, {
            amount: amountToPay,
            currency: currentClient.currency,
            method: 'mobile_money',
            networkProvider: selectedMomoNetwork,
            momoPhoneNumber: currentClient.phone,
            transactionReference: transactionRef,
            recordedBy: 'client',
            notes: `Paid via Paystack ${selectedMomoNetwork} Mobile Money`,
          });

          // Refresh current client state
          setCurrentClient((prev) =>
            prev
              ? {
                  ...prev,
                  isLocked: false,
                  paymentStatus: 'paid',
                  payments: [newPayment, ...prev.payments],
                }
              : null
          );
        },
        onCancel: () => {
          setIsProcessingPayment(false);
        },
      });
    } catch (err) {
      console.error(err);
      setIsProcessingPayment(false);
    }
  };

  const toggleFavorite = (photoId: string) => {
    setFavorites((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const startEditingNotes = (photoId: string) => {
    setEditingNotesId(photoId);
    setTempNotesText(notes[photoId] || '');
  };

  const saveNotes = (photoId: string) => {
    setNotes((prev) => ({ ...prev, [photoId]: tempNotesText }));
    setEditingNotesId(null);
  };

  const handleDownloadAll = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  const submitApproval = () => {
    setIsSubmittingApproval(true);
    setTimeout(() => {
      setIsSubmittingApproval(false);
      setIsApproved(true);
    }, 1400);
  };

  // Fallback demo proof images if no photos assigned yet to this client
  const displayPhotos: Array<{ id: string; url: string; title: string; description?: string }> =
    clientPhotos.length > 0
      ? clientPhotos
      : [
          {
            id: 'proof-1',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
            title: 'Ocean cliffs walk at twilight',
            description: 'Heirloom portrait composition with golden dusk lighting.',
          },
          {
            id: 'proof-2',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
            title: 'Veil adjustment candid',
            description: 'Natural light documentary moment during prep.',
          },
          {
            id: 'proof-3',
            url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200',
            title: 'Wedding bands in floral detail',
            description: 'Macro detail print of bridal jewelry and botanicals.',
          },
          {
            id: 'proof-4',
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
            title: 'Sparklers entrance departure',
            description: 'Cinematic night celebration highlight.',
          },
        ];

  return (
    <div id="client-portal-overlay" className="fixed inset-0 z-50 bg-neutral-950 overflow-y-auto flex flex-col text-white">
      {/* Top Header */}
      <div className="border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-xs font-mono tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Vault</span>
        </button>

        <div className="flex items-center space-x-2 text-neutral-400">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-[10px] tracking-widest uppercase">
            {systemSettings.studioName} • Secure Client Vault
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16 md:px-12 flex flex-col justify-center">
        {!currentClient ? (
          /* Authentication Screen (Login / Self-Register) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full mx-auto bg-neutral-900/50 border border-neutral-850 rounded-2xl p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/15 rounded-2xl flex items-center justify-center mx-auto text-amber-400 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Private Proofing Vault</h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Unlock your private session gallery, approve album proofs, or register your upcoming shoot.
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="flex p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Access Vault
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                + Register Client
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+233 24 XXX XXXX"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">
                    Client Passcode *
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter your shoot passcode..."
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/15 cursor-pointer"
                >
                  Open My Private Vault
                </button>

                {/* Staff / In-House Team Portal Link */}
                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setShowLoginModal(true);
                    }}
                    className="text-neutral-400 hover:text-amber-400 transition-colors font-mono text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <span>Staff & In-House Team Login ➔</span>
                  </button>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    (Super Admin • Admin • Editor)
                  </span>
                </div>
              </form>
            ) : (
              /* Self-Registration Form */
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Kwame & Serwaa"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Mobile Phone (For MoMo & SMS) *</label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+233 24 XXX XXXX"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Choose a Private Passcode *</label>
                  <input
                    type="text"
                    required
                    value={regPasscode}
                    onChange={(e) => setRegPasscode(e.target.value)}
                    placeholder="e.g. wedding2026"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-amber-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Shoot / Event Title</label>
                  <input
                    type="text"
                    value={regShootTitle}
                    onChange={(e) => setRegShootTitle(e.target.value)}
                    placeholder="e.g. Accra Nuptials"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/15 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Create Vault</span>
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          /* Authenticated Client Dashboard */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Top Vault Status Card */}
            <div className="p-6 md:p-8 bg-neutral-900/60 border border-neutral-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded">
                    Client Proofing Vault
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border ${
                      currentClient.isLocked
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {currentClient.isLocked ? '🔒 Gallery Locked (Payment Due)' : '🔓 Fully Unlocked & Verified'}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {currentClient.shootTitle}
                </h1>
                <p className="text-xs text-neutral-400 font-mono">
                  Client: <strong className="text-white">{currentClient.name}</strong> • Phone: {currentClient.phone} • Date: {currentClient.eventDate}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {currentClient.payments.length > 0 && (
                  <button
                    onClick={() => openReceiptModal(currentClient, currentClient.payments[0])}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-all cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span>View Official Receipt</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentClient(null)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Payment Alert Banner (If Gallery Locked) */}
            {currentClient.isLocked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 md:p-8 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 border border-amber-500/30 rounded-2xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                      <Lock className="w-4 h-4" />
                      <span>Heirloom Master Delivery Locked</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Complete payment to download high-resolution masters and compile album selections.
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Balance Due: <strong className="text-amber-400 font-mono text-sm">{currentClient.currency} {(currentClient.packagePrice - currentClient.payments.reduce((a, p) => a + p.amount, 0)).toLocaleString()}</strong>
                    </p>
                  </div>

                  {/* MoMo Network Selector & Paystack Checkout Trigger */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                      value={selectedMomoNetwork}
                      onChange={(e) => setSelectedMomoNetwork(e.target.value as any)}
                      className="px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-amber-300"
                    >
                      <option value="MTN">MTN MoMo</option>
                      <option value="Telecel">Telecel Cash</option>
                      <option value="AirtelTigo">AirtelTigo</option>
                      <option value="M-Pesa">M-Pesa / Card</option>
                    </select>

                    <button
                      onClick={handlePayWithPaystack}
                      disabled={isProcessingPayment}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{isProcessingPayment ? 'Processing MoMo...' : `Pay via Paystack (${currentClient.currency} ${(currentClient.packagePrice - currentClient.payments.reduce((a, p) => a + p.amount, 0)).toLocaleString()})`}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Unlocked Controls Bar (Download All & Submit Selection) */}
            {!currentClient.isLocked && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl">
                <div className="flex items-center space-x-4 text-xs font-mono text-neutral-400">
                  <span>Total Proofs: <strong className="text-white">{displayPhotos.length}</strong></span>
                  <span>•</span>
                  <span>Favorites: <strong className="text-amber-400">{favorites.length}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadProgress !== null}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadProgress !== null ? `Compressing (${downloadProgress}%)` : 'Download All High-Res'}</span>
                  </button>

                  <button
                    onClick={submitApproval}
                    disabled={isSubmittingApproval || isApproved}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isApproved ? 'Selection Approved' : 'Submit Final Selection'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Download Progress Bar */}
            {downloadProgress !== null && (
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Compressing High-Resolution Archival ZIP...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Proof Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayPhotos.map((photo, index) => {
                const isFav = favorites.includes(photo.id);

                return (
                  <div
                    key={photo.id}
                    className="bg-neutral-900/30 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/2] bg-neutral-950 overflow-hidden group">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          currentClient.isLocked ? 'blur-[1px] opacity-75' : 'group-hover:scale-105'
                        }`}
                      />

                      {/* Watermark Overlay (If Locked) */}
                      {currentClient.isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                          <span className="font-mono text-xs uppercase tracking-widest text-white/50 border border-white/20 px-4 py-2 rounded-lg rotate-[-12deg]">
                            PROOFS • {systemSettings.studioName}
                          </span>
                        </div>
                      )}

                      {/* Proof Number Badge */}
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-lg">
                        PROOF #{index + 1}
                      </span>

                      {/* Favorites Button */}
                      {!currentClient.isLocked && (
                        <button
                          onClick={() => toggleFavorite(photo.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                            isFav ? 'bg-amber-500 text-neutral-950 scale-110 shadow-lg' : 'bg-black/60 text-white/80 hover:text-white'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      )}
                    </div>

                    {/* Metadata & Collaboration Notes */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{photo.title}</h4>
                        {photo.description && (
                          <p className="text-xs text-neutral-400 mt-1">{photo.description}</p>
                        )}
                      </div>

                      {/* Notes Box */}
                      <div className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] uppercase">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                            Retouching & Framing Note
                          </span>
                          {editingNotesId !== photo.id && !currentClient.isLocked && (
                            <button
                              onClick={() => startEditingNotes(photo.id)}
                              className="text-amber-400 hover:underline cursor-pointer"
                            >
                              {notes[photo.id] ? 'Edit' : '+ Add Note'}
                            </button>
                          )}
                        </div>

                        {editingNotesId === photo.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={tempNotesText}
                              onChange={(e) => setTempNotesText(e.target.value)}
                              placeholder="Add specific cropping, tone or cover remarks..."
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2.5 py-1 text-neutral-400 hover:text-white text-[10px]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveNotes(photo.id)}
                                className="px-3 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg text-[10px]"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-neutral-400 italic text-[11px]">
                            {notes[photo.id] || 'No specific review remarks noted.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
