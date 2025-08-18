import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api.jsx";

export default function SignUpForm({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup({ username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="bg-white shadow-lg rounded-xl p-8 w-[320px]"
    >
      <h2 className="text-2xl font-bold text-gray-600 text-center mb-6">
        Sign Up
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="relative w-full mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full h-10 border border-gray-400 rounded px-2 outline-none peer"
        />
        <label className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 transition-all duration-300 peer-valid:top-0 peer-valid:text-xs peer-valid:bg-white peer-focus:top-0 peer-focus:text-xs peer-focus:bg-white">
          Username
        </label>
      </div>

      <div className="relative w-full mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-10 border border-gray-400 rounded px-2 outline-none peer"
        />
        <label className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 transition-all duration-300 peer-valid:top-0 peer-valid:text-xs peer-valid:bg-white peer-focus:top-0 peer-focus:text-xs peer-focus:bg-white">
          Email
        </label>
      </div>

      <div className="relative w-full mb-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-10 border border-gray-400 rounded px-2 outline-none peer"
        />
        <label className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 transition-all duration-300 peer-valid:top-0 peer-valid:text-xs peer-valid:bg-white peer-focus:top-0 peer-focus:text-xs peer-focus:bg-white">
          Password
        </label>
      </div>

      <button
        type="submit"
        className="w-full h-10 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded shadow-md"
      >
        Sign Up
      </button>

      <div className="text-center mt-6 text-sm">
        <p className="text-gray-700">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch || (() => navigate("/login"))}
            className="text-pink-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}
