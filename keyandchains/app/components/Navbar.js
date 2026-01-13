"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Home,
  Key,
  Truck,
  Menu,
  CircleQuestionMark,
} from "lucide-react";

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="backdrop-blur-md bg-white border-b border-gray-300 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/">
            <h1 className="text-gray-900 font-extrabold text-2xl">
              Key & Chains
            </h1>
          </Link>

          {/* DESKTOP MENU */}
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
            <Link href="/FAQ" className="flex items-center gap-1 hover:text-gray-900">
              <CircleQuestionMark size={18} /> FAQ
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">

            {/* CART */}
            <Link href="/Cart" className="relative">
              <ShoppingCart
                size={24}
                className="text-gray-700 hover:text-gray-900"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
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
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
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

            {/* MOBILE BUTTON */}
            <button onClick={() => setMenu(true)} className="md:hidden">
              <Menu size={30} />
            </button>
          </div>
        </div>
      </nav>

      {/* SPACER */}
      <div className="h-16" />

      {/* MOBILE MENU */}
      {menu && (
        <>
          <div
            onClick={() => setMenu(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 relative">

              <button
                onClick={() => setMenu(false)}
                className="absolute top-4 right-4 text-2xl font-bold text-gray-600"
              >
                ×
              </button>

              <h2 className="text-2xl font-extrabold text-center mb-6">
                Key & Chains
              </h2>

              <nav className="flex flex-col gap-4 text-gray-700 font-semibold">

                <Link
                  href="/"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <Home size={20} /> Home
                </Link>

                <Link
                  href="/Shop"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <Key size={20} /> KeyChains
                </Link>

                <Link
                  href="/TrackOrder"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <Truck size={20} /> Track Order
                </Link>

                  <Link
                  href="/FAQ"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <CircleQuestionMark size={20} /> FAQ
                </Link>

                <Link
                  href="/Cart"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <ShoppingCart size={20} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
