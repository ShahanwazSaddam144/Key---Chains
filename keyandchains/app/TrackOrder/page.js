"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const TrackOrder = () => {
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Random order statuses
  const randomStatuses = [
    "Order received ✅",
    "Preparing your items 🛠️",
    "Shipped 🚚",
    "Out for delivery 🏠",
    "Delivered 📦",
  ];

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleTrackOrder = () => {
    if (!orderId.trim() || !user) return;

    setLoading(true);

    // Simulate a small delay
    setTimeout(() => {
      // Create random products for demo
      const products = Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, i) => ({
        name: `Product ${i + 1}`,
        quantity: Math.floor(Math.random() * 3) + 1,
      }));

      // Pick a random status
      const status = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];

      setOrderInfo({
        name: user.name || "User",
        products,
        status,
      });

      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <section className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            onClick={handleTrackOrder}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>

        {orderInfo && (
          <div className="border rounded-xl p-6 bg-gray-50 dark:bg-gray-900 dark:text-white shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Order for: {orderInfo.name}</h2>
            <p className="mb-4 font-medium text-blue-600 dark:text-blue-400">
              Status: {orderInfo.status}
            </p>

            <h3 className="font-semibold mb-2">Products:</h3>
            <ul className="list-disc list-inside space-y-1">
              {orderInfo.products.map((p, i) => (
                <li key={i}>
                  {p.name} — Qty: {p.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
};

export default TrackOrder;
