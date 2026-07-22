import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, TrendingDown, TrendingUp, RefreshCw, ShieldCheck } from "lucide-react";
import { feesService } from "../services/fees.service";

export default function StudentLedgerPage() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLedger();
  }, []);

  async function loadLedger() {
    try {
      setLoading(true);
      const data = await feesService.getStudentLedger();
      setLedger(data);
    } catch (error) {
      toast.error("Failed to load your ledger statement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-2xl shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
            <FileText className="h-4 w-4" />
            <span>Double-Entry Student Virtual Ledger</span>
          </div>
          <h1 className="text-3xl font-black mt-1">My Financial Ledger Statement</h1>
          <p className="text-slate-300 text-sm mt-1">
            Complete itemized record of all semester fee debits, penalty fines, fee waivers, and cleared credits.
          </p>
        </div>

        <button
          onClick={loadLedger}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white self-start md:self-center"
          title="Refresh Statement"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Virtual Ledger Account History</h2>
            <p className="text-xs text-slate-500">Real-time sync with university General Ledger</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Official Reconciled Statement
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : ledger.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            No ledger transactions posted to your account yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Posting Date</th>
                  <th className="py-4 px-6">Transaction Description</th>
                  <th className="py-4 px-6">Reference Type</th>
                  <th className="py-4 px-6 text-right">Debit (Charge)</th>
                  <th className="py-4 px-6 text-right">Credit (Paid)</th>
                  <th className="py-4 px-6 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {ledger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {new Date(item.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {item.description}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs bg-slate-100 font-bold px-2.5 py-1 rounded">
                        {item.referenceType || "ENTRY"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-rose-600">
                      {item.type === "DEBIT" ? `₹${item.amount.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-emerald-600">
                      {item.type === "CREDIT" ? `₹${item.amount.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900">
                      ₹{item.balanceAfter.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
