import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Users, LogOut, LayoutDashboard, DollarSign, Layers, Banknote, UserCheck } from "lucide-react";
import { useAuthStore } from "../../shared/store/auth.store";

const admissionOfficerNavItems = [
  { name: "Applications", href: "/admission/applications", icon: Users },
  { name: "Fee Due Verification", href: "/admission/fees/status", icon: UserCheck },
];

const financeNavItems = [
  { name: "Financial Dashboard", href: "/finance/dashboard", icon: DollarSign },
  { name: "Fee Matrix Studio", href: "/finance/matrix", icon: Layers },
  { name: "Cashier Counter", href: "/finance/collection", icon: Banknote },
];

const superAdminNavItems = [
  { name: "Applications", href: "/admission/applications", icon: Users },
  { name: "Fee Due Verification", href: "/admission/fees/status", icon: UserCheck },
  { name: "Financial Dashboard", href: "/admission/fees/dashboard", icon: DollarSign },
  { name: "Fee Matrix Studio", href: "/admission/fees/matrix", icon: Layers },
  { name: "Cashier Counter", href: "/admission/fees/collection", icon: Banknote },
];

export default function AdmissionLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const activeNavList =
    user?.role === "FINANCE_OFFICER" || pathname.startsWith("/finance")
      ? financeNavItems
      : user?.role === "ADMISSION_OFFICER" || user?.role === "ADMISSION_ADMIN"
      ? admissionOfficerNavItems
      : superAdminNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-col border-r border-border bg-card backdrop-blur-xl flex">
        <div className="flex h-16 items-center px-6 border-b border-border gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Graphic Era
          </span>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {activeNavList.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} to={item.href}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-md" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-black/5 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              {activeNavList.find((n) => pathname.startsWith(n.href))?.name || "Portal"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="text-sm font-bold text-primary">{user?.loginId?.charAt(0) || "A"}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-scroll p-6 scroll-smooth bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
