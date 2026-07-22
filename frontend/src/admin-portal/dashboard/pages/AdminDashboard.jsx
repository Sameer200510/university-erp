import React from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Super Admin Portal
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome, {user?.loginId}. System administration tools will be
          available here.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
