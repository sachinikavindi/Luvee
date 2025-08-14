import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import QuickAddModal from "./QuickAddModal";

const BestSeller = () => {
    const { products, currency } = useContext(ShopContext);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Get the first 4 products as best sellers (you can modify this logic based on your needs)
    const bestSellers = products.slice(0, 4);

    const handleQuickAdd = (product) => {
        setSelectedProduct(product);
        setShowQuickAdd(true);
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-8">
                <Title text1="BEST" text2="SELLERS" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {bestSellers.map((item) => (
                    <div key={item._id} className="text-black cursor-pointer relative">
                        <div className="relative overflow-hidden group">
                            <Link to={`/Collection/${item._id}`}>
                                <img
                                    src={item.image[0]}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center hover:scale-110 transition ease-in-out"
                                />
                            </Link>

                            {/* Quick Add Button (hover) */}
                            <button
                                onClick={() => handleQuickAdd(item)}
                                className="absolute bottom-0 left-0 w-full h-1/4 bg-black bg-opacity-70 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                Quick Add
                            </button>
                        </div>

                        {/* Name and Price */}
                        <div className="mt-4">
                            <h3 className="text-sm text-gray-700">{item.name}</h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">
                                {currency}{item.price}.00
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {showQuickAdd && selectedProduct && (
                <QuickAddModal
                    onClose={() => {
                        setShowQuickAdd(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default BestSeller;