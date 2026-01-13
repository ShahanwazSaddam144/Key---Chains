"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

// Load Stripe with your public key
const stripePromise = loadStripe("pk_test_YOUR_PUBLIC_KEY_HERE"); // Replace with your key

// Card Element styles
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",
      "::placeholder": {
        color: "#888",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  },
};

// ---------------------------
// Inner Checkout Form
// ---------------------------
const CheckoutFormInner = ({ cartItems, userEmail }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    name: "",
    email: userEmail || "",
    phone: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "cod",
  });

  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Stripe card check
      if (formData.paymentMethod === "card") {
        if (!stripe || !elements) {
          setError("Stripe is not loaded");
          setShowModal(true);
          return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
          setError("Card details not entered");
          setShowModal(true);
          return;
        }
        // Note: You said no PaymentIntent, so just validate card input
      }

      // Send order to backend
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userEmail: formData.email,
          paymentStatus: formData.paymentMethod === "cod" ? "COD" : "Paid",
          products: cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to place order");
        setShowModal(true);
        return;
      }

      setOrderId(data.order._id);
      setOrderProducts(data.order.products || []);
      setError("");
      setShowModal(true);

      // Reset form
      setFormData({
        name: "",
        email: userEmail || "",
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
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        {/* Name & Email */}
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

        {/* Phone & Address */}
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

        {/* City & Country */}
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

        {/* Payment Method */}
        <div className="flex flex-col gap-4 mt-2">
          {/* Cash on Delivery */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleChange}
            />
            Cash on Delivery
          </label>

          {/* Card Payment */}
          <label className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              Card Payment
            </div>

            {/* Show CardElement only if card is selected */}
            {formData.paymentMethod === "card" && (
              <div className="mt-2 p-3 border rounded-md">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            )}
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-black text-white py-2 rounded-md"
        >
          Place Order
        </button>
      </form>

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 font-bold"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {error ? (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  Error
                </h2>
                <p>{error}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="mb-3">Order ID: {orderId}</p>

                {orderProducts.length > 0 && (
                  <div className="border rounded-md p-3 text-left max-h-48 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Ordered Products</h3>
                    {orderProducts.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm border-b py-1"
                      >
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded-md"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ---------------------------
// Wrapper Checkout Component
// ---------------------------
const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("//api/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Fetch cart items for user
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.email) return;
      try {
        
        const res = await fetch(
          `/api/cart?userEmail=${encodeURIComponent(
            user.email
          )}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setCartItems(
            data.map((item) => ({ ...item, quantity: item.quantity || 1 }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [user]);

  return (
    <>
      <Navbar />
      <Elements stripe={stripePromise}>
        <CheckoutFormInner
          cartItems={cartItems}
          userEmail={user?.email || ""}
        />
      </Elements>
    </>
  );
};

export default Checkout;
