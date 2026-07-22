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
import api from "../../../auth/services/auth.service";

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

  // Admission Reference Payment state & Receipt modal
  const [admissionPayForm, setAdmissionPayForm] = useState({
    referenceId: "",
    amount: "1500",
    paymentMode: "CASH",
    transactionRef: "",
  });
  const [admissionPayLoading, setAdmissionPayLoading] = useState(false);
  const [admissionReceipt, setAdmissionReceipt] = useState(null);

  const handleLookupAdmissionReceipt = async () => {
    if (!admissionPayForm.referenceId) {
      return toast.error("Please enter the Admission Reference_ID to lookup receipt");
    }
    try {
      setAdmissionPayLoading(true);
      const res = await api.get(`/leads/${admissionPayForm.referenceId}`);
      const lead = res.data.lead;
      if (!lead) return toast.error("No admission application found with this Reference_ID");
      if (!lead.payment || (lead.payment.status !== "PAID" && lead.payment.status !== "SUCCESS")) {
        return toast.error("Fee payment is still UNPAID for this Reference_ID. Please submit payment first.");
      }
      setAdmissionReceipt({
        lead,
        payment: lead.payment,
        receiptNo: `ADM-REC-${new Date().getFullYear()}-${lead.payment.id ? lead.payment.id.slice(0, 6).toUpperCase() : Math.floor(1000 + Math.random() * 9000)}`
      });
      toast.success("Existing fee receipt loaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to lookup admission receipt");
    } finally {
      setAdmissionPayLoading(false);
    }
  };

  const handleAdmissionPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!admissionPayForm.referenceId) {
      return toast.error("Please enter the Admission Reference_ID");
    }
    try {
      setAdmissionPayLoading(true);
      const res = await api.post("/leads/finance/process-payment", {
        referenceId: admissionPayForm.referenceId,
        amount: Number(admissionPayForm.amount) || 1500,
        paymentMode: admissionPayForm.paymentMode,
        transactionRef: admissionPayForm.transactionRef,
      });
      toast.success("Mandatory Fee marked PAID for Reference_ID: " + admissionPayForm.referenceId);
      if (res.data && res.data.lead && res.data.payment) {
        setAdmissionReceipt({
          lead: res.data.lead,
          payment: res.data.payment,
          receiptNo: `ADM-REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else {
        setAdmissionReceipt({
          lead: { id: admissionPayForm.referenceId, firstName: "Admission", lastName: "Applicant", email: "Verified at Counter", phone: "Verified", courseId: "Applied Program" },
          payment: { amount: Number(admissionPayForm.amount) || 1500, status: "PAID", paymentMode: admissionPayForm.paymentMode, transactionRef: admissionPayForm.transactionRef || "COUNTER-PAID", paidAt: new Date().toISOString() },
          receiptNo: `ADM-REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }
      setAdmissionPayForm({ referenceId: "", amount: "1500", paymentMode: "CASH", transactionRef: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to process admission fee payment");
    } finally {
      setAdmissionPayLoading(false);
    }
  };

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
            onClick={() => setActiveTab("admission_pay")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "admission_pay" ? "bg-indigo-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Admission Reference Pay
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

      {activeTab === "admission_pay" && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Admission Fee Payment Counter</h2>
              <p className="text-xs text-slate-500">Process mandatory application fee by Reference_ID before Admission Officer approval.</p>
            </div>
          </div>

          <form onSubmit={handleAdmissionPaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Student Reference_ID</label>
              <input
                type="text"
                placeholder="Enter 8-digit or full Reference_ID (e.g. c7438e...)"
                value={admissionPayForm.referenceId}
                onChange={(e) => setAdmissionPayForm({ ...admissionPayForm, referenceId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fee Amount (₹)</label>
                <input
                  type="number"
                  value={admissionPayForm.amount}
                  onChange={(e) => setAdmissionPayForm({ ...admissionPayForm, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Payment Mode</label>
                <select
                  value={admissionPayForm.paymentMode}
                  onChange={(e) => setAdmissionPayForm({ ...admissionPayForm, paymentMode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CASH">Cash at Counter</option>
                  <option value="CARD">POS / Debit / Credit Card</option>
                  <option value="UPI">UPI / QR Code Scan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Transaction Ref / Receipt No (Optional)</label>
              <input
                type="text"
                placeholder="e.g. TXN-9823471 or Receipt No"
                value={admissionPayForm.transactionRef}
                onChange={(e) => setAdmissionPayForm({ ...admissionPayForm, transactionRef: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={admissionPayLoading}
                className="flex-1 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                {admissionPayLoading ? "Processing Fee..." : "Submit Fee Payment & Print Receipt"}
              </button>
              <button
                type="button"
                onClick={handleLookupAdmissionReceipt}
                disabled={admissionPayLoading || !admissionPayForm.referenceId}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all flex items-center justify-center gap-2 border border-slate-300 disabled:opacity-50"
              >
                <Printer className="h-5 w-5 text-indigo-600" />
                Lookup & Reprint Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Admission Fee Computerized Receipt Modal */}
      {admissionReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #admission-official-receipt, #admission-official-receipt * {
                visibility: visible !important;
              }
              #admission-official-receipt {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 30px !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
              }
              .print-hide-btn {
                display: none !important;
              }
            }
          `}</style>

          <div
            id="admission-official-receipt"
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-8 space-y-6 relative max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible"
          >
            {/* Action buttons (hidden in print) */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 print-hide-btn sticky top-0 bg-white z-10">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Official Computerized Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow transition"
                >
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setAdmissionReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* University Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">GRAPHIC ERA (DEEMED TO BE UNIVERSITY)</h1>
              <p className="text-xs font-semibold text-slate-500">566/6, Bell Road, Clement Town, Dehradun, Uttarakhand - 248002</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded">
                  Admission Application Fee Receipt
                </span>
              </div>
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block uppercase font-bold">Receipt Number</span>
                <span className="font-mono font-black text-indigo-700 text-sm">{admissionReceipt.receiptNo}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase font-bold">Date & Time</span>
                <span className="font-bold text-slate-900">
                  {new Date(admissionReceipt.payment?.paidAt || Date.now()).toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold mt-2">Reference ID</span>
                <span className="font-mono font-extrabold text-slate-900">
                  {admissionReceipt.lead?.id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase font-bold mt-2">Payment Status</span>
                <span className="text-emerald-600 font-black tracking-wide">VERIFIED & PAID</span>
              </div>
            </div>

            {/* Applicant Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student & Application Particulars</h3>
              <div className="border rounded-xl divide-y divide-slate-100 text-sm">
                <div className="grid grid-cols-3 p-3 font-semibold">
                  <span className="text-slate-500">Applicant Name</span>
                  <span className="col-span-2 font-bold text-slate-900">
                    {admissionReceipt.lead?.firstName} {admissionReceipt.lead?.lastName}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3 font-semibold">
                  <span className="text-slate-500">Contact Email</span>
                  <span className="col-span-2 text-slate-800">{admissionReceipt.lead?.email}</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-semibold">
                  <span className="text-slate-500">Contact Phone</span>
                  <span className="col-span-2 text-slate-800">{admissionReceipt.lead?.phone}</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-semibold bg-slate-50">
                  <span className="text-slate-500">Program Applied</span>
                  <span className="col-span-2 font-black text-indigo-900">
                    {admissionReceipt.lead?.courseId || "B.Tech / Program Application"}
                  </span>
                </div>
              </div>
            </div>

            {/* Fee Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Summary</h3>
              <div className="border rounded-xl overflow-hidden text-sm">
                <div className="bg-slate-100 p-3 flex justify-between font-bold text-slate-700 text-xs uppercase">
                  <span>Description</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-4 flex justify-between font-bold text-slate-900 border-b">
                  <span>Mandatory University Application & Processing Fee</span>
                  <span className="font-extrabold">₹ {Number(admissionReceipt.payment?.amount || 1500).toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-emerald-50/50 p-4 flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-base">Total Amount Paid</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Mode: <strong className="text-slate-800">{admissionReceipt.payment?.paymentMode || "CASH"}</strong>
                      {admissionReceipt.payment?.transactionRef && ` | Ref: ${admissionReceipt.payment.transactionRef}`}
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-700">
                    ₹ {Number(admissionReceipt.payment?.amount || 1500).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer / Signatures */}
            <div className="pt-8 flex justify-between items-end border-t border-slate-100 text-xs font-semibold text-slate-500">
              <div>
                <p className="text-slate-400">Computer generated official receipt.</p>
                <p>Graphic Era ERP Admissions System</p>
              </div>
              <div className="text-center pr-4">
                <div className="w-40 border-b-2 border-slate-400 mb-1 pb-4"></div>
                <span className="font-bold text-slate-800">Authorized Cashier / Finance Officer</span>
                <p className="text-[10px] text-slate-400">Graphic Era Dehradun</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
