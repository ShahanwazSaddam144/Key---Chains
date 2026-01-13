"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const TrackOrder = () => {
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user
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

  const getOrderStatus = (orderDate) => {
    const now = new Date();
    const diffTime = now - orderDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 4) return "Delivered 📦";
    if (diffDays >= 3) return "Dispatched 🚚";
    if (diffDays >= 1) return "Confirmed ✅";
    return "Pending ⏳";
  };

  const handleTrackOrder = () => {
    if (!orderId.trim() || !user) return;

    setLoading(true);

    setTimeout(() => {
      const orderCreatedAt = new Date("2026-01-12");

      const products = Array.from({ length: 2 }).map((_, i) => ({
        name: `Product ${i + 1}`,
        quantity: i + 1,
      }));

      const status = getOrderStatus(orderCreatedAt);

      setOrderInfo({
        name: user.name || "User",
        products,
        status,
      });

      setLoading(false);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Track Your Order
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 p-3 border rounded-md border-gray-700"
          />
          <button
            onClick={handleTrackOrder}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>

{orderInfo && (
  <div className="rounded-xl p-6 bg-gray-50 shadow-md mt-5">
    <h2 className="text-2xl font-semibold mb-4">
      Order for: {orderInfo.name}
    </h2>

    {/* ORDER STATUS TRACKER */}
    <div className="mb-6">
      <div className="flex items-center justify-between relative">

        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -z-10"></div>

        {/* Pending */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
              ${
                ["Pending ⏳", "Confirmed ✅", "Dispatched 🚚", "Delivered 📦"].includes(orderInfo.status)
                  ? "bg-yellow-400"
                  : "bg-gray-300"
              }
            `}
          >
            1
          </div>
          <span className="mt-2 text-sm font-medium">
            Pending
          </span>
        </div>

        {/* Confirmed */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
              ${
                ["Confirmed ✅", "Dispatched 🚚", "Delivered 📦"].includes(orderInfo.status)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }
            `}
          >
            2
          </div>
          <span className="mt-2 text-sm font-medium">
            Confirmed
          </span>
        </div>

        {/* Dispatched */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
              ${
                ["Dispatched 🚚", "Delivered 📦"].includes(orderInfo.status)
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }
            `}
          >
            3
          </div>
          <span className="mt-2 text-sm font-medium">
            Dispatched
          </span>
        </div>

        {/* Delivered */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
              ${
                orderInfo.status === "Delivered 📦"
                  ? "bg-black"
                  : "bg-gray-300"
              }
            `}
          >
            4
          </div>
          <span className="mt-2 text-sm font-medium">
            Delivered
          </span>
        </div>
      </div>
    </div>

    {/* CURRENT STATUS TEXT */}
    <p className="mb-4 text-gray-600 font-semibold text-lg">
      Current Status:{" "}
      <span className="text-gray-800">{orderInfo.status}</span>
    </p>

    {/* PRODUCTS */}
    <h3 className="font-semibold mb-2">Products:</h3>
    <ul className="list-disc list-inside space-y-1">
      {orderInfo.products.map((p, i) => (
        <li key={i}>
          {p.name} — Qty: {p.quantity}
        </li>
      ))}
    </ul>

    {/* Learn More */}
    <header className="flex flex-col justify-center items-center mt-5">
      <h1 className="text-[25px] font-bold text-gray-900">Learn More</h1>
      <p className="font-medium text-gray-700">
      Track your order in real time and stay updated on every step of the delivery process.</p>
      <Link href="/FAQ">
      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg 
      hover:bg-gray-100 transition mt-4 cursor-pointer"
      >Learn More</button>
      </Link>
    </header>
  </div>
)}

      </section>
    </>
  );
};

export default TrackOrder;
