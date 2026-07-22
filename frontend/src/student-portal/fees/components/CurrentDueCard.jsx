import React, { useState } from "react";
import { toast } from "sonner";
import { CreditCard, CheckCircle, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { feesService } from "../services/fees.service";

function CurrentDueCard({ currentDue, onPaymentSuccess }) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("ONLINE_UPI");
  const [paying, setPaying] = useState(false);

  if (!currentDue) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center py-10 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-3">
          🎉
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Pending Semester Dues</h2>
        <p className="text-xs text-slate-500 mt-1">Your academic virtual fee ledger is cleared up to date.</p>
      </div>
    );
  }

  async function handleConfirmPayment(e) {
    e.preventDefault();
    try {
      setPaying(true);
      const res = await feesService.payOnline({
        invoiceId: currentDue.id,
        amount: currentDue.amount,
        paymentMode,
        gatewayTxnId: `GATEWAY_${paymentMode}_${Date.now()}`,
      });
      toast.success(`Payment successful! Receipt: ${res.receiptNumber}`);
      setShowPayModal(false);
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment transaction failed");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Semester {currentDue.semester} Invoice
          </span>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
            {currentDue.status}
          </span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mt-3">{currentDue.invoiceNo || "Current Due Fee"}</h2>
        <p className="text-xs text-slate-500 mt-0.5">Please clear your dues by the deadline to avoid late payment penalty.</p>

        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Pending Payable:</span>
            <span className="text-2xl font-black text-rose-600">₹{currentDue.amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Payment Deadline:</span>
            <span className="font-bold text-slate-900">{new Date(currentDue.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowPayModal(true)}
        className="mt-6 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm relative z-10"
      >
        <Zap className="h-4 w-4 fill-white" />
        Pay Online via Gateway
      </button>

      {/* Online Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">University Payment Gateway</h3>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Payable Amount</span>
                <p className="text-3xl font-black text-indigo-600 mt-1">₹{currentDue.amount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-1">Instant computerized receipt & GL reconciliation</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition">
                    <input
                      type="radio"
                      name="mode"
                      value="ONLINE_UPI"
                      checked={paymentMode === "ONLINE_UPI"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">UPI Instant Pay (GPay / PhonePe / Paytm)</span>
                      <span className="text-xs text-slate-400">Zero transaction charges • Instant clear</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition">
                    <input
                      type="radio"
                      name="mode"
                      value="ONLINE_RAZORPAY"
                      checked={paymentMode === "ONLINE_RAZORPAY"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">Credit / Debit Card & Netbanking</span>
                      <span className="text-xs text-slate-400">Secured via 256-bit SSL encryption</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Your transaction is secured and directly reconciled with your university enrollment account.</span>
              </div>

              <button
                type="submit"
                disabled={paying}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Secure Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Confirm Payment of ₹{currentDue.amount.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentDueCard;
