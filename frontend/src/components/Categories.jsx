import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {

    const {navigate} = useAppContext()
  return (
    <div className="text-center px-6 sm:px-12 py-10 bg-white">
      <h1 className="text-3xl sm:text-5xl  font-bold text-black font-sans mb-4">
        Sri Lanka’s Finest Fashion for Women
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed font-sans">
        Turn heads with timeless styles crafted for elegance and ease. Where modern trends meet everyday comfort — discover your signature look today.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 sm:ml-0 md:grid-cols-3 lg:grid-cols-4 gap-6 ml-50 mt-6">
  {categories.map((category, index) => (
    <div
      key={index}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 
      flex flex-col items-center"
      onClick={() => {
        navigate(`/${category.path.toLowerCase()}`);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
      }}
    >
      <img
        className="rounded-md max-h-70 w-full object-cover"
        src={category.image}
        alt={category.text}
      />
      <p className="text-gray-900 text-base font-semibold mt-3">{category.text}</p>
    </div>
  ))}
</div>
    </div>
  );
};

export default Categories;
