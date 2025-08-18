import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api.jsx";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-2xl p-8 w-[420px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://www.svgrepo.com/show/303552/google-drive-logo.svg"
            alt="Drive Logo"
            className="h-10 w-10"
          />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mb-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="********"
          className="w-full mb-6 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
