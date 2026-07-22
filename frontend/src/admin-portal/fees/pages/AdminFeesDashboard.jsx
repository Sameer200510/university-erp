import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Bell, 
  Clock, 
  Search, 
  CheckCircle, 
  RefreshCw,
  FileText
} from "lucide-react";
import { adminFeesService } from "../services/adminFees.service";

export default function AdminFeesDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await adminFeesService.getDashboard();
      setMetrics(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load financial dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyLateFees() {
    try {
      setActionLoading(true);
      const res = await adminFeesService.applyLateFees();
      toast.success(res.message || `Applied late fee to ${res.appliedCount} overdue invoices!`);
      loadDashboard();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply late fees");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendReminders() {
    try {
      setActionLoading(true);
      const res = await adminFeesService.sendReminders();
      toast.success(`Sent dunning alerts to ${res.remindersSent} students successfully!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send reminders");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600 font-semibold text-lg animate-pulse">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading Real-time Accounting & Collection Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard metrics.</div>;
  }

  const filteredDefaulters = metrics.defaulters.filter((d) =>
    d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-2xl shadow-xl text-white gap-6 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              Live Financial Engine
            </span>
            <span className="text-slate-400 text-sm">Automated Fee Matrix & GL</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">
            University Financial Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time fee collections, head-wise revenue recognition, and automated dunning control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleApplyLateFees}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg transition duration-200 text-sm"
          >
            <Clock className="h-4 w-4" />
            Apply Late Penalties
          </button>
          <button
            onClick={handleSendReminders}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition duration-200 text-sm"
          >
            <Bell className="h-4 w-4" />
            Trigger Dunning Reminders
          </button>
          <button
            onClick={loadDashboard}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white"
            title="Refresh Metrics"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Primary Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Collection
            </span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">
              ₹{metrics.todayCollection.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Direct GL Cash & Bank inflow
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Fee Revenue
            </span>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">
              ₹{metrics.totalCollection.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1.5">
              Cumulative recognized payments
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">
              ₹{metrics.totalOutstanding.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-amber-600 font-semibold mt-1.5">
              Pending across {metrics.defaultersCount} invoices
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Defaulters / Overdue
            </span>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">
              {metrics.defaultersCount}
            </h3>
            <p className="text-xs text-rose-600 font-semibold mt-1.5">
              Requiring dunning action
            </p>
          </div>
        </div>
      </div>

      {/* Head-Wise Revenue Breakdown & Payment Mode Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-indigo-600" />
            Fee Head-Wise Collection Breakdown
          </h2>
          <div className="space-y-4">
            {Object.keys(metrics.headWiseRevenue || {}).length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No head-wise collections recorded yet.</p>
            ) : (
              Object.entries(metrics.headWiseRevenue).map(([headName, amount]) => {
                const total = metrics.totalCollection || 1;
                const percentage = Math.min(100, Math.round((amount / total) * 100));
                return (
                  <div key={headName} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold text-slate-800">
                      <span>{headName}</span>
                      <span className="font-bold text-indigo-600">₹{amount.toLocaleString("en-IN")} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Omnichannel Mode Breakdown</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-600 uppercase">Online (UPI/Card/Gateway)</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    ₹{(metrics.modeBreakdown?.ONLINE || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase">Counter Cash Collection</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    ₹{(metrics.modeBreakdown?.CASH || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  💵
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase">Cheque & Demand Draft</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    ₹{(metrics.modeBreakdown?.CHEQUE_DD || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  🏦
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">Double entry reconciliations synced to GL</p>
          </div>
        </div>
      </div>

      {/* Defaulters & Overdue Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pending Invoices & Defaulters Roster</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monitor pending semester dues and enforce dunning restrictions.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student, invoice, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Invoice & Student</th>
                <th className="py-4 px-6">Course & Semester</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Net Amount</th>
                <th className="py-4 px-6">Pending Dues</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No pending dues or matching defaulters found.
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map((d) => (
                  <tr key={d.invoiceId} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{d.studentName}</div>
                      <div className="text-xs text-indigo-600 font-semibold">{d.invoiceNo}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-medium">{d.course}</div>
                      <div className="text-xs text-slate-500">Sem {d.semester} • {d.batch}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        d.isOverdue ? "bg-rose-100 text-rose-700 font-bold" : "bg-slate-100 text-slate-700"
                      }`}>
                        {new Date(d.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      ₹{d.netAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 font-bold text-rose-600">
                      ₹{d.pendingAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        d.status === "OVERDUE" || d.isOverdue
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : d.status === "PARTIAL"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}>
                        {d.isOverdue && d.status !== "OVERDUE" ? "OVERDUE" : d.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={handleSendReminders}
                        className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition"
                      >
                        Notify SMS/Mail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
