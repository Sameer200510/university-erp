import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./auth/pages/Login";
import ChangePassword from "./auth/pages/ChangePassword";
import ProtectedRoute from "./shared/routes/ProtectedRoute";

import StudentLayout from "./student-portal/layout/StudentLayout";

import DashboardPage from "./student-portal/dashboard/pages/DashboardPage";
import ProfilePage from "./student-portal/profile/pages/ProfilePage";
import DocumentsPage from "./student-portal/documents/pages/DocumentsPage";

// Admission Portal Imports
import AdmissionLayout from "./admission-portal/layout/AdmissionLayout";
import AdmissionDashboardPage from "./admission-portal/dashboard/pages/DashboardPage";
import ManageApplications from "./admission-portal/dashboard/pages/ManageApplications";
import ApplicationDetail from "./admission-portal/dashboard/pages/ApplicationDetail";
import ApplyPage from "./admission-portal/applications/pages/ApplyPage";
import StatusPage from "./admission-portal/applications/pages/StatusPage";

import AcademicHomePage from "./student-portal/academic/pages/AcademicHomePage";
import AttendancePage from "./student-portal/academic/pages/AttendancePage";
import AttendanceDetailsPage from "./student-portal/academic/pages/AttendanceDetailsPage";
import ResultsPageAcademic from "./student-portal/academic/pages/ResultsPage"; // Name conflict se bachne ke liye rename kiya
import SubjectsPage from "./student-portal/academic/pages/SubjectsPage";
import SemesterRegistrationPage from "./student-portal/academic/pages/SemesterRegistrationPage";
import FeedbackPage from "./student-portal/academic/pages/FeedbackPage";
import FeesHomePage from "./student-portal/fees/pages/FeesHomePage";
import InstallmentsPage from "./student-portal/fees/pages/InstallmentsPage";
import PaymentsPage from "./student-portal/fees/pages/PaymentsPage";
import ReceiptsPage from "./student-portal/fees/pages/ReceiptsPage";
import StudentLedgerPage from "./student-portal/fees/pages/StudentLedgerPage";

import AdminFeesDashboard from "./admin-portal/fees/pages/AdminFeesDashboard";
import FeeMatrixBillingStudio from "./admin-portal/fees/pages/FeeMatrixBillingStudio";
import CashierCounterPortal from "./admin-portal/fees/pages/CashierCounterPortal";

import AdmitCardPage from "./student-portal/exam/pages/AdmitCardPage";
import ExamHomePage from "./student-portal/exam/pages/ExamHomePage";
import MarksPage from "./student-portal/exam/pages/MarksPage";
import ExamResultsPage from "./student-portal/exam/pages/ResultsPage";
import BackPapersPage from "./student-portal/exam/pages/BackPapersPage";
import IssuedMarksheetsPage from "./student-portal/exam/pages/IssuedMarksheetsPage";
import RevaluationPage from "./student-portal/exam/pages/RevaluationPage";

import CircularsPage from "./student-portal/circulars/pages/CircularsPage";

function App() {
  return (
    <div className="App font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Change Password */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Student Portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Academic Module */}
          <Route path="academic" element={<AcademicHomePage />} />
          <Route path="academic/attendance" element={<AttendancePage />} />
          <Route
            path="academic/attendance/:subjectId"
            element={<AttendanceDetailsPage />}
          />
          <Route path="academic/results" element={<ResultsPageAcademic />} />
          <Route path="academic/subjects" element={<SubjectsPage />} />
          <Route
            path="academic/semester-registration"
            element={<SemesterRegistrationPage />}
          />
          <Route path="academic/feedback" element={<FeedbackPage />} />
          {/* Fees Routes */}
          <Route path="fees" element={<FeesHomePage />} />
          <Route path="fees/ledger" element={<StudentLedgerPage />} />
          <Route path="fees/installments" element={<InstallmentsPage />} />
          <Route path="fees/payments" element={<PaymentsPage />} />
          <Route path="fees/receipts" element={<ReceiptsPage />} />
          {/* Exam Routes */}
          <Route path="exam" element={<ExamHomePage />} />
          <Route path="exam/admit-card" element={<AdmitCardPage />} />
          <Route path="exam/marks" element={<MarksPage />} />
          <Route path="exam/results" element={<ExamResultsPage />} />{" "}
          <Route path="exam/back-papers" element={<BackPapersPage />} />
          <Route path="exam/marksheets" element={<IssuedMarksheetsPage />} />
          <Route path="exam/revaluation" element={<RevaluationPage />} />
          {/* Other Modules */}
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="circulars" element={<CircularsPage />} />
          <Route path="placement" element={<div>Placement</div>} />
          <Route path="hostel" element={<div>Hostel</div>} />
          <Route path="grievance" element={<div>Grievance</div>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admission Portal (Admin view) */}
        <Route
          path="/admission"
          element={
            <ProtectedRoute allowedRoles={["ADMISSION_OFFICER", "ADMISSION_ADMIN", "SUPER_ADMIN"]}>
              <AdmissionLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="/admission/applications" replace />} />
          <Route path="dashboard" element={<Navigate to="/admission/applications" replace />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="fees/dashboard" element={<AdminFeesDashboard />} />
          <Route path="fees/matrix" element={<FeeMatrixBillingStudio />} />
          <Route path="fees/collection" element={<CashierCounterPortal />} />
        </Route>
        <Route path="/admission/apply" element={<ApplyPage />} />
        <Route path="/admission/status" element={<StatusPage />} />

        {/* Admin Portal */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMISSION_OFFICER"]}>
              <AdminFeesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees/matrix"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMISSION_OFFICER"]}>
              <FeeMatrixBillingStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees/collection"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMISSION_OFFICER"]}>
              <CashierCounterPortal />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="p-8 text-center text-red-500 text-xl font-bold">
              Unauthorized Access
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
