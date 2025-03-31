"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">or</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 p-3 rounded-lg shadow-sm mt-4 hover:bg-gray-100 transition"
          disabled={loading}
        >
          <FcGoogle className="text-xl mr-2" /> Sign in with Google
        </button>
      </div>
    </div>
  );
}
