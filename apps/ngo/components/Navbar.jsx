"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  Users,
  ClipboardPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const NgoNavbar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("/");

  const handleNavigation = (path) => {
    setActiveTab(path);
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <header className="w-full bg-gray-900 shadow-md sticky top-0 z-10 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-200 cursor-pointer"
          >
            <span className="text-2xl font-extrabold bg-teal-900 text-teal-300 rounded-lg p-1">N</span>
            <span>DoNation Beneficiaries</span>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg shadow-lg">
            <NavButton 
              icon={<Package size={18} />} 
              label="Products" 
              path="/products"
              activeTab={activeTab}
              onClick={() => handleNavigation("/products")} 
            />
            <NavButton 
              icon={<Users size={18} />} 
              label="Donors" 
              path="/donors"
              activeTab={activeTab}
              onClick={() => handleNavigation("/donors")} 
            />
            <NavButton 
              icon={<ClipboardPlus size={18} />} 
              label="Request Donation" 
              path="/new-request"
              activeTab={activeTab}
              onClick={() => handleNavigation("/new-request")} 
            />
            <NavButton 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              path="/dashboard"
              activeTab={activeTab}
              onClick={() => handleNavigation("/dashboard")} 
            />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-red-300 font-medium bg-gray-800 border border-gray-700 hover:border-red-900 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 shadow-md active:bg-red-900 active:text-white cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

const NavButton = ({ icon, label, onClick, path, activeTab }) => {
  const isActive = path === activeTab;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer
        ${isActive 
          ? "bg-teal-700 text-white" 
          : "text-gray-300 hover:text-teal-300 hover:bg-gray-700 active:bg-teal-800 active:text-white"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default NgoNavbar;
