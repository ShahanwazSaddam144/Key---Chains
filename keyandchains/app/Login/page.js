"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email").value;
    const pass = password;

    const endpoint = isSignup ? `/api/auth/signup` : `/api/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isSignup ? { name, email, pass } : { email, pass }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Authentication failed");
        setLoading(false);
        return;
      }

      setSuccess(
        isSignup
          ? "Signup successful! Redirecting..."
          : "Login successful! Redirecting..."
      );

      setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Transparent Professional Background */}
      <section className="mt-10 min-h-screen sm:min-h-0 relative bg-white/20 flex flex-col justify-center items-center backdrop-blur-sm overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/30 rounded-full blur-3xl animate-blob -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-blob animation-delay-2000 -z-10"></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/15 rounded-full blur-2xl animate-blob animation-delay-4000 -z-10"></div>

        {/* Optional Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-gray-800 text-[35px] font-bold drop-shadow-md">
            👋👋 Welcome Back
          </h1>
          <p className="text-gray-700/80 mt-2 text-lg md:text-xl">
            Login or create your account to continue
          </p>
        </div>
        {/* Login Container */}
        <div className="flex items-center justify-center p-6 w-full">
          <div className="w-full max-w-md border border-gray-300 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            {isSignup && (
              <input
                id="name"
                placeholder="Full Name"
                className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-500 text-black placeholder-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 outline-none transition"
              />
            )}

            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-500 text-black placeholder-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 outline-none transition"
            />

            <div className="relative mb-4">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-500 text-black placeholder-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 mt-6 active:text-gray-800 hover:text-gray-900 -translate-y-1/2"
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800 transition"
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>

            <p
              onClick={() => setIsSignup(!isSignup)}
              className="mt-6 text-center cursor-pointer hover:underline text-gray-800"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>

            {error && <p className="text-center mt-4 text-red-500">{error}</p>}
          </div>
        </div>

        {success && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg">
            {success}
          </div>
        )}
      </section>

      {/* Blob Animation Keyframes */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
