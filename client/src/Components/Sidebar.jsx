import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Calendar, BarChart3 } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/resume", label: "Resume", icon: FileText },
    { to: "/interview", label: "Interview", icon: Calendar },
    { to: "/report", label: "Reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-[260px] bg-slate-900 text-white h-screen p-4 flex flex-col gap-6">
      <div className="text-xl font-bold text-white">AI Mock Interview</div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={[
                "rounded-xl px-3 py-2 flex items-center gap-3 transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-white/90 hover:bg-slate-800 hover:text-white",
              ].join(" ")}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

