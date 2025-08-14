import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const sizes = ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14"];

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToCart, setShowCartPopup } = useContext(ShopContext);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(id, selectedSize);
    setShowCartPopup(true);
    setShowQuickAdd(false);
  };

  return (
    <div className="text-black cursor-pointer relative">
      <div className="relative overflow-hidden group">
        <Link to={`/Collection/${id}`}>
          <img
            className="hover:scale-110 transition ease-in-out w-full"
            src={image[0]}
            alt={name}
          />
        </Link>

        {/* Quick Add Button (hover) */}
        {!showQuickAdd && (
          <button
            onClick={() => setShowQuickAdd(true)}
            className="absolute bottom-0 left-0 w-full h-1/4 bg-[#1A4C39] bg-opacity-70 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Quick Add
          </button>
        )}

        {/* Quick Add Popup (bottom 1/4 of image) */}
        {showQuickAdd && (
          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white bg-opacity-95 flex flex-col items-center justify-center z-20 p-2 shadow-lg">
            <button
              onClick={() => setShowQuickAdd(false)}
              className="absolute top-1 right-2 text-xl font-bold text-[#1A4C39]"
            >
              &times;
            </button>

            <p className="text-xs mb-1">
              Size: <span className="font-medium">{selectedSize}</span>
            </p>

            <div className="grid grid-cols-3 gap-1 text-xs mb-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-2 py-0.5 rounded ${selectedSize === size
                    ? "border-black text-black"
                    : "border-green-900 text-green-950 hover:bg-green-950 hover:text-white"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-1 bg-green-950 text-white text-xs rounded hover:bg-black transition"
            >
              ADD
            </button>
          </div>
        )}
      </div>

      {/* Name and Price */}
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium flex items-center gap-1">
        <span>{currency}</span>
        <span>{price}.00</span>
      </p>
    </div>
  );
};

export default ProductItem;
