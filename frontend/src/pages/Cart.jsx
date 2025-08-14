import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import Title from '../components/Title';

const Cart = () => {
  const navigate = useNavigate();
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

  const handleRemoveItem = (itemId, size) => {
    removeFromCart(itemId, size);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title text1="SHOPPING" text2="CART" />

      {totalItems === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link
            to="/Collection"
            className="inline-block bg-[#1A4C39] text-white px-6 py-3 rounded hover:bg-[#FFBF00] transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({totalItems})</h2>
              <div className="space-y-4">
                {Object.entries(cartItems).map(([itemId, sizes]) => {
                  const product = getProductDetails(itemId);
                  if (!product) return null;

                  return Object.entries(sizes).map(([size, quantity]) => (
                    <div key={`${itemId}-${size}`} className="flex items-center gap-4 py-4 border-b">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">Size: {size}</p>
                        <p className="text-sm text-gray-600">Price: {currency}{product.price}.00</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(itemId, size)}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => addToCart(itemId, size)}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="font-medium">
                          {currency}{calculateSubtotal(product.price, quantity)}.00
                        </p>
                        <button
                          onClick={() => handleRemoveItem(itemId, size)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency}{getCartTotal()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{currency}{delivery_fee}.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{currency}{totalAmount}.00</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/place-order')}
                  className="w-full bg-[#1A4C39] text-white py-3 rounded hover:bg-[#FFBF00] transition"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/Collection"
                  className="block text-center text-[#1A4C39] hover:text-[#FFBF00] transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
