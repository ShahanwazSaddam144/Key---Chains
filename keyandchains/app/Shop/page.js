"use client";

import React from "react";
import Navbar from "../components/Navbar";
import KeyChainData from "../Data/keychaindata"; 
import Image from "next/image";
import { useRouter } from "next/navigation";

const Shop = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="mt-20">
        <header className="flex flex-col justify-center items-center">
          <h1 className="font-extrabold text-[35px] sm:text-[50px] text-gray-900">
            ⚡Step Into the Drop
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
            <button
              className="bg-black hover:bg-gray-800 px-6 py-2 text-white 
                font-semibold transition duration-200 rounded-[10px] border-2 border-white
                cursor-pointer"
            >
              KeyChains
            </button>
            <button
              className="bg-black hover:bg-gray-800 px-6 py-2 text-white 
                font-semibold transition duration-200 rounded-[10px] border-2 border-white
                cursor-pointer"
            >
              Straps
            </button>
            <input
              placeholder="Enter Search Products"
              className="border border-gray-700 rounded-[20px] placeholder:text-gray-950
              placeholder:text-center focus:border-gray-800 focus:ring-1 px-4 py-2 sm:w-80"
            />
          </div>
        </header>
      </section>

      {/* PRODUCTS GRID */}
      <section className="mt-12 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {KeyChainData().map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => router.push(`/product/${item.slug}`)}
          >
            {/* Product Image */}
            <div className="relative w-full h-56">
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="object-cover block m-auto"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-gray-900 text-lg">
                {item.name}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Shop;
