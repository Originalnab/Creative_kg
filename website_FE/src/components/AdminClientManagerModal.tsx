import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  Lock,
  Unlock,
  DollarSign,
  Search,
  Receipt,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Smartphone,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { ClientAccount, PaymentRecord } from '../types';

export default function AdminClientManagerModal() {
  const {
    showClientManagerModal,
    setShowClientManagerModal,
    clients,
    adminCreateClient,
    deleteClient,
    toggleClientLock,
    recordPayment,
    openReceiptModal,
    photos,
    systemSettings,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'directory' | 'new_client'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'partial' | 'paid' | 'locked'>('all');

  // Manual Payment Recording State
  const [selectedClientForPayment, setSelectedClientForPayment] = useState<ClientAccount | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash' | 'bank_transfer' | 'card'>('mobile_money');
  const [networkProvider, setNetworkProvider] = useState<'MTN' | 'Telecel' | 'AirtelTigo' | 'M-Pesa'>('MTN');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+233 ');
  const [newPasscode, setNewPasscode] = useState('');
  const [newShootTitle, setNewShootTitle] = useState('');
  const [newShootType, setNewShootType] = useState<ClientAccount['shootType']>('wedding');
  const [newEventDate, setNewEventDate] = useState('');
  const [newPackagePrice, setNewPackagePrice] = useState<number>(3000);
  const [newCurrency, setNewCurrency] = useState<'GHS' | 'USD' | 'NGN'>('GHS');
  const [newIsLocked, setNewIsLocked] = useState<boolean>(true);

  if (!showClientManagerModal) return null;

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.shootTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.passcode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'locked') return client.isLocked;
    if (statusFilter === 'all') return true;
    return client.paymentStatus === statusFilter;
  });

  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newPasscode) return;

    adminCreateClient({
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      phone: newPhone,
      passcode: newPasscode,
      shootTitle: newShootTitle || `${newName}'s Session`,
      shootType: newShootType,
      eventDate: newEventDate || new Date().toLocaleDateString(),
      packagePrice: Number(newPackagePrice),
      currency: newCurrency,
      isLocked: newIsLocked,
      paymentStatus: 'unpaid',
    });

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('+233 ');
    setNewPasscode('');
    setNewShootTitle('');
    setNewPackagePrice(3000);
    setActiveTab('directory');
  };

  const handleSaveManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPayment) return;

    const generatedRef = paymentRef || `${paymentMethod.toUpperCase()}_MANUAL_${Date.now().toString().slice(-6)}`;

    const savedPayment = recordPayment(selectedClientForPayment.id, {
      amount: Number(paymentAmount),
      currency: selectedClientForPayment.currency,
      method: paymentMethod,
      networkProvider: paymentMethod === 'mobile_money' ? networkProvider : undefined,
      momoPhoneNumber: paymentMethod === 'mobile_money' ? selectedClientForPayment.phone : undefined,
      transactionReference: generatedRef,
      recordedBy: 'admin',
      notes: paymentNotes || `Manual payment recorded by admin via ${paymentMethod}`,
    });

    const clientRef = clients.find((c) => c.id === selectedClientForPayment.id);
    if (clientRef) {
      openReceiptModal(clientRef, savedPayment);
    }

    setSelectedClientForPayment(null);
    setPaymentAmount(1000);
    setPaymentRef('');
    setPaymentNotes('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8 overflow-hidden"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wide uppercase font-mono text-white">
                  Client Vaults, Billing & Payment Management
                </h2>
                <p className="text-xs text-neutral-400">
                  Manage individual client shoots, lock/unlock galleries, record payments & issue official receipts
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowClientManagerModal(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/40 px-6 py-2">
            <div className="flex space-x-2 text-xs">
              <button
                onClick={() => setActiveTab('directory')}
                className={`py-2 px-3.5 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                  activeTab === 'directory'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>Clients Directory ({clients.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('new_client')}
                className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                  activeTab === 'new_client'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register New Client</span>
              </button>
            </div>

            {activeTab === 'directory' && (
              <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                Total Revenue Recorded: {systemSettings.paystackCurrency} {clients.reduce((acc, c) => acc + c.payments.reduce((pAcc, p) => pAcc + p.amount, 0), 0).toLocaleString()}
              </span>
            )}
          </div>

          {/* Tab 1: Client Directory */}
          {activeTab === 'directory' && (
            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, passcode..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono w-full sm:w-auto overflow-x-auto">
                  {(['all', 'unpaid', 'partial', 'paid', 'locked'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        statusFilter === filter
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredClients.map((client) => {
                  const assignedPhotos = photos.filter((p) => p.clientId === client.id);
                  const totalPaid = client.payments.reduce((acc, p) => acc + p.amount, 0);
                  const balanceDue = Math.max(0, client.packagePrice - totalPaid);

                  return (
                    <div
                      key={client.id}
                      className="p-5 bg-neutral-950/70 border border-neutral-800 rounded-2xl space-y-4 hover:border-neutral-700 transition-all flex flex-col justify-between"
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-sm text-white">{client.name}</h3>
                            <span
                              className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                                client.paymentStatus === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : client.paymentStatus === 'partial'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {client.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-amber-400/90 font-medium pt-0.5">
                            {client.shootTitle}
                          </p>
                        </div>

                        {/* Lock / Unlock Toggle Button */}
                        <button
                          onClick={() => toggleClientLock(client.id)}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                            client.isLocked
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          }`}
                          title={client.isLocked ? 'Click to Unlock Gallery & trigger SMS' : 'Click to Lock Gallery'}
                        >
                          {client.isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Unlocked</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info Chips */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-850">
                        <div className="flex items-center space-x-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>Pass: <strong className="text-white">{client.passcode}</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{client.eventDate || 'Flexible'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{assignedPhotos.length} Photos</span>
                        </div>
                      </div>

                      {/* Billing Breakdown */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase">Package Price</span>
                          <span className="font-bold text-white">
                            {client.currency} {client.packagePrice.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase">Paid to Date</span>
                          <span className="font-bold text-emerald-400">
                            {client.currency} {totalPaid.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-neutral-500 block text-[10px] uppercase">Balance Due</span>
                          <span className={`font-bold ${balanceDue === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {client.currency} {balanceDue.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-850">
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                          title="Delete client record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex space-x-2">
                          {client.payments.length > 0 && (
                            <button
                              onClick={() => openReceiptModal(client, client.payments[0])}
                              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-all cursor-pointer"
                              title="View latest receipt"
                            >
                              <Receipt className="w-3.5 h-3.5 text-amber-400" />
                              <span>Receipt ({client.payments.length})</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedClientForPayment(client);
                              setPaymentAmount(balanceDue > 0 ? balanceDue : client.packagePrice);
                            }}
                            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Record Payment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Register New Client Form */}
          {activeTab === 'new_client' && (
            <form onSubmit={handleCreateNewClient} className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-1">
                <span className="font-mono text-xs text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create New Client Vault Account
                </span>
                <p className="text-xs text-neutral-400">
                  Creating an account automatically sends an Arkesel welcome SMS to the client with their private passcode.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Client Full Name(s) *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Kwame & Serwaa"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Mobile Phone (For Arkesel SMS) *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+233 24 XXX XXXX"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Client Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Access Passcode *</label>
                  <input
                    type="text"
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="e.g. serwaa2026"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Shoot Title</label>
                  <input
                    type="text"
                    value={newShootTitle}
                    onChange={(e) => setNewShootTitle(e.target.value)}
                    placeholder="e.g. Traditional Wedding Ceremony"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Shoot Type</label>
                  <select
                    value={newShootType}
                    onChange={(e) => setNewShootType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="portrait">Portrait</option>
                    <option value="editorial">Editorial</option>
                    <option value="fashion">Fashion</option>
                    <option value="fineart">Fine Art</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Event Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. October 18, 2026"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Package Price *</label>
                  <input
                    type="number"
                    required
                    value={newPackagePrice}
                    onChange={(e) => setNewPackagePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Currency</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                  >
                    <option value="GHS">GHS</option>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-neutral-300">Initial Lock Status</label>
                  <select
                    value={newIsLocked ? 'locked' : 'unlocked'}
                    onChange={(e) => setNewIsLocked(e.target.value === 'locked')}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                  >
                    <option value="locked">🔒 Locked (Payment Required)</option>
                    <option value="unlocked">🔓 Unlocked (Free Access)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Account & Send SMS</span>
                </button>
              </div>
            </form>
          )}

          {/* Modal Overlay: Record Manual Payment Drawer */}
          {selectedClientForPayment && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 space-y-5 text-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-sm uppercase font-mono">
                      Record Manual Payment for {selectedClientForPayment.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedClientForPayment(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveManualPayment} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <label className="block font-mono uppercase text-neutral-300">Amount Received ({selectedClientForPayment.currency}) *</label>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-bold text-emerald-400 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-mono uppercase text-neutral-300">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                      >
                        <option value="mobile_money">Mobile Money (Offline)</option>
                        <option value="cash">Cash Payment</option>
                        <option value="bank_transfer">Bank Wire / Transfer</option>
                        <option value="card">Card POS Terminal</option>
                      </select>
                    </div>

                    {paymentMethod === 'mobile_money' && (
                      <div className="space-y-1">
                        <label className="block font-mono uppercase text-neutral-300">MoMo Network</label>
                        <select
                          value={networkProvider}
                          onChange={(e) => setNetworkProvider(e.target.value as any)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                        >
                          <option value="MTN">MTN MoMo</option>
                          <option value="Telecel">Telecel Cash</option>
                          <option value="AirtelTigo">AirtelTigo Money</option>
                          <option value="M-Pesa">M-Pesa</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono uppercase text-neutral-300">Transaction Reference Code (Optional)</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="e.g. MOMO_TX_12345678"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono uppercase text-neutral-300">Notes / Memo</label>
                    <input
                      type="text"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="e.g. 50% deposit received in cash at studio"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedClientForPayment(null)}
                      className="px-4 py-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase tracking-wider transition-all"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Confirm & Generate Receipt</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
