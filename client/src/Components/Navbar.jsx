import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white shadow-sm border-b flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-lg font-semibold text-gray-900">Dashboard</div>

        {/* Search placeholder input */}
        <div className="hidden md:block w-[320px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              aria-label="Search"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification icon */}
        <button
          type="button"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden sm:inline-flex items-center justify-center rounded-lg border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
        >
          Logout
        </button>

        {/* User avatar */}
        <div
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-semibold border border-gray-200"
          aria-label="User avatar"
        >
          <User className="w-5 h-5 text-gray-700" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

