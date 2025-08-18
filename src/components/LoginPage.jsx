import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.jsx";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/FileExplorer");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-[420px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Drive Logo"
            className="h-10 w-10"
          />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mb-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="********"
          className="w-full mb-6 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-full hover:bg-indigo-600 transition"
        >
          Login
        </button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-indigo-500 font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
