// src/components/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/logo.png";
import heroVideo from "../assets/hero-video.mp4";

export default function LandingPage() {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 bg-white">
      {/* Left Text Section */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <div className="flex items-center justify-center md:justify-start space-x-2">
          <img src={logo} alt="Drive Logo" className="h-8" />
          <span className="text-xl font-medium">Drive</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold">
          Easy and secure access to all of your content
        </h1>
        <p className="text-gray-600 max-w-md">
          Store, share, and collaborate on files and folders from any mobile
          device, tablet, or computer.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>

      {/* Right Video Section */}
      <div className="flex-1 mt-10 md:mt-0 flex justify-center bg-white">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full max-w-xll rounded-xl shadow-2xll object-cover bg-white"
        />
      </div>
    </div>
  );
}
