"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const images = [
  "/banner1.webp",
  "/banner2.webp",
  "/banner3.webp",
];

export default function Home_() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);

  // Auto change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-transparent py-16 mt-18">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Premium Keys &{" "}
              <span className="text-gray-700">Designer Keychains</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              Discover premium-quality keys and handcrafted keychains designed
              for durability, style, and everyday elegance.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/Shop")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Shop Now
              </button>

              <button
                onClick={() => router.push("/categories")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                View Categories
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center items-center">
            <div className="w-72 h-72 rounded-full overflow-hidden shadow-lg transition-all duration-700">
              <Image
                src={images[currentImage]}
                alt="Keychain"
                width={200}
                height={200}
                className="object-cover block m-auto mt-8"
                priority
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
