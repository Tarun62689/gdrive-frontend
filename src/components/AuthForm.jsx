import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import SignUpForm from "./SignUpForm.jsx";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-pink-500 overflow-hidden">
      <div className="relative w-[400px] h-[500px]">
        {/* Sign Up */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-700 ${
            isSignUp
              ? "z-10 rotate-0"
              : "rotate-[7deg] -translate-x-[500px] z-0"
          }`}
        >
          <SignUpForm onSwitch={() => setIsSignUp(false)} />
        </div>

        {/* Login */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-white shadow-lg transition-all duration-700 ${
            isSignUp
              ? "rotate-[7deg] translate-x-[500px] z-0"
              : "z-10 rotate-0"
          }`}
        >
          <LoginForm onSwitch={() => setIsSignUp(true)} />
        </div>
      </div>
    </div>
  );
}
