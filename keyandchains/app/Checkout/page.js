"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "cod",
  });

  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentStatus: formData.paymentMethod === "cod" ? "COD" : "Paid",
          userEmail: formData.email,
          products: [], // no cart items
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to place order");
        setShowModal(true);
        return;
      }

      setOrderId(data.order._id);
      setError("");
      setShowModal(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        paymentMethod: "cod",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while placing the order");
      setShowModal(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        {/* Flex row for medium screens and above */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="flex-1 p-3 border rounded-md"
            required
          />
        </div>

        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleChange}
            />{" "}
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handleChange}
            />{" "}
            Card Payment
          </label>
        </div>

        <button type="submit" className="mt-4 w-full bg-black text-white py-2 rounded-md">
          Place Order
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {error ? (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                <p>{error}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-green-600 mb-4">Order Placed Successfully!</h2>
                <p>Order ID: {orderId}</p>
              </>
            )}

            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Checkout = () => {
  return (
    <>
      <Navbar />
      <CheckoutForm />
    </>
  );
};

export default Checkout;
