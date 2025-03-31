"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaHandsHelping } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function NgoLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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

    const response = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    setLoading(false);

    if (response?.ok) {
      router.push("/");
    } else {
      setError(response?.error || "Invalid email or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    const response = await signIn("google", { redirect: false });

    setLoading(false);

    if (!response?.ok) {
      setError("Google sign-in failed. Try again.");
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
            <FaHandsHelping className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">NGO Login</h1>
          <p className="text-gray-500">Access your NGO account</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? "Logging in..." : "Login as NGO"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <span className="border-b w-1/4"></span>
          <p className="text-gray-500 px-4">OR</p>
          <span className="border-b w-1/4"></span>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 p-3 rounded-md shadow-sm hover:bg-gray-100 transition"
          disabled={loading}
        >
          <FcGoogle className="text-xl mr-2" /> Sign in with Google
        </button>

        {/* Redirect to Signup */}
        <div className="text-center mt-5">
          <p className="text-gray-600">
            Don't have an NGO account?{" "}
            <a href="/auth/signup" className="text-green-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
