import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  AlertCircle,
  Shield,
  Crown,
  Palette,
  ArrowLeft,
  User,
  UserCheck,
  Sparkles,
  Unlock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { UserRole } from '../types';

interface AdminLoginModalProps {
  onOpenClientVault?: () => void;
}

interface DemoAccount {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  username: string;
  passcode: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
  clientId?: string;
}

export default function AdminLoginModal({ onOpenClientVault }: AdminLoginModalProps) {
  const { showLoginModal, setShowLoginModal, login, clients, systemSettings } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [isSuperAdminEverUnlocked, setIsSuperAdminEverUnlocked] = useState(false);

  // Check if credentials match the secret unlock: demo / kgdemo, or Super Admin: Original / Jay1224
  useEffect(() => {
    if (username.trim().toLowerCase() === 'demo' && password === 'kgdemo') {
      setIsDemoUnlocked(true);
      setSuccessNotice('Demo mode unlocked! Demo profiles revealed below.');
      setError('');
    }

    if (username.trim().toLowerCase() === 'original' && password.trim() === 'Jay1224') {
      setIsSuperAdminEverUnlocked(true);
      setIsDemoUnlocked(true);
      setSuccessNotice('Super Admin (Original) credentials unlocked!');
      setError('');
    }
  }, [username, password]);

  if (!showLoginModal) return null;

  // Super Admin is hidden until username is 'Original' and password is 'Jay1224'
  const isSuperAdminUnlocked =
    isSuperAdminEverUnlocked ||
    (username.trim().toLowerCase() === 'original' && password.trim() === 'Jay1224');

  const demoAccounts: DemoAccount[] = [
    {
      id: 'studio_admin',
      name: 'Studio Admin',
      role: 'admin',
      roleLabel: 'Admin Dashboard',
      username: 'admin',
      passcode: systemSettings.adminPasscode || 'admin123',
      description: 'Daily studio operations, client manager, uploads & invoicing',
      icon: Shield,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    {
      id: 'media_editor',
      name: 'Media Editor',
      role: 'editor',
      roleLabel: 'Editor Portal',
      username: 'editor',
      passcode: systemSettings.editorPasscode || 'editor123',
      description: 'Photo uploads, catalog tagging, and menu curation (no billing)',
      icon: Palette,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    ...(isSuperAdminUnlocked
      ? [
          {
            id: 'super_admin',
            name: 'Super Admin (Original)',
            role: 'super_admin' as UserRole,
            roleLabel: 'Master System Setup',
            username: 'Original',
            passcode: 'Jay1224',
            description: 'Full master privileges, API credentials, SMS & Paystack configuration',
            icon: Crown,
            badgeColor: 'bg-amber-400 text-neutral-950 font-black'
          }
        ]
      : []),
    {
      id: 'client_mensah',
      name: 'Kofi & Abena Mensah',
      role: 'client',
      roleLabel: 'Client Vault (Locked)',
      username: '+233 50 123 4567',
      passcode: 'mensah2026',
      description: 'Client proofing gallery with watermarks & pending balance payment',
      icon: UserCheck,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      clientId: 'client_2'
    },
    {
      id: 'client_charlotte',
      name: 'Charlotte & William',
      role: 'client',
      roleLabel: 'Client Vault (Unlocked)',
      username: '+233 24 555 0199',
      passcode: 'client2026',
      description: 'Paid client gallery with full master high-resolution downloads',
      icon: UserCheck,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      clientId: 'client_1'
    }
  ];

  const handleSelectAccount = (acc: DemoAccount) => {
    setUsername(acc.username);
    setPassword(acc.passcode);
    setSelectedAccountId(acc.id);
    setError('');
    setSuccessNotice(`Loaded ${acc.name} credentials into login fields.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Secret demo trigger submitted directly
    if (username.trim().toLowerCase() === 'demo' && password.trim() === 'kgdemo') {
      setIsDemoUnlocked(true);
      setSuccessNotice('Demo mode activated! Select an account below to login.');
      return;
    }

    if (!password) {
      setError('Please enter your password or passcode');
      return;
    }

    // Check if logging into a client account
    const cleanPhone = username.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    const matchedClient = clients.find((c) => {
      const cPhone = c.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
      const phoneMatches =
        cleanPhone && (cPhone.includes(cleanPhone) || cleanPhone.includes(cPhone));
      const passcodeMatches = c.passcode.toLowerCase() === password.trim().toLowerCase();
      return passcodeMatches && (phoneMatches || !username);
    });

    if (matchedClient) {
      localStorage.setItem('ckg_active_client_id', matchedClient.id);
      setShowLoginModal(false);
      if (onOpenClientVault) {
        onOpenClientVault();
      }
      return;
    }

    // Attempt staff login
    const res = login(username, password);
    if (!res.success) {
      setError('Authentication failed. Please verify your username and password.');
    } else {
      setUsername('');
      setPassword('');
      setError('');
      setShowLoginModal(false);
    }
  };

  const handleSwitchToClientVault = () => {
    setShowLoginModal(false);
    if (onOpenClientVault) {
      onOpenClientVault();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 sm:p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8"
        >
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">In-House Studio Gateway</h2>
              <p className="text-xs text-neutral-400">Team portal for Super Admin, Admins & Media Editors</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                Username or Role
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. admin, editor, or superadmin"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-neutral-600 text-white font-mono"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                Password / Passcode
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter passcode..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-neutral-600 text-white font-mono"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {successNotice && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{successNotice}</span>
              </motion.div>
            )}

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Enter Portal</span>
              </button>
            </div>
          </form>

          {/* Switch to Client Vault Button */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSwitchToClientVault}
              className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Switch to Client Vault</span>
            </button>
          </div>

          {/* Secret Demo Accounts Section (Only visible when unlocked via demo / kgdemo) */}
          {isDemoUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 pt-4 border-t border-amber-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-amber-500/20 text-amber-400 rounded-md">
                    <Unlock className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Demo Accounts Active
                  </h4>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Click to auto-populate</span>
              </div>

              {/* Super Admin locked teaser if Original / Jay1224 is not yet provided */}
              {!isSuperAdminUnlocked && (
                <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-neutral-400">
                    <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-[11px]">
                      Super Admin locked. Username: <code className="text-amber-400 font-bold">Original</code> & Password: <code className="text-amber-400 font-bold">Jay1224</code>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('Original');
                      setPassword('Jay1224');
                      setIsSuperAdminEverUnlocked(true);
                      setSuccessNotice('Super Admin credentials applied!');
                    }}
                    className="ml-2 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] font-mono rounded border border-amber-500/30 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    Unlock Super Admin
                  </button>
                </div>
              )}

              {/* Demo Accounts List */}
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedAccountId === acc.id;
                  const isSuper = acc.id === 'super_admin';

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectAccount(acc)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500/50'
                          : isSuper
                          ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/15'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                            isSuper
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{acc.name}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${acc.badgeColor}`}
                            >
                              {acc.roleLabel}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{acc.description}</p>
                          <div className="mt-1 flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
                            <span>User: <code className="text-white font-bold">{acc.username}</code></span>
                            <span>•</span>
                            <span>Pass: <code className="text-amber-400 font-bold">{acc.passcode}</code></span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-1 pl-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-600 hover:text-neutral-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
