import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const CartPopup = ({ onClose }) => {
    const { cartItems, products, currency, removeFromCart, addToCart, getCartTotal, delivery_fee } = useContext(ShopContext);

    const getProductDetails = (itemId) => {
        return products.find(product => product._id === itemId);
    };

    const calculateSubtotal = (price, quantity) => {
        return price * quantity;
    };

    const totalItems = Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
        return total + Object.values(sizes).reduce((sum, quantity) => sum + quantity, 0);
    }, 0);

    const totalAmount = getCartTotal() + delivery_fee;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Shopping Cart ({totalItems})</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {totalItems === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="bg-[#1A4C39] text-white px-6 py-2 rounded hover:bg-[#FFBF00] transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                {Object.entries(cartItems).map(([itemId, sizes]) => {
                                    const product = getProductDetails(itemId);
                                    if (!product) return null;

                                    return Object.entries(sizes).map(([size, quantity]) => (
                                        <div key={`${itemId}-${size}`} className="flex items-center gap-4 py-4 border-b">
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-medium text-sm">{product.name}</h3>
                                                <p className="text-xs text-gray-600">Size: {size}</p>
                                                <p className="text-xs text-gray-600">Price: {currency}{product.price}.00</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(itemId, size)}
                                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => addToCart(itemId, size)}
                                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">
                                                    {currency}{calculateSubtotal(product.price, quantity)}.00
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                })}
                            </div>

                            <div className="border-t pt-4">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{currency}{getCartTotal()}.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span>{currency}{delivery_fee}.00</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{currency}{totalAmount}.00</span>
                                    </div>
                                </div>
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="block w-full bg-[#1A4C39] text-white py-3 text-center rounded hover:bg-[#FFBF00] transition mb-2"
                                >
                                    View Cart
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="block w-full text-[#1A4C39] py-3 text-center hover:text-[#FFBF00] transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPopup; 