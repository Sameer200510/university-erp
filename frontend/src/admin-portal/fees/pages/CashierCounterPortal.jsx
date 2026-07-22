import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  DollarSign, 
  Search, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  Printer, 
  RefreshCw, 
  FileText,
  CreditCard,
  Banknote,
  ShieldAlert
} from "lucide-react";
import { adminFeesService } from "../services/adminFees.service";
import { feesService } from "../../../student-portal/fees/services/fees.service";

export default function CashierCounterPortal() {
  const [activeTab, setActiveTab] = useState("collection"); // 'collection' | 'bounce'
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Collection form
  const [payForm, setPayForm] = useState({
    amount: "",
    paymentMode: "OFFLINE_CASH",
    chequeOrDdNumber: "",
    bankName: "",
    chequeDate: new Date().toISOString().slice(0, 10),
  });
  const [collecting, setCollecting] = useState(false);

  // Cheque Bounce state
  const [bounceFine, setBounceFine] = useState(1000);
  const [bouncingId, setBouncingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await adminFeesService.getDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load cashier roster");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setPayForm({
      amount: inv.pendingAmount,
      paymentMode: "OFFLINE_CASH",
      chequeOrDdNumber: "",
      bankName: "",
      chequeDate: new Date().toISOString().slice(0, 10),
    });
  };

  async function handleCollectPayment(e) {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      setCollecting(true);
      const res = await adminFeesService.collectOfflinePayment({
        studentId: selectedInvoice.studentId,
        invoiceId: selectedInvoice.invoiceId,
        amount: Number(payForm.amount),
        paymentMode: payForm.paymentMode,
        chequeOrDdNumber: payForm.chequeOrDdNumber,
        bankName: payForm.bankName,
        chequeDate: payForm.chequeDate,
      });
      toast.success(`Payment recorded! Official Receipt Number: ${res.receiptNumber}`);
      setSelectedInvoice(null);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to record payment");
    } finally {
      setCollecting(false);
    }
  }

  async function handleMarkBounce(txnId) {
    if (!window.confirm("Are you sure you want to mark this cheque as BOUNCED? This will reverse student ledger credit and charge bounce penalty fine.")) return;
    try {
      setBouncingId(txnId);
      const res = await adminFeesService.markChequeBounce(txnId, bounceFine);
      toast.success(res.message || `Cheque bounce processed. Fine of ₹${res.fineAmount} added.`);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error processing cheque bounce");
    } finally {
      setBouncingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!dashboard) {
    return <div className="p-8 text-center text-red-500">Failed to load counter portal data.</div>;
  }

  const filteredInvoices = dashboard.defaulters.filter((d) =>
    d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-indigo-950 to-slate-900 p-8 rounded-2xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <Banknote className="h-4 w-4" />
            <span>Official University Cashier Counter</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-1">Omnichannel Fee Collection & Counter Portal</h1>
          <p className="text-slate-300 text-sm mt-1">
            Record counter cash/cheque settlements, print computerized receipts, and enforce cheque dishonor fines.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/10 backdrop-blur">
          <button
            onClick={() => setActiveTab("collection")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "collection" ? "bg-emerald-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Counter Collection
          </button>
          <button
            onClick={() => setActiveTab("bounce")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "bounce" ? "bg-rose-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Cheque Bounce Studio
          </button>
        </div>
      </div>

      {activeTab === "collection" ? (
        /* ================= TAB 1: COUNTER COLLECTION ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roster & Search List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pending Student Dues Lookup</h2>
                <p className="text-xs text-slate-500">Select an invoice below to process counter payment.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredInvoices.length === 0 ? (
                <p className="text-sm text-slate-400 py-12 text-center">No matching pending dues found.</p>
              ) : (
                filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoice?.invoiceId === inv.invoiceId;
                  return (
                    <div
                      key={inv.invoiceId}
                      onClick={() => handleSelectInvoice(inv)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                          : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{inv.studentName}</span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {inv.invoiceNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {inv.course} • Sem {inv.semester} ({inv.batch}) • Due: {new Date(inv.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Pending Dues</span>
                          <p className="text-lg font-black text-rose-600">₹{inv.pendingAmount.toLocaleString("en-IN")}</p>
                        </div>
                        <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg shadow">
                          Select
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Payment Collection Form Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Payment Settlement Desk
              </h2>

              {!selectedInvoice ? (
                <div className="py-24 text-center space-y-3">
                  <DollarSign className="h-12 w-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">No Student Selected</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click on any student invoice from the left roster to populate the counter payment settlement desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCollectPayment} className="space-y-4 mt-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Settling For</span>
                    <p className="font-bold text-slate-900 text-base">{selectedInvoice.studentName}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{selectedInvoice.invoiceNo}</p>
                    <div className="flex justify-between text-xs pt-2 font-bold text-slate-700">
                      <span>Total Invoice: ₹{selectedInvoice.netAmount.toLocaleString("en-IN")}</span>
                      <span className="text-rose-600">Pending: ₹{selectedInvoice.pendingAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Collection Mode</label>
                    <select
                      value={payForm.paymentMode}
                      onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-bold text-sm bg-slate-50"
                    >
                      <option value="OFFLINE_CASH">Cash Settlement (Counter Cash)</option>
                      <option value="OFFLINE_CHEQUE">Bank Cheque</option>
                      <option value="OFFLINE_DD">Demand Draft (DD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Amount (₹)</label>
                    <input
                      type="number"
                      required
                      max={selectedInvoice.pendingAmount}
                      value={payForm.amount}
                      onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-extrabold text-lg text-emerald-700 bg-emerald-50/50"
                    />
                  </div>

                  {payForm.paymentMode !== "OFFLINE_CASH" && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cheque / DD Number</label>
                        <input
                          type="text"
                          required
                          value={payForm.chequeOrDdNumber}
                          onChange={(e) => setPayForm({ ...payForm, chequeOrDdNumber: e.target.value })}
                          className="w-full p-2 border rounded-xl text-sm font-semibold"
                          placeholder="e.g. 489201"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Bank Name</label>
                        <input
                          type="text"
                          required
                          value={payForm.bankName}
                          onChange={(e) => setPayForm({ ...payForm, bankName: e.target.value })}
                          className="w-full p-2 border rounded-xl text-sm font-semibold"
                          placeholder="e.g. State Bank of India / HDFC"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={collecting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {collecting ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    Record Payment & Print Receipt
                  </button>
                </form>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
              Receipt generated instantly upon confirmation
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAB 2: CHEQUE BOUNCE STUDIO ================= */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                Cheque Dishonor / Bounce Penalty Studio
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mark dishonored bank cheques to automatically reverse student ledger credits and charge penalty charges.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-2 rounded-xl">
              <span className="text-xs font-bold text-rose-700 pl-2">Bounce Fine Amount (₹):</span>
              <input
                type="number"
                value={bounceFine}
                onChange={(e) => setBounceFine(Number(e.target.value))}
                className="w-24 p-1.5 border rounded-lg font-bold text-sm text-center bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Transaction Ref</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Payment Mode</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {dashboard.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No recent transactions recorded.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{t.transactionNo}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{t.studentName}</td>
                      <td className="py-4 px-6">
                        <span className="text-xs bg-slate-100 font-bold px-2.5 py-1 rounded">
                          {t.paymentMode}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{t.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {new Date(t.paidAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                          t.status === "BOUNCED"
                            ? "bg-rose-100 text-rose-700"
                            : t.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {t.status === "SUCCESS" && (
                          <button
                            onClick={() => handleMarkBounce(t.id)}
                            disabled={bouncingId === t.id}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm disabled:opacity-50"
                          >
                            {bouncingId === t.id ? "Processing..." : "Mark Cheque Bounce"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
