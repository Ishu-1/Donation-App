"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { FaUserCircle, FaBox, FaHandsHelping, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DonorNavbar({ donorName }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <div className="bg-white shadow-xl py-4 px-6 flex items-center justify-between rounded-b-3xl">
      {/* Left Side: Donor Avatar and Name */}
      <div className="flex items-center space-x-4">
        <FaUserCircle className="text-green-500 text-3xl" />
        <span className="text-2xl font-semibold text-gray-800">{donorName}</span>
      </div>

      {/* Right Side: Navigation Links */}
      <div className="hidden md:flex items-center space-x-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push("/donor/products")}
          className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
        >
          <FaBox className="text-xl" />
          <span>Products</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push("/donor/dashboard")}
          className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
        >
          <FaHandsHelping className="text-xl" />
          <span>Dashboard</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push("/donor/donations")}
          className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
        >
          <FaHandsHelping className="text-xl" />
          <span>Donations</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
          className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </motion.button>
      </div>

      {/* Mobile Menu (Optional) */}
      <div className="md:hidden flex items-center space-x-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 hover:text-green-500 text-2xl"
        >
          {open ? "Close" : "Menu"}
        </button>

        {open && (
          <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg p-6 w-48 space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/donor/products")}
              className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
            >
              <FaBox className="text-xl" />
              <span>Products</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/donor/dashboard")}
              className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
            >
              <FaHandsHelping className="text-xl" />
              <span>Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/donor/donations")}
              className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
            >
              <FaHandsHelping className="text-xl" />
              <span>Donations</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="text-lg text-gray-600 hover:text-green-500 transition-all flex items-center space-x-2"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
