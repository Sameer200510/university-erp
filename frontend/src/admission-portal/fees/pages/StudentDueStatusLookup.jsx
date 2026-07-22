import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FileText,
  UserCheck,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import adminFeesService from "../../../admin-portal/fees/services/adminFees.service";
import { toast } from "sonner";

export default function StudentDueStatusLookup() {
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PAID_CLEAR | PENDING_DUE

  const fetchStatusData = async () => {
    try {
      setLoading(true);
      const data = await adminFeesService.getDashboard();
      setDefaulters(data.defaulters || []);
    } catch (err) {
      console.error("Failed to fetch student fee verification data:", err);
      toast.error("Failed to load fee verification status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  const filteredList = defaulters.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      !query ||
      item.studentName?.toLowerCase().includes(query) ||
      item.enrollmentNo?.toLowerCase().includes(query) ||
      item.course?.toLowerCase().includes(query) ||
      item.invoiceNumber?.toLowerCase().includes(query);

    const isPaidClear = (item.pendingAmount || 0) <= 0 || item.status === "PAID";
    if (statusFilter === "PAID_CLEAR" && !isPaidClear) return false;
    if (statusFilter === "PENDING_DUE" && isPaidClear) return false;

    return matchQuery;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-card to-card/60 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <UserCheck className="h-4 w-4" />
            Admission Desk Verification
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Student Fee Due Verification
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Quickly verify whether a student's semester tuition and admission dues are cleared or pending.
          </p>
        </div>

        <button
          onClick={fetchStatusData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-all shadow-sm border border-border shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </button>
      </div>

      {/* Quick Verification Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-2xl">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Cleared Students</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
              {defaulters.filter((d) => (d.pendingAmount || 0) <= 0 || d.status === "PAID").length}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Ready for Enrollment / Admit Card</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-2xl">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Pending / Overdue Dues</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
              {defaulters.filter((d) => (d.pendingAmount || 0) > 0 && d.status !== "PAID").length}
            </h3>
            <p className="text-xs text-rose-600 font-medium mt-1">Requires Fee Clearance</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Total Invoices Checked</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-0.5">{defaulters.length}</h3>
            <p className="text-xs text-muted-foreground mt-1">Academic Session 2026</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Student Name, Enrollment No, Course, or Invoice ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
            <span className="text-xs font-semibold text-muted-foreground uppercase mr-1 shrink-0">Status:</span>
            {[
              { label: "All Records", value: "ALL" },
              { label: "✔ Due Paid Clear", value: "PAID_CLEAR" },
              { label: "❌ Pending Dues", value: "PENDING_DUE" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setStatusFilter(btn.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === btn.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification List Table */}
        <div className="border border-border rounded-xl overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student & Enrollment</th>
                  <th className="py-3.5 px-4">Course & Batch</th>
                  <th className="py-3.5 px-4">Semester / Invoice</th>
                  <th className="py-3.5 px-4">Net Fee</th>
                  <th className="py-3.5 px-4">Pending Due</th>
                  <th className="py-3.5 px-4 text-center">Due Verification Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                      Loading verification records...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No student records match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                    const isCleared = (item.pendingAmount || 0) <= 0 || item.status === "PAID";
                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4 font-medium text-foreground">
                          <div className="font-semibold">{item.studentName || "Unknown Student"}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Roll: <span className="font-mono">{item.enrollmentNo || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium">{item.course || "General"}</span>
                          <div className="text-xs text-muted-foreground mt-0.5">Batch: {item.batch || "N/A"}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">
                          <div className="font-semibold text-foreground">Sem {item.semester || 1}</div>
                          <div className="text-muted-foreground">{item.invoiceNumber || item.id?.slice(0, 8)}</div>
                        </td>
                        <td className="py-4 px-4 font-medium">₹{(item.totalAmount || 0).toLocaleString()}</td>
                        <td className="py-4 px-4 font-bold">
                          {isCleared ? (
                            <span className="text-emerald-600">₹0</span>
                          ) : (
                            <span className="text-rose-600">₹{(item.pendingAmount || 0).toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isCleared ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              PAID & CLEARED
                            </span>
                          ) : item.status === "PARTIAL" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <Clock className="h-3.5 w-3.5" />
                              PARTIAL PAID
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              <AlertCircle className="h-3.5 w-3.5" />
                              PENDING DUE
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              toast.info(
                                `Student ${item.studentName} fee standing verified. Current Pending: ₹${item.pendingAmount || 0}`
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            Verify Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
