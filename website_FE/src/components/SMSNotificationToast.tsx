import { MessageSquare, X, CheckCircle, Smartphone, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';

export default function SMSNotificationToast() {
  const { lastSmsAlert, dismissSmsAlert } = useAdmin();

  if (!lastSmsAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[200] max-w-md w-full bg-neutral-900/95 border border-amber-500/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-amber-950/80 to-neutral-900 border-b border-amber-500/20 text-xs">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-amber-500/20 rounded-lg text-amber-400">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold tracking-wider text-amber-400 uppercase text-[10px]">
              Arkesel SMS Gateway Alert
            </span>
          </div>
          <button
            onClick={dismissSmsAlert}
            className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-neutral-300">
              <Send className="w-3 h-3 text-amber-400" />
              <span>To: <strong className="text-white">{lastSmsAlert.recipientName}</strong> ({lastSmsAlert.recipientPhone})</span>
            </div>
            <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" />
              <span>{lastSmsAlert.status === 'sent' ? 'Delivered' : 'Simulated SMS'}</span>
            </span>
          </div>

          {/* Realistic SMS Chat Bubble */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-200 leading-relaxed font-sans relative">
            <div className="text-[10px] font-mono text-amber-500/80 mb-1 flex items-center justify-between">
              <span>SENDER: {lastSmsAlert.senderId}</span>
              <span>{new Date(lastSmsAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="whitespace-pre-wrap">{lastSmsAlert.message}</p>
          </div>
        </div>

        {/* Footer auto-close note */}
        <div className="px-4 py-1.5 bg-neutral-950/60 border-t border-neutral-850 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span>Carrier: Arkesel SMS Networks</span>
          <button
            onClick={dismissSmsAlert}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
