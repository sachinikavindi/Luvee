import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const sizes = ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14"];

const QuickAddModal = ({ onClose, product }) => {
  const [selectedSize, setSelectedSize] = React.useState("");
  const { addToCart, setShowCartPopup } = useContext(ShopContext);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product._id, selectedSize);
    setShowCartPopup(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 w-[90%] max-w-xs relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
          <p className="text-sm mb-3">Size: <span className="font-semibold">{selectedSize}</span></p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border px-4 py-1 text-sm transition-colors ${selectedSize === size
                  ? "border-black text-black bg-gray-100"
                  : "border-green-900 text-green-950 hover:bg-gray-50"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
