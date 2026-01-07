"use client";

import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import KeyChainData from "../../Data/keychaindata";
import Image from "next/image";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductPage = () => {
  const { slug } = useParams();
  const product = KeyChainData().find((item) => item.slug === slug);

  if (!product) return <p className="text-center mt-10">Product not found!</p>;

  return (
    <>
      <Navbar />

      <section className="bg-transparent min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* PRODUCT TITLE */}
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-gray-900">{product.name}</h1>

          {/* SWIPER GALLERY */}
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
            }}
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

          {/* PRICE & ACTION BUTTONS */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">{product.currency} {product.finalPrice}</span>
                  <span className="line-through text-gray-400">{product.currency} {product.price}</span>
                  <span className="text-green-600 font-semibold">-{product.discount}%</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">{product.currency} {product.finalPrice}</span>
              )}
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
                Buy Now
              </button>
              <button className="px-6 py-3 border border-gray-400 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition">
                Add to Cart
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* TAGS */}
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

          {/* REVIEWS */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Customer Reviews ({product.reviewsCount})
            </h2>
            <div className="flex flex-col gap-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50/50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <span className="text-yellow-500 font-bold">{'★'.repeat(review.rating)}</span>
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
