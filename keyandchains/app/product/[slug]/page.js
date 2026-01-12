"use client";

import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import KeyChainData from "../../Data/keychaindata";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductPage = () => {
  const { slug } = useParams();
  const product = KeyChainData().find((item) => item.slug === slug);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loginPopup, setLoginPopup] = useState(false);

  /* ======================
     FETCH CURRENT USER
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
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!product) return <p className="text-center mt-10">Product not found!</p>;

  /* ======================
     ADD TO CART
  ====================== */
  const handleAddToCart = async (redirect = false) => {
    if (!user) {
      setLoginPopup(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.finalPrice,
          description: product.description,
          userEmail: user.email
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({
          show: true,
          type: "success",
          message: "✅ Product added to cart!",
        });
        if (redirect) router.push("/Cart");
      } else {
        setAlert({
          show: true,
          type: "error",
          message: data.message || "Failed to add product",
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "❌ Server error. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ======================
          LOGIN REQUIRED POPUP
      ====================== */}
      {loginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setLoginPopup(false)}
          ></div>

          <div className="bg-white rounded-2xl shadow-xl p-6 z-50 max-w-sm w-full text-center animate-scale-in">
            <h2 className="text-2xl font-bold mb-2">🔒 Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to continue shopping
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/Login")}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
              <button
                onClick={() => setLoginPopup(false)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================
          ALERT POPUP
      ====================== */}
      {alert.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setAlert({ ...alert, show: false })}
          ></div>

          <div className="bg-white rounded-xl shadow-lg p-6 z-50 max-w-sm w-full text-center">
            <p
              className={`text-lg font-semibold mb-4 ${
                alert.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {alert.message}
            </p>
            <button
              onClick={() => setAlert({ ...alert, show: false })}
              className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================
          PRODUCT UI
      ====================== */}
      <section className="bg-transparent min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-gray-900">
            {product.name}
          </h1>

          {/* Product gallery */}
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
            className="mb-6"
          >
            {product.gallery.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    width={200}
                    height={200}
                    className="object-cover block m-auto"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Price + Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    {product.currency} {product.finalPrice}
                  </span>
                  <span className="line-through text-gray-400">
                    {product.currency} {product.price}
                  </span>
                  <span className="text-green-600 font-semibold">
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {product.currency} {product.finalPrice}
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleAddToCart(true)}
                className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
              >
                {loading ? "Adding..." : "Buy Now"}
              </button>

              <button
                onClick={() => handleAddToCart(false)}
                className="px-6 py-3 border border-gray-400 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Customer Reviews ({product.reviewsCount})
            </h2>

            <div className="flex flex-col gap-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{review.name}</h3>
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
