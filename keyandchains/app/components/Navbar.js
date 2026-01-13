"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Home, Key, Truck, Menu } from "lucide-react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();
  const profileRef = useRef(null);

  /* =====================
     LOGOUT
  ===================== */

  const handleLogout = async () => {
    await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setCartCount(0);
    router.replace("/");
  };

  /* =====================
     FETCH LOGGED USER
  ===================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/me`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  /* =====================
     FETCH CART COUNT
  ===================== */
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!user?.email) {
          setCartCount(0);
          return;
        }

        const res = await fetch(
          `/api/cart?userEmail=${encodeURIComponent(user.email)}`
        );

        if (!res.ok) return;

        const data = await res.json();
        setCartCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Failed to fetch cart count", err);
      }
    };

    fetchCartCount();
  }, [user]);

  /* =====================
     CLICK OUTSIDE PROFILE
  ===================== */
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
      <nav className="backdrop-blur-md bg-white border-b border-gray-300 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-gray-900 font-extrabold text-2xl">
              Key & Chains
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center gap-8 text-gray-700 font-semibold">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-900">
              <Home size={18} /> Home
            </Link>
            <Link href="/Shop" className="flex items-center gap-1 hover:text-gray-900">
              <Key size={18} /> KeyChains
            </Link>
            <Link href="/TrackOrder" className="flex items-center gap-1 hover:text-gray-900">
              <Truck size={18} /> Track Order
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* CART ICON */}
            <Link href="/Cart" className="relative">
              <ShoppingCart size={24} className="text-gray-700 hover:text-gray-900" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER PROFILE */}
            {user ? (
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-lg">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user.name}</p>
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
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Sign In
              </Link>
            )}

            {/* MOBILE MENU */}
            <button onClick={() => setMenu(true)} className="md:hidden">
              <Menu size={30} />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {/* MOBILE MENU */}
      {menu && (
        <>
          <div onClick={() => setMenu(false)} className="fixed inset-0 bg-black/50 z-40" />
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <button onClick={() => setMenu(false)} className="absolute top-6 right-6 text-3xl">
              ×
            </button>
            <nav className="flex flex-col gap-8 text-lg font-semibold">
              <Link href="/" onClick={() => setMenu(false)}>Home</Link>
              <Link href="/Shop" onClick={() => setMenu(false)}>KeyChains</Link>
              <Link href="/TrackOrder" onClick={() => setMenu(false)}>Track Order</Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
