"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Home, Key, Anchor, Truck, Menu } from "lucide-react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.replace("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/cart");
        if (!res.ok) return;
        const data = await res.json();
        setCartCount(data.length);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };
    fetchCart();
  }, []);

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
          <Link href="/">
            <h1 className="text-gray-900 font-extrabold text-2xl cursor-pointer">Key & Chains</h1>
          </Link>

          <div className="hidden md:flex flex-1 justify-center gap-8 text-gray-700 font-semibold">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-900 transition">
              <Home size={18} /> Home
            </Link>
            <Link href="/Shop" className="flex items-center gap-1 hover:text-gray-900 transition">
              <Key size={18} /> KeyChains
            </Link>
            <Link href="/TrackOrder" className="flex items-center gap-1 hover:text-gray-900 transition">
              <Truck size={18} /> Track Order
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/Cart" className="relative">
              <ShoppingCart size={24} className="text-gray-700 hover:text-gray-900 transition" />
              <span
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                {cartCount}
              </span>
            </Link>

            {user ? (
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-gray-600 transition"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-5 w-56 bg-white rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/Login"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMenu(true)}
              className="md:hidden px-4 py-2 text-gray-500 rounded-lg active:text-blue-600 transition"
            >
              <Menu size={30} />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {menu && (
        <>
          <div onClick={() => setMenu(false)} className="fixed inset-0 bg-black/50 z-40" />
          <div className="mt-16 fixed inset-0 z-50 flex flex-col justify-center items-center bg-white animate-fade-in">
            <button
              onClick={() => setMenu(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-3xl"
            >
              ×
            </button>

            <nav className="flex flex-col gap-8 text-gray-800 font-semibold text-lg text-center">
              <Link href="/" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Home size={20} className="inline mb-1" /> Home
              </Link>
              <Link href="/Shop" onClick={() => setMenu(false)} className="hover:text-blue-600 transition">
                <Key size={20} className="inline mb-1" /> KeyChains
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
