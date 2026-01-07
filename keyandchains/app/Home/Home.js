"use client";

import Navbar from "@/app/components/Navbar";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Home_ = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-transparent py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Premium Keys &{" "}
              <span className="text-gray-700">Designer Keychains</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              Discover premium-quality keys and handcrafted keychains designed
              for durability, style, and everyday elegance. Perfect for homes,
              vehicles, and gifting.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/Shop")}
                className="px-6 py-3 bg-black cursor-pointer text-white rounded-lg hover:bg-gray-800 transition"
              >
                Shop Now
              </button>

              <button
                onClick={() => router.push("/categories")}
                className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                View Categories
              </button>
            </div>
          </div>

          {/* RIGHT IMAGES */}

          {/* 🔹 DESKTOP GRID (lg+) */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/banner1.webp"
                alt="Metal keychain"
                width={200}
                height={200}
                className="object-cover"
              />
            </div>

            <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/banner2.webp"
                alt="Luxury keychain"
                width={200}
                height={200}
                className="object-cover"
              />
            </div>

            <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg col-span-2">
              <Image
                src="/banner3.webp"
                alt="Keys with keychains"
                width={200}
                height={200}
                className="object-cover block m-auto"
              />
            </div>
          </div>

          {/* 🔹 MOBILE / TABLET SWIPER */}
          <div className="lg:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop
              className="rounded-xl"
            >
              {["/banner1.webp", "/banner2.webp", "/banner3.webp"].map(
                (img, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={img}
                        alt={`Keychain ${index + 1}`}
                        width={200}
                        height={200}
                        className="object-cover block m-auto"
                      />
                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home_;
