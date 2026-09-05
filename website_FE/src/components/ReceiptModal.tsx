import { X, Printer, Download, CheckCircle, Smartphone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import Logo from './Logo';

export default function ReceiptModal() {
  const {
    showReceiptModal,
    closeReceiptModal,
    selectedReceiptClient: client,
    selectedReceiptPayment: payment,
    systemSettings,
  } = useAdmin();

  if (!showReceiptModal || !client || !payment) return null;

  const totalPaidAllTime = client.payments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = Math.max(0, client.packagePrice - totalPaidAllTime);
  const isFullyPaid = remainingBalance === 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-white my-8 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-neutral-900"
        >
          {/* Header Action Bar (Hidden on print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70 print:hidden">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-mono uppercase font-bold tracking-wider text-amber-400">
                Official Payment Receipt
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition-all cursor-pointer"
                title="Print or Save PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={closeReceiptModal}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Body */}
          <div id="printable-receipt" className="p-8 space-y-6 bg-neutral-900 print:bg-white print:text-neutral-950">
            {/* Top Studio Brand & Receipt Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 print:border-neutral-300">
              <div className="space-y-1">
                <Logo size="md" />
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-sans">
                  {systemSettings.studioName}
                </p>
                <p className="text-[11px] text-neutral-500 print:text-neutral-500 font-mono">
                  {systemSettings.studioAddress} • {systemSettings.studioPhone}
                </p>
                <p className="text-[11px] text-neutral-500 print:text-neutral-500 font-mono">
                  {systemSettings.studioEmail}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span
                  className={`inline-block font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                    isFullyPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:bg-emerald-50 print:text-emerald-800'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 print:bg-amber-50 print:text-amber-800'
                  }`}
                >
                  {isFullyPaid ? 'Paid In Full' : 'Partial Deposit'}
                </span>
                <h3 className="font-mono text-sm font-bold text-white print:text-neutral-900 pt-1">
                  {payment.receiptNumber}
                </h3>
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-mono">
                  Date: {new Date(payment.paidAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Billed To Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 print:bg-neutral-50 print:border-neutral-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Billed To Client
                </span>
                <h4 className="text-sm font-bold text-white print:text-neutral-900">{client.name}</h4>
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-mono">{client.phone}</p>
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-sans">{client.email}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Session & Event Details
                </span>
                <h4 className="text-sm font-semibold text-amber-400 print:text-amber-800">{client.shootTitle}</h4>
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-sans">
                  Type: <span className="capitalize">{client.shootType} Session</span>
                </p>
                <p className="text-xs text-neutral-400 print:text-neutral-600 font-mono">
                  Event Date: {client.eventDate}
                </p>
              </div>
            </div>

            {/* Itemized Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 print:border-neutral-300 font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-600">
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-center">Payment Method</th>
                    <th className="pb-3 text-center">Reference</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 print:divide-neutral-200 font-sans">
                  <tr>
                    <td className="py-3">
                      <div className="font-semibold text-white print:text-neutral-900">
                        {client.shootTitle} Photography Package
                      </div>
                      <div className="text-[11px] text-neutral-400 print:text-neutral-500">
                        High-resolution proofing and delivery
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono capitalize">
                      {payment.method === 'mobile_money'
                        ? `MoMo (${payment.networkProvider || 'Paystack'})`
                        : payment.method.replace('_', ' ')}
                    </td>
                    <td className="py-3 text-center font-mono text-[10px] text-neutral-400 print:text-neutral-600">
                      {payment.transactionReference}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400 print:text-emerald-800">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-neutral-800 print:border-neutral-300 flex justify-end">
              <div className="w-full sm:w-64 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>Package Total:</span>
                  <span>{client.currency} {client.packagePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>This Transaction:</span>
                  <span className="text-emerald-400 print:text-emerald-800 font-bold">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>Total Paid to Date:</span>
                  <span>{client.currency} {totalPaidAllTime.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 print:border-neutral-300 font-bold text-sm text-white print:text-neutral-900">
                  <span>Remaining Balance:</span>
                  <span className={remainingBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {client.currency} {remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Footer Notes */}
            <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-850 print:bg-transparent print:border-neutral-200 text-[11px] text-neutral-400 print:text-neutral-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-neutral-300 print:text-neutral-800">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 print:text-amber-700" />
                <span>Payment Confirmation & Licensing</span>
              </div>
              <p>
                Thank you for your business. This receipt certifies valid licensing and unlocked delivery for high-resolution photography deliverables provided by {systemSettings.studioName}.
              </p>
              {payment.notes && (
                <p className="italic text-neutral-500 font-mono text-[10px] pt-1">
                  Note: {payment.notes}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
