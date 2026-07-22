import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Settings, 
  Layers, 
  FileCheck, 
  Plus, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { adminFeesService } from "../services/adminFees.service";

export default function FeeMatrixBillingStudio() {
  const [activeTab, setActiveTab] = useState("matrix"); // 'heads' | 'matrix' | 'batch'
  const [loading, setLoading] = useState(true);
  const [heads, setHeads] = useState([]);
  const [matrixRules, setMatrixRules] = useState([]);

  // Filters for Matrix
  const [courseFilter, setCourseFilter] = useState("B.Tech CSE");
  const [batchFilter, setBatchFilter] = useState("2024-2028");
  const [quotaFilter, setQuotaFilter] = useState("MERIT");
  const [semesterFilter, setSemesterFilter] = useState(1);

  // New Head Modal/Form
  const [newHead, setNewHead] = useState({
    code: "",
    name: "",
    description: "",
    isRecurring: true,
    defaultAmount: "",
  });
  const [showHeadForm, setShowHeadForm] = useState(false);

  // Batch Invoicing state
  const [batchForm, setBatchForm] = useState({
    courseId: "B.Tech CSE",
    batch: "2024-2028",
    semester: 1,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  const [batchGenerating, setBatchGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "matrix") {
      loadMatrix();
    }
  }, [courseFilter, batchFilter, quotaFilter, semesterFilter, activeTab]);

  async function loadData() {
    try {
      setLoading(true);
      const headsData = await adminFeesService.getFeeHeads();
      setHeads(headsData);
      await loadMatrix();
    } catch (error) {
      toast.error("Failed to load fee configurations");
    } finally {
      setLoading(false);
    }
  }

  async function loadMatrix() {
    try {
      const data = await adminFeesService.getFeeMatrix({
        courseId: courseFilter,
        batch: batchFilter,
        quota: quotaFilter,
        semester: semesterFilter,
      });
      setMatrixRules(data);
    } catch (error) {
      toast.error("Failed to fetch matrix rules");
    }
  }

  async function handleCreateHead(e) {
    e.preventDefault();
    try {
      if (!newHead.code || !newHead.name) {
        toast.error("Please enter fee code and name");
        return;
      }
      await adminFeesService.createFeeHead(newHead);
      toast.success(`Fee Head '${newHead.name}' added successfully!`);
      setShowHeadForm(false);
      setNewHead({ code: "", name: "", description: "", isRecurring: true, defaultAmount: "" });
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating fee head");
    }
  }

  async function handleSaveMatrixRule(feeHeadId, amount) {
    try {
      await adminFeesService.saveFeeMatrixRule({
        courseId: courseFilter,
        batch: batchFilter,
        quota: quotaFilter,
        semester: semesterFilter,
        feeHeadId,
        amount: Number(amount),
      });
      toast.success("Matrix rule updated successfully!");
      loadMatrix();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update matrix rule");
    }
  }

  async function handleBatchGenerate(e) {
    e.preventDefault();
    try {
      setBatchGenerating(true);
      const res = await adminFeesService.generateSemesterInvoices(batchForm);
      toast.success(`Generated ${res.generatedCount} invoices and posted double-entry ledger statements successfully!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error during batch invoicing");
    } finally {
      setBatchGenerating(false);
    }
  }

  // Calculate total matrix amount for selected criteria
  const getAmountForHead = (headId) => {
    const rule = matrixRules.find((r) => r.feeHeadId === headId);
    if (rule) return rule.amount;
    const h = heads.find((head) => head.id === headId);
    return h ? h.defaultAmount : 0;
  };

  const totalCurrentMatrixAmount = heads.reduce((sum, h) => sum + getAmountForHead(h.id), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 rounded-2xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
            <Layers className="h-4 w-4" />
            <span>Rule-Based Fee Matrix & Billing Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-1">Fee Matrix & Semester Billing Studio</h1>
          <p className="text-slate-300 text-sm mt-1">
            Configure merit vs management quota fee structures and execute bulk automated semester invoicing.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/10 backdrop-blur">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "matrix" ? "bg-indigo-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Fee Matrix Rules
          </button>
          <button
            onClick={() => setActiveTab("heads")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "heads" ? "bg-indigo-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Fee Heads Master
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === "batch" ? "bg-indigo-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Batch Billing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : activeTab === "matrix" ? (
        /* ================= TAB 1: FEE MATRIX RULES ================= */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Criteria Selector Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Target Selection
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Course Program</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="B.Tech CSE">B.Tech Computer Science & Engineering</option>
                <option value="B.Tech ME">B.Tech Mechanical Engineering</option>
                <option value="MBA">Master of Business Administration (MBA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Academic Batch</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2024-2028">2024 - 2028 Batch</option>
                <option value="2026-2030">2026 - 2030 Batch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Admission Quota</label>
              <select
                value={quotaFilter}
                onChange={(e) => setQuotaFilter(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="MERIT">Merit Quota (Standard Academic Fee)</option>
                <option value="MANAGEMENT">Management Quota (Premium Tuition)</option>
                <option value="NRI">NRI / International Quota</option>
                <option value="SPORTS">Sports & Cultural Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Semester Number</label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600 uppercase">Total Target Semester Fee</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{totalCurrentMatrixAmount.toLocaleString("en-IN")}
              </p>
              <span className="text-xs text-slate-500">Auto-billed when invoices generate</span>
            </div>
          </div>

          {/* Fee Matrix Editor Main Area */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {courseFilter} • Sem {semesterFilter} ({quotaFilter} Quota)
                </h2>
                <p className="text-xs text-slate-500">
                  Update individual head charges below. Changes take effect on all future invoices generated for this criteria.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {heads.map((head) => {
                const currentVal = getAmountForHead(head.id);
                return (
                  <div
                    key={head.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{head.name}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {head.code}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          head.isRecurring ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {head.isRecurring ? "Recurring Semester" : "One-Time Charge"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{head.description || "No description provided."}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          defaultValue={currentVal}
                          onBlur={(e) => handleSaveMatrixRule(head.id, e.target.value)}
                          className="w-36 pl-7 pr-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Auto-saved on exit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeTab === "heads" ? (
        /* ================= TAB 2: FEE HEADS MASTER ================= */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fee Head Master Repository</h2>
              <p className="text-xs text-slate-500">Define modular charges (Tuition, Lab, Library, Late Penalty) used across matrix calculations.</p>
            </div>
            <button
              onClick={() => setShowHeadForm(!showHeadForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow"
            >
              <Plus className="h-4 w-4" />
              {showHeadForm ? "Cancel" : "Add New Fee Head"}
            </button>
          </div>

          {showHeadForm && (
            <form onSubmit={handleCreateHead} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Create New Fee Head</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Code (e.g. SPORTS_FEE)</label>
                  <input
                    type="text"
                    required
                    value={newHead.code}
                    onChange={(e) => setNewHead({ ...newHead, code: e.target.value })}
                    className="w-full p-2 border rounded-xl text-sm uppercase font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newHead.name}
                    onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
                    className="w-full p-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Default Base Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newHead.defaultAmount}
                    onChange={(e) => setNewHead({ ...newHead, defaultAmount: e.target.value })}
                    className="w-full p-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Charge Type</label>
                  <select
                    value={newHead.isRecurring}
                    onChange={(e) => setNewHead({ ...newHead, isRecurring: e.target.value === "true" })}
                    className="w-full p-2 border rounded-xl text-sm font-semibold"
                  >
                    <option value="true">Recurring Every Semester</option>
                    <option value="false">One-Time / Penalty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                <input
                  type="text"
                  value={newHead.description}
                  onChange={(e) => setNewHead({ ...newHead, description: e.target.value })}
                  className="w-full p-2 border rounded-xl text-sm"
                  placeholder="Optional details regarding what this charge covers..."
                />
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl text-sm shadow hover:bg-emerald-700 transition">
                Save Fee Head
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heads.map((h) => (
              <div key={h.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-sm transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-lg">{h.name}</span>
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {h.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{h.description || "General university fee charge."}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Default Rate</span>
                    <p className="text-lg font-black text-slate-900">₹{h.defaultAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded font-bold ${
                    h.isRecurring ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {h.isRecurring ? "Recurring" : "One-time"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= TAB 3: BATCH SEMESTER INVOICING ================= */
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Batch Semester Invoice & Ledger Generator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Automatically calculate dynamic fees from the matrix rules and generate official invoices for every student in the selected batch.
            </p>
          </div>

          <form onSubmit={handleBatchGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Program Course</label>
                <select
                  value={batchForm.courseId}
                  onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl font-semibold text-sm bg-slate-50"
                >
                  <option value="B.Tech CSE">B.Tech Computer Science & Engineering</option>
                  <option value="B.Tech ME">B.Tech Mechanical Engineering</option>
                  <option value="MBA">Master of Business Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Target Batch</label>
                <select
                  value={batchForm.batch}
                  onChange={(e) => setBatchForm({ ...batchForm, batch: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl font-semibold text-sm bg-slate-50"
                >
                  <option value="2024-2028">2024 - 2028 Batch</option>
                  <option value="2026-2030">2026 - 2030 Batch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Semester Number</label>
                <select
                  value={batchForm.semester}
                  onChange={(e) => setBatchForm({ ...batchForm, semester: Number(e.target.value) })}
                  className="w-full p-3 border border-slate-200 rounded-xl font-semibold text-sm bg-slate-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Payment Due Date</label>
                <input
                  type="date"
                  required
                  value={batchForm.dueDate}
                  onChange={(e) => setBatchForm({ ...batchForm, dueDate: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl font-semibold text-sm bg-slate-50"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 space-y-1">
                <p className="font-bold">Important Accounting Notice:</p>
                <p>Generating invoices will immediately debit student virtual ledgers and post double-entry recognition to General Ledger Accounts Receivable (`ACCOUNTS_RECEIVABLE`). Existing invoices for this semester will not be duplicated.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={batchGenerating}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold rounded-xl shadow-lg transition text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {batchGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Generating Auto-Invoices & Ledgers...
                </>
              ) : (
                <>
                  <FileCheck className="h-5 w-5" />
                  Generate Semester Invoices & Post GL
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
