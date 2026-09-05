import React, { useState, useEffect, FormEvent } from 'react';
import {
  Calendar,
  CheckCircle2,
  Sliders,
  MessageSquare,
  ArrowRight,
  Instagram,
  PhoneCall,
  Check,
  Clock,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { BookingType, BookingPackage } from '../types';

interface ContactProps {
  prefilledCategory?: string;
  prefilledTitle?: string;
  onClearPrefills?: () => void;
}

export default function Contact({
  prefilledCategory = '',
  prefilledTitle = '',
  onClearPrefills,
}: ContactProps) {
  const { bookingTypes, sendManualSMS } = useAdmin();

  const activeBookingTypes = bookingTypes.filter((b) => b.active);

  // Form states
  const [selectedBookingTypeId, setSelectedBookingTypeId] = useState<string>(() => {
    if (prefilledCategory) {
      const match = activeBookingTypes.find(
        (b) =>
          b.slug.toLowerCase().includes(prefilledCategory.toLowerCase()) ||
          b.id.toLowerCase().includes(prefilledCategory.toLowerCase())
      );
      if (match) return match.id;
    }
    return activeBookingTypes[0]?.id || 'weddings';
  });

  const selectedBookingType: BookingType | undefined =
    activeBookingTypes.find((b) => b.id === selectedBookingTypeId) ||
    activeBookingTypes[0];

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    selectedBookingType?.packages[0]?.id || ''
  );

  // Automatically update package selection when booking type changes
  useEffect(() => {
    if (selectedBookingType && selectedBookingType.packages.length > 0) {
      const popular = selectedBookingType.packages.find((p) => p.isPopular);
      setSelectedPackageId(popular?.id || selectedBookingType.packages[0].id);
    }
  }, [selectedBookingTypeId, selectedBookingType]);

  const selectedPackage: BookingPackage | undefined =
    selectedBookingType?.packages.find((p) => p.id === selectedPackageId) ||
    selectedBookingType?.packages[0];

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Golden Hour / Sunset');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [message, setMessage] = useState(
    prefilledTitle ? `Inquiry regarding specific masterprint: "${prefilledTitle}"` : ''
  );

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consultationTime, setConsultationTime] = useState('');

  const consultationSlots = [
    'Tuesday, 10:00 AM EST',
    'Tuesday, 2:30 PM EST',
    'Wednesday, 11:30 AM EST',
    'Thursday, 4:00 PM EST',
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send real-time SMS confirmation if phone provided
      if (phone) {
        await sendManualSMS(
          phone,
          name,
          `Hello ${name}, your reservation request for "${selectedBookingType?.name} - ${selectedPackage?.name}" has been logged with Creative KG. We will contact you within 24 hours.`
        );
      }
    } catch (err) {
      console.error('SMS notification error:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onClearPrefills) onClearPrefills();
    }, 1200);
  };

  return (
    <div id="booking-page" className="space-y-16 py-12">
      {/* Visual Header Banner */}
      <section className="relative rounded-2xl border border-neutral-900 bg-gradient-to-b from-amber-500/10 via-neutral-950 to-transparent p-8 md:p-14 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-theme-primary font-semibold bg-theme-primary/10 border border-theme-primary/20 px-3.5 py-1.5 rounded-full inline-block">
            Online Booking & Private Reservations
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Reserve Your Session
          </h1>
          <p className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Creative KG accepts a curated volume of bespoke weddings of distinction, milestone birthday celebrations, exclusive VIP galas, and fine art portraits annually. Select your experience and custom package below to lock in your date.
          </p>
        </div>
      </section>

      {/* Main Interactive Booking Stage */}
      <section className="max-w-5xl mx-auto px-6">
        {isSuccess ? (
          /* Submission Success State */
          <motion.div
            id="booking-success-frame"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900/40 border border-neutral-850 rounded-2xl p-8 md:p-14 text-center space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Reservation Request Received!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. We have logged your request for{' '}
                <span className="text-theme-primary font-semibold">
                  {selectedBookingType?.name} ({selectedPackage?.name})
                </span>{' '}
                on <strong>{date || 'your requested date'}</strong>. Our production director will review specifications and confirm schedule within 24 hours.
              </p>
            </div>

            {/* Reserved Details Summary Card */}
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl max-w-xl mx-auto text-left space-y-3">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                Reservation Summary
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Experience Type:</span>
                <span className="text-white font-semibold">{selectedBookingType?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Package Tier:</span>
                <span className="text-amber-400 font-semibold">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Estimated Investment:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${selectedPackage?.price.toLocaleString()} USD
                </span>
              </div>
              {date && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Target Date:</span>
                  <span className="text-white font-semibold">{date} ({timeSlot})</span>
                </div>
              )}
            </div>

            {/* Virtual Consultation Scheduler Card */}
            <div className="bg-neutral-950 border border-neutral-850 p-6 md:p-8 rounded-xl max-w-xl mx-auto space-y-5 text-left">
              <div className="flex items-center space-x-2 text-neutral-200">
                <PhoneCall className="w-4 h-4 text-theme-primary" />
                <span className="font-sans font-semibold text-sm">
                  Lock in an Introductory 15-Minute Consultation
                </span>
              </div>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                While our studio director verifies schedule and lighting logistics, choose a slot below to schedule a quick 1-on-1 virtual call with our creative lead.
              </p>

              {consultationTime ? (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center">
                  <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest block">
                    Consultation Locked In
                  </span>
                  <span className="font-sans text-xs text-white mt-1 block font-bold">
                    {consultationTime}
                  </span>
                  <span className="font-sans text-[11px] text-neutral-400 mt-1 block">
                    A calendar invitation has been dispatched to {email}.
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block">
                    Available Consult Windows:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {consultationSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setConsultationTime(slot)}
                        className="py-2.5 px-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500/50 hover:bg-neutral-850 transition-all font-sans text-xs text-left cursor-pointer"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setConsultationTime('');
                setName('');
                setEmail('');
                setPhone('');
                setInstagram('');
                setMessage('');
                setDate('');
              }}
              className="text-neutral-500 hover:text-neutral-300 font-mono text-[10px] tracking-widest uppercase cursor-pointer"
            >
              Submit Another Reservation Request
            </button>
          </motion.div>
        ) : (
          /* Multi-Step Interactive Form */
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/30 border border-neutral-850 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-10 text-left"
          >
            {/* Step 1: Select Booking Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-theme-primary uppercase tracking-widest font-semibold">
                  01. Choose Your Experience
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {activeBookingTypes.length} Available Types
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {activeBookingTypes.map((bt) => {
                  const isSelected = selectedBookingTypeId === bt.id;
                  return (
                    <div
                      key={bt.id}
                      onClick={() => setSelectedBookingTypeId(bt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/40'
                          : 'border-neutral-850 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-amber-500 text-neutral-950 font-bold'
                                : 'bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            {bt.badge || 'Curated'}
                          </span>
                          <span className="font-mono text-xs font-bold text-neutral-300">
                            From ${bt.startingPrice.toLocaleString()}
                          </span>
                        </div>

                        <h3 className="font-sans font-bold text-sm text-white pt-1">
                          {bt.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                          {bt.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-neutral-900">
                        <span className="text-neutral-500">
                          {bt.packages.length} Package Options
                        </span>
                        <span className={isSelected ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                          {isSelected ? 'Selected ✓' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Package Tier */}
            {selectedBookingType && selectedBookingType.packages.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-neutral-850">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-theme-primary uppercase tracking-widest font-semibold">
                      02. Select Package Tier
                    </span>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Tailored packages for {selectedBookingType.name}.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedBookingType.packages.map((pkg) => {
                    const isSelected = (selectedPackage?.id || '') === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                          isSelected
                            ? 'border-amber-500 bg-neutral-900 shadow-2xl ring-2 ring-amber-500/30'
                            : 'border-neutral-850 bg-neutral-950/60 hover:border-neutral-750'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-sans font-bold text-sm text-white">
                                {pkg.name}
                              </h4>
                              <span className="font-mono font-bold text-lg text-theme-primary block mt-1">
                                ${pkg.price.toLocaleString()} USD
                              </span>
                            </div>

                            {pkg.isPopular && (
                              <span className="font-mono text-[8px] uppercase tracking-wider bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded-full">
                                Signature
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400">
                            <Clock className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0" />
                            <span>{pkg.duration}</span>
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {pkg.description}
                          </p>

                          {/* Deliverables */}
                          <div className="space-y-1.5 pt-2 border-t border-neutral-850">
                            {pkg.deliverables.map((d, dIdx) => (
                              <div
                                key={dIdx}
                                className="flex items-start space-x-2 text-[11px] text-neutral-300"
                              >
                                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-850">
                          <div
                            className={`w-full py-2 rounded-lg text-xs font-mono font-bold uppercase text-center transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {isSelected ? 'Selected Tier ✓' : 'Select Tier'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Date & Preferred Time */}
            <div className="space-y-4 pt-4 border-t border-neutral-850">
              <span className="font-mono text-xs text-theme-primary uppercase tracking-widest font-semibold block">
                03. Proposed Date & Timing
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Event / Shoot Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Golden Hour / Sunset">Golden Hour / Sunset Light</option>
                    <option value="Morning Natural Light">Morning Natural Light (09:00 - 12:00)</option>
                    <option value="Afternoon Studio">Afternoon Studio (13:00 - 16:00)</option>
                    <option value="Full Day Event">Full Day Celebration / Wedding</option>
                    <option value="Evening Gala / Reception">Evening Gala / Reception (18:00+)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Client Contact Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-850">
              <span className="font-mono text-xs text-theme-primary uppercase tracking-widest font-semibold block">
                04. Contact & Guest Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Victoria Sterling"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="victoria@sterling.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (212) 555-0198"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="text-neutral-500 absolute left-3 top-3 text-xs font-mono">
                      @
                    </span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="victoriasterling"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Visual Narrative & Context */}
            <div className="space-y-4 pt-4 border-t border-neutral-850">
              <span className="font-mono text-xs text-theme-primary uppercase tracking-widest font-semibold block">
                05. Visual Narrative & Event Vision
              </span>

              <div className="relative">
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your desired mood, venue, wardrobe, guest count, or creative references you envision..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Real-time Estimated Investment Summary Pill */}
            {selectedPackage && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Sparkles className="w-5 h-5 text-theme-primary" />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-xs text-white block">
                      {selectedBookingType?.name} • {selectedPackage.name}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {selectedPackage.duration} • {selectedPackage.deliverables.length} Deliverables Included
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Estimated Investment
                  </span>
                  <span className="font-mono font-bold text-base sm:text-lg text-theme-primary">
                    ${selectedPackage.price.toLocaleString()} USD
                  </span>
                </div>
              </div>
            )}

            {/* Submit Reservation Request Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="booking-submit-btn"
                disabled={isSubmitting}
                className="w-full btn-theme-primary font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all focus:outline-none shadow-2xl cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Logging Reservation Request...' : 'Reserve Your Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-neutral-500 text-center block mt-3 font-mono">
                Encrypted with TLS 256-bit protocol. No payment is charged today until schedule verification.
              </span>
            </div>
          </form>
        )}
      </section>

      {/* Alternative Social Touchpoint */}
      <section className="max-w-4xl mx-auto px-6 border-t border-neutral-900 pt-12 text-center space-y-4">
        <h3 className="font-sans font-medium text-sm text-neutral-300">Prefer Direct Channels?</h3>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          You can also reach our creative studio team directly via telephone or email regarding urgent editorial press assignments.
        </p>
        <div className="flex justify-center space-x-6 text-neutral-400 font-mono text-[10px] uppercase">
          <a href="#ig" className="hover:text-amber-500 transition-colors flex items-center">
            <Instagram className="w-4 h-4 mr-1 text-amber-500/80" />
            @creativekg
          </a>
          <span>/</span>
          <span>studio@creativekg.com</span>
          <span>/</span>
          <span>+1 (212) 555-0198</span>
        </div>
      </section>
    </div>
  );
}
