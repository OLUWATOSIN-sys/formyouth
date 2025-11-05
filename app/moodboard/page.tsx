"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MoodboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "men" | "women">("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const menImages = [
    "/man1.jpg",
    "/man2.jpg",
    "/man208323.jpg",
    "/man2123.jpg",
    "/man24240999.jpg",
    "/man24245.jpg",
    "/man243.jpg",
    "/man323241.jpg",
    "/man3242.jpg",
    "/man4.jpg",
    "/man5.jpg",
    "/man6.jpg",
    "/man664.jpg",
    "/man99768.jpg",
  ];

  const womenImages = [
    "/woman066554.jpg",
    "/woman0987.jpg",
    "/woman1.jpg",
    "/woman2.jpg",
    "/woman232.jpg",
    "/woman3232.jpg",
    "/woman34232.jpg",
    "/woman44.jpg",
    "/woman443.jpg",
    "/woman772732323.jpg",
  ];

  const getDisplayImages = () => {
    if (activeTab === "men") return menImages;
    if (activeTab === "women") return womenImages;
    // Return all images without randomization to avoid hydration mismatch
    return [...menImages, ...womenImages];
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Faint Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/MOOD BOARD_design.png")',
          opacity: 0.35,
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 fade-in">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          <div className="float-animation">
            <Image
              src="/logo.png"
              alt="CCC Logo"
              width={80}
              height={80}
              className="mx-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <div className="w-24"></div>
        </div>

        {/* Title */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gold-shimmer">
            MOODBOARD
          </h1>
          <p className="text-xl md:text-2xl text-[#D4AF37] font-semibold mb-2">
            Royal Attire Inspiration
          </p>
          <p className="text-white/70 text-lg">
            Get inspired for the Youth Gala 2025
          </p>
        </div>

        {/* Category Tabs - Responsive */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 fade-in px-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black shadow-lg"
                : "bg-white/10 text-white border-2 border-[#D4AF37]/50 hover:border-[#D4AF37]"
            }`}
          >
            All Looks
          </button>
          <button
            onClick={() => setActiveTab("men")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === "men"
                ? "bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black shadow-lg"
                : "bg-white/10 text-white border-2 border-[#D4AF37]/50 hover:border-[#D4AF37]"
            }`}
          >
            Men's Looks
          </button>
          <button
            onClick={() => setActiveTab("women")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 ${
              activeTab === "women"
                ? "bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black shadow-lg"
                : "bg-white/10 text-white border-2 border-[#D4AF37]/50 hover:border-[#D4AF37]"
            }`}
          >
            Women's Looks
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {getDisplayImages().map((image, index) => (
            <div
              key={`${activeTab}-${image}-${index}`}
              onClick={() => setSelectedImage(image)}
              className="gallery-item group relative overflow-hidden rounded-xl border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50 cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-black">
                <Image
                  src={image}
                  alt={`Royal attire inspiration ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <span className="text-[#FFD700] font-bold text-lg">
                    {image.includes("woman") ? "Women's Look" : "Men's Look"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#FFD700] transition-colors z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container */}
            <div
              className="relative w-full h-full bg-black rounded-xl overflow-hidden border-4 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Royal attire inspiration"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
              
              {/* Image Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                <p className="text-[#FFD700] font-bold text-xl text-center">
                  {selectedImage.includes("woman") ? "Women's Royal Look" : "Men's Royal Look"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
