"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaHandsHelping, FaHeart } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function DonorSignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password } = formData;
    const [firstName, ...lastNameArr] = name.split(" ");
    const lastName = lastNameArr.join(" ");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/auth/login");
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Signup failed. Try again.");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    const response = await signIn("google", { redirect: false });

    setLoading(false);

    if (!response?.ok) {
      setError("Google sign-up failed. Try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <FaHeart className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Donor Signup</h1>
          <p className="text-gray-500">Join DonateConnect as a Donor</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-semibold"
            disabled={loading || !formData.name || !formData.email || !formData.password}
          >
            {loading ? "Signing up..." : "Sign Up as Donor"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <span className="border-b w-1/4"></span>
          <p className="text-gray-500 px-4">OR</p>
          <span className="border-b w-1/4"></span>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center bg-white border border-gray-300 p-3 rounded-md shadow-sm hover:bg-gray-100 transition"
          disabled={loading}
        >
          <FcGoogle className="text-xl mr-2" /> Sign up with Google
        </button>

        {/* Redirect to Login */}
        <div className="text-center mt-5">
          <p className="text-gray-600">
            Already have a Donor account?{" "}
            <a href="/auth/login" className="text-green-500 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
