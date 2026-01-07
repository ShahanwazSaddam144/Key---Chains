"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Trash2, ShoppingCart, CreditCard, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, itemId: null, deleteAll: false });
  const [total, setTotal] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState({ show: false, success: false, message: "" });

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart");
      const data = await res.json();
      const itemsWithQty = data.map(item => ({ ...item, quantity: 1 }));
      setCartItems(itemsWithQty);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // Update total
  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cartItems]);

  // Quantity change
  const handleQuantityChange = (id, qty) => {
    setCartItems(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item));
  };

  // Delete single item
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/cart/${id}`, { method: "DELETE" });
      if (res.ok) setCartItems(cartItems.filter((item) => item._id !== id));
      setConfirmDelete({ show: false, itemId: null, deleteAll: false });
    } catch (err) { console.error("Failed to delete item", err); }
    finally { setLoading(false); }
  };

  // Delete all items
  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/cart", { method: "DELETE" });
      if (res.ok) setCartItems([]);
      setConfirmDelete({ show: false, itemId: null, deleteAll: false });
    } catch (err) { console.error("Failed to delete all items", err); }
    finally { setLoading(false); }
  };

  // Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          cartItems.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity
          }))
        )
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems([]); // Clear frontend cart
        router.push("/Checkout"); // Redirect to checkout page
      } else {
        setCheckoutStatus({ show: true, success: false, message: data.message || "Checkout failed!" });
      }
    } catch (err) {
      console.error(err);
      setCheckoutStatus({ show: true, success: false, message: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 flex items-center gap-3">
            <ShoppingCart size={32} /> Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-20">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-start p-5 bg-white shadow rounded-xl hover:shadow-lg transition">
                    <div className="flex flex-col gap-2 w-full">
                      <h2 className="font-semibold text-lg text-gray-900">{item.name}</h2>
                      <p className="text-gray-600 line-clamp-1">{item.description}</p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-gray-900 text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                          className="w-20 text-center border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmDelete({ show: true, itemId: item._id, deleteAll: false })}
                      className="text-red-600 hover:text-red-700 transition ml-4"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => setConfirmDelete({ show: true, itemId: null, deleteAll: true })}
                  className="flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl mx-auto mt-4 transition shadow-lg"
                >
                  <Trash2 size={20} /> Clear Cart
                </button>
              </div>

              <div className="mt-10 flex justify-between items-center p-6 bg-white shadow rounded-xl">
                <span className="text-2xl font-bold text-gray-900">Total: ${total.toFixed(2)}</span>
                <button
                  onClick={handleCheckout}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg"
                  disabled={loading}
                >
                  <CreditCard size={20} /> {loading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Delete Confirmation Popup */}
      {confirmDelete.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete({ show: false, itemId: null, deleteAll: false })}></div>
          <div className="bg-white rounded-2xl shadow-xl p-8 z-50 max-w-sm w-full text-center">
            <p className="text-lg font-semibold mb-6 text-gray-900">
              {confirmDelete.deleteAll
                ? "Are you sure you want to delete all items in your cart?"
                : "Are you sure you want to delete this item?"}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmDelete.deleteAll ? handleDeleteAll() : handleDelete(confirmDelete.itemId)}
                className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete({ show: false, itemId: null, deleteAll: false })}
                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Status Popup */}
      {checkoutStatus.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="bg-white rounded-2xl shadow-xl p-8 z-50 max-w-sm w-full text-center">
            <div className="flex justify-end">
              <button onClick={() => setCheckoutStatus({ show: false, success: false, message: "" })} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className={`text-lg font-semibold mb-4 ${checkoutStatus.success ? "text-green-600" : "text-red-600"}`}>
              {checkoutStatus.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;