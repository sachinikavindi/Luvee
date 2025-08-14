import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const PlaceOrder = () => {
    const { cartItems, products, currency, getCartTotal, delivery_fee } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'cod', // Default to Cash on Delivery
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
    };

    const getProductDetails = (itemId) => {
        return products.find(product => product._id === itemId);
    };

    const totalItems = Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
        return total + Object.values(sizes).reduce((sum, quantity) => sum + quantity, 0);
    }, 0);

    const totalAmount = getCartTotal() + delivery_fee;

    return (
        <div className="container mx-auto px-4 py-8">
            <Title text1="PLACE" text2="ORDER" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Left Side - Forms */}
                <div className="space-y-8">
                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={() => handlePaymentMethodChange('cod')}
                                        className="h-4 w-4 text-[#1A4C39] focus:ring-[#1A4C39]"
                                    />
                                    <label htmlFor="cod" className="ml-2 block text-sm font-medium text-gray-700">
                                        Cash on Delivery
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="card"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={() => handlePaymentMethodChange('card')}
                                        className="h-4 w-4 text-[#1A4C39] focus:ring-[#1A4C39]"
                                    />
                                    <label htmlFor="card" className="ml-2 block text-sm font-medium text-gray-700">
                                        Pay by Visa, Master, Debit or Credit Card
                                    </label>
                                </div>
                            </div>

                            {formData.paymentMethod === 'card' && (
                                <div className="mt-4 space-y-4 border-t pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="w-full bg-[#1A4C39] text-white py-3 rounded hover:bg-[#FFBF00] transition mt-4"
                    >
                        {formData.paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                    </button>
                </div>

                {/* Right Side - Order Summary */}
                <div className="lg:col-span-1 bg-[#1A4C39] p-6 rounded-lg">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
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
                                            <h3 className="font-medium">{product.name}</h3>
                                            <p className="text-sm text-gray-600">Size: {size}</p>
                                            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                                            <p className="text-sm font-medium">
                                                {currency}{product.price * quantity}.00
                                            </p>
                                        </div>
                                    </div>
                                ));
                            })}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{currency}{getCartTotal()}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{currency}{totalAmount}.00</span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
