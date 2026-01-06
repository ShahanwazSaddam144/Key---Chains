"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Home, Key, Anchor, Truck, Menu } from "lucide-react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const profileRef = useRef(null);

  /* ======================
     LOGOUT
  ====================== */
  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.replace("/");
  };

  /* ======================
     FETCH USER
  ====================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  /* ======================
     CLOSE POPUP ON OUTSIDE CLICK
  ====================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="backdrop-blur-md bg-white border-b border-b-gray-300 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-gray-900 font-extrabold text-2xl cursor-pointer">
              Key & Chains
            </h1>
          </Link>

          {/* Large screen links */}
          <div className="hidden md:flex flex-1 justify-center gap-8 text-gray-700 font-semibold">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Home size={18} /> Home
            </Link>
            <Link href="/KeyChains" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Key size={18} /> KeyChains
            </Link>
            <Link href="/Straps" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Anchor size={18} /> Straps
            </Link>
            <Link href="/TrackOrder" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Truck size={18} /> Track Order
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart Icon (always visible) */}
            <div className="cursor-pointer text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart size={24} />
            </div>

            {/* User Avatar OR Sign In button */}
            {user ? (
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 bg-blue-500 text-white rounded-full
                  flex items-center justify-center font-bold text-lg
                  cursor-pointer hover:bg-blue-600 transition"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* PROFILE POPUP */}
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-5 w-56 bg-white
                    rounded-xl shadow-lg z-50"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3
                      text-red-600 hover:bg-red-50 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/Login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger menu for small screens */}
            <button
              onClick={() => setMenu(true)}
              className="md:hidden px-4 py-2 text-gray-500 rounded-lg active:text-blue-600 transition"
            >
              <Menu size={30}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* ======================
          MOBILE FULLSCREEN MENU
      ====================== */}
      {menu && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMenu(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Centered full-screen menu */}
          <div className="mt-16 fixed inset-0 z-50 flex flex-col justify-center items-center bg-white animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => setMenu(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-3xl"
            >
              ×
            </button>

            {/* Menu items */}
            <nav className="flex flex-col gap-8 text-gray-800 font-semibold text-lg text-center">
              <Link href="/Home" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Home size={20} className="inline mb-1" /> Home
              </Link>
              <Link href="/KeyChains" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Key size={20} className="inline mb-1" /> KeyChains
              </Link>
              <Link href="/Straps" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Anchor size={20} className="inline mb-1" /> Straps
              </Link>
              <Link href="/TrackOrder" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Truck size={20} className="inline mb-1" /> Track Order
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
