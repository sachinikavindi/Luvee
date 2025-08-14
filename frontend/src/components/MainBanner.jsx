import React, { useRef, useEffect, useState } from "react";
import { assets } from "../assets/assets";

const MainBanner = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideImages = [
    assets.hero_img,
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png",
  ];

  const goToSlide = (index) => {
    const slideWidth = window.innerWidth;
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slideImages.length;
    setCurrentSlide(next);
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + slideImages.length) % slideImages.length;
    setCurrentSlide(prev);
    goToSlide(prev);
  };

  useEffect(() => {
    goToSlide(currentSlide);
    const interval = setInterval(nextSlide, 4000);

    const handleResize = () => goToSlide(currentSlide);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden p-0 m-0">
      {/* Image Slider */}
      <div className="absolute inset-0 z-0">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          ref={sliderRef}
          style={{ width: `${slideImages.length * 100}vw` }}
        >
          {slideImages.map((src, index) => (
            <img
              key={index}
              src={src}
              className="w-screen h-full object-cover flex-shrink-0"
              alt={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Overlay Text Content */}
      <div className="relative z-10 h-full flex items-center justify-start px-6 sm:px-16 bg-black/30">
        <div className="font-prata text-white max-w-md">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-white"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className=" text-3xl sm:py-3 lg:text-5xl leading-relaxed font-bold">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">Shop Now</p>
            <p className="w-8 md:w-11 h-[2px] bg-white"></p>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MainBanner;
