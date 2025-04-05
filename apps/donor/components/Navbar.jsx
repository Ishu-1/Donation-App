"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const DonationNavbar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/api/auth/signin");
  };

  return (
    <header className="w-full bg-[#f4f4ef] shadow border-b">
      <nav className="flex justify-between items-center px-6 py-3">
        {/* Left - Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="text-xl font-semibold text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          DoNation
        </button>

        {/* Center - Navigation Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleNavigation("/receivers")}
            className="bg-[#1f3c45] text-white px-4 py-2 rounded-sm hover:bg-[#305661] transition cursor-pointer"
          >
            Recievers
          </button>
          <button
            onClick={() => handleNavigation("/products")}
            className="bg-[#1f3c45] text-white px-4 py-2 rounded-sm hover:bg-[#305661] transition cursor-pointer"
          >
            Products
          </button>
          <button
            onClick={() => handleNavigation("/requests")}
            className="bg-[#1f3c45] text-white px-4 py-2 rounded-sm hover:bg-[#305661] transition cursor-pointer"
          >
            Requests
          </button>
          <button
            onClick={() => handleNavigation("/unlisted-requests")}
            className="bg-[#1f3c45] text-white px-4 py-2 rounded-sm hover:bg-[#305661] transition cursor-pointer"
          >
            Unlisted Requests
          </button>
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="bg-[#1f3c45] text-white px-4 py-2 rounded-sm hover:bg-[#305661] transition cursor-pointer"
          >
            Dashboard
          </button>
        </div>

        {/* Right - Logout Button */}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-700 border px-3 py-2 rounded-sm hover:bg-gray-100 transition cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default DonationNavbar;
