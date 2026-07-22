import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../shared/store/auth.store";
import { LogOut, Home, BarChart2, User as UserIcon } from "lucide-react";

const StudentLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const topMenuItems = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Academic", path: "/student/academic" },
    { name: "Fees", path: "/student/fees" },
    { name: "Documents", path: "/student/documents" },
    { name: "Exam", path: "/student/exam" },
    { name: "Circulars", path: "/student/circulars" },
    { name: "Placement", path: "/student/placement" },
    { name: "Hostel", path: "/student/hostel" },
    { name: "Grievance", path: "/student/grievance" },
    { name: "Profile", path: "/student/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            {/* University Logo Placeholder */}
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-3">
              GE
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-red-600 tracking-tight">
                Graphic Era
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Deemed to be University
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-orange-500 hover:text-orange-600 transition p-1 bg-orange-100 rounded-full">
              <LogOut className="h-5 w-5" onClick={handleLogout} />
            </button>
            <div className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 py-1 px-3 rounded-full">
              <UserIcon className="h-4 w-4 mr-2" />
              {user?.studentProfile?.firstName || user?.loginId}
            </div>
          </div>
        </div>

        {/* Secondary Blue Nav Bar */}
        <div className="bg-[#0099cc] flex items-center px-4 overflow-x-auto shadow-md">
          {topMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-6 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#007ba3] text-white"
                    : "text-white hover:bg-[#0086b3]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar will be handled by nested routes / components if needed, or we can render it here based on location. 
            For exact modularity, we let the child route handle its own layout/sidebar. */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
