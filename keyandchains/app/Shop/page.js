"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import KeyChainData from "../Data/keychaindata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

const Shop = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); // typed search
  const [appliedSearch, setAppliedSearch] = useState(""); // search applied on click
  const [selectedCategory, setSelectedCategory] = useState(""); // category filter

  // Filter products based on applied search AND selected category
  const filteredProducts = KeyChainData().filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .startsWith(appliedSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="mt-20">
        <header className="flex flex-col justify-center items-center">
          <h1 className="font-extrabold text-[35px] sm:text-[50px] text-gray-900">
            ⚡Step Into the Drop
          </h1>

          {/* Search input and button */}
          <div className="flex sm:flex-row flex-col justify-center items-center mt-5 gap-3">
            <input
              placeholder="Enter Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-700 rounded-[20px] placeholder:text-gray-950
                placeholder:text-center focus:border-gray-800 focus:ring-1 px-4 py-2 sm:w-80 mb-3 sm:mb-0"
            />
            <button
              onClick={() => setAppliedSearch(searchTerm)}
              className="bg-black hover:bg-gray-800 px-6 py-2 text-white 
                font-semibold transition duration-200 rounded-[10px] border-2 border-white
                flex items-center gap-2 cursor-pointer"
            >
              🔍 Search
            </button>
          </div>

          {/* Category heading */}
          <div className="flex items-center gap-2 mt-8">
            <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
              🎨 Choose your category
            </span>
          </div>

          {/* Category buttons */}
          <div className="flex justify-center items-center flex-wrap sm:flex-row gap-4 sm:gap-6 mt-3">
            {[
              "Black",
              "Red",
              "Blue",
              "Classy",
              "Metal",
              "Personalized",
              "Pink",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 font-semibold transition duration-200 rounded-[10px] border-2 border-white flex items-center gap-2 cursor-pointer
                    ${
                      cat.toLowerCase() === selectedCategory.toLowerCase()
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
              >
                {cat === "Black" && "⚫ "}
                {cat === "Red" && "🔴 "}
                {cat === "Blue" && "🔵 "}
                {cat === "Pink" && "🌸 "}
                {cat} {/* Text */}
              </button>
            ))}
            {/* Reset filter */}
            <button
              onClick={() => setSelectedCategory("")}
              className="px-6 py-2 font-semibold transition duration-200 rounded-[10px] border-2 border-white bg-gray-300 hover:bg-gray-400 flex items-center gap-2 cursor-pointer"
            >
              ♻️ All
            </button>
          </div>
        </header>
      </section>

      {/* PRODUCTS GRID */}
      <section className="mt-12 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <p className="text-gray-700 text-lg font-semibold">
              No products found 😢
            </p>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => router.push(`/product/${item.slug}`)}
            >
              <div className="relative w-full h-56">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="object-cover block m-auto"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold mt-8 text-gray-900 text-lg">
                  {item.name}
                </h2>

                <div className="flex items-center gap-2 justify-center mb-2">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <h1 className="text-yellow-400">
                      <Star size={25} />
                    </h1>
                    <p className="text-gray-800 font-semibold">{item.rating}</p>
                  </div>
                </div>

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
          ))
        )}
      </section>
    </>
  );
};

export default Shop;
