import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import FileExplorer from "./components/FileExplorer.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/FileExplorer" element={<FileExplorer />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
