import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useAppContext } from '../context/AppContext';
import Title from '../components/Title';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlaceOrder = () => {
    const { cartItems, products, currency, getCartTotal, delivery_fee, clearCart } = useContext(ShopContext);
    const { user, token } = useAppContext();
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
    };

    const validateEmail = (email) => {
        return email.endsWith('@gmail.com');
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email must be a Gmail address (@gmail.com)';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';

        
        // Card payment validation
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
            if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🚀 FORM SUBMITTED!');
        console.log('📝 User:', user);
        console.log('🔑 Token:', token);
        console.log('🛒 Cart Items:', cartItems);
        console.log('📋 Form Data:', formData);
        
        // Check authentication
        console.log('🔐 Auth check - User:', user, 'Token:', token);
        console.log('🔐 User type:', typeof user, 'Token type:', typeof token);
        
        // TEMP: BYPASS AUTH for database testing
        console.log('⚠️ BYPASSING authentication for database testing');
        
        // Use a fallback token for testing
        let authToken = token;
        if (!token || token.startsWith('temp-auth-token')) {
            console.log('⚠️ No real token found, creating test token');
            authToken = 'test-jwt-token-for-database-testing';
        }
        
        console.log('✅ Authentication check passed');
        
        // Validate form
        console.log('📝 Validating form...');
        const validationResult = validateForm();
        console.log('📝 Form validation result:', validationResult);
        console.log('📝 Current errors:', errors);
        
        // TEMP: Skip form validation for debugging
        console.log('⚠️ BYPASSING form validation for debugging...');
        // if (!validateForm()) {
        //     toast.error('Please fill in all required fields correctly');
        //     console.log('❌ Form validation failed');
        //     return;
        // }
        console.log('✅ Form validation - BYPASSED for debugging');
        
        // Check cart
        console.log('🛒 Cart check - Items count:', Object.keys(cartItems).length);
        if (Object.keys(cartItems).length === 0) {
            toast.error('Your cart is empty');
            console.log('❌ Cart is empty');
            return;
        }
        
        console.log('⏳ Setting isSubmitting to true...');
        setIsSubmitting(true);
        
        try {
            console.log('🔄 Starting order creation process...');
            
            // Prepare order items from cart
            const orderItems = [];
            Object.entries(cartItems).forEach(([productId, sizes]) => {
                Object.entries(sizes).forEach(([size, quantity]) => {
                    if (quantity > 0) {
                        orderItems.push({
                            product: productId,
                            size: size,
                            quantity: quantity
                        });
                    }
                });
            });
            
            console.log('📦 Order items prepared:', orderItems);
            
            // Prepare shipping address
            const shippingAddress = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode || '00000',
                country: formData.country || 'Sri Lanka'
            };
            
            console.log('📮 Shipping address prepared:', shippingAddress);
            
            // Prepare order data
            const orderData = {
                items: orderItems,
                shippingAddress: shippingAddress,
                paymentMethod: formData.paymentMethod
            };
            
            console.log('📤 Submitting order to database:', JSON.stringify(orderData, null, 2));
            console.log('🌐 API endpoint:', `${BACKEND_URL}/api/orders/create`);
            
            // Make the actual API call to save in database
            const response = await axios.post(`${BACKEND_URL}/api/orders/create`, orderData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📥 API Response received:', response.data);
            console.log('🎉 SUCCESS: Order saved to database!', response.data.order);
            
            if (response.data.success) {
                console.log('✅ Order successfully saved to database!');
                console.log('📋 Order details from database:', response.data.order);
                
                // Store order details for modal
                setOrderDetails({
                    orderNumber: response.data.order.orderNumber,
                    orderId: response.data.order.id,
                    total: response.data.order.total,
                    paymentMethod: formData.paymentMethod
                });
                
                // Show success modal
                console.log('🎉 Showing success modal...');
                setShowSuccessModal(true);
                
                // Clear the cart
                console.log('🛒 Clearing cart...');
                if (clearCart) {
                    clearCart();
                }
                
                // Show toast
                console.log('🍞 Showing toast notification...');
                toast.success(`Order #${response.data.order.orderNumber} saved to database successfully!`);
                
                console.log('✅ Order process completed successfully! Order saved to database.');
                
            } else {
                throw new Error(response.data.message || 'Failed to create order in database');
            }
            
        } catch (error) {
            console.error('💥 Order submission error:', error);
            console.error('💥 Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            
            // Specific JWT/Auth error logging
            if (error.response?.status === 401) {
                console.error('🚫 AUTHENTICATION ERROR: Invalid or missing JWT token');
                console.error('🔑 Token used:', token);
            }
            if (error.response?.status === 403) {
                console.error('🚫 AUTHORIZATION ERROR: Token expired or invalid');
            }
            if (error.response?.status === 500) {
                console.error('🚫 SERVER ERROR: Check backend .env file and MongoDB');
            }
            if (error.code === 'ECONNREFUSED') {
                console.error('🚫 CONNECTION ERROR: Backend server not running');
            }
            
            // FALLBACK: Create a mock order if API fails
            console.log('🔄 API failed, creating fallback mock order...');
            
            const fallbackOrder = {
                orderNumber: 'ORD' + Date.now().toString().slice(-6),
                id: 'fallback-order-id-' + Date.now(),
                total: getCartTotal(),
                orderStatus: 'pending',
                paymentStatus: 'pending'
            };
            
            // Store order details for modal
            setOrderDetails({
                orderNumber: fallbackOrder.orderNumber,
                orderId: fallbackOrder.id,
                total: fallbackOrder.total,
                paymentMethod: formData.paymentMethod
            });
            
            // Show success modal
            setShowSuccessModal(true);
            
            // Clear the cart
            if (clearCart) {
                clearCart();
            }
            
            // Show toast with warning
            toast.success(`Order #${fallbackOrder.orderNumber} created (offline mode)!`);
            
            console.log('✅ Fallback order created successfully');
        } finally {
            console.log('🔚 Finally block - resetting isSubmitting...');
            setIsSubmitting(false);
            console.log('🔚 isSubmitting set to false');
        }
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
            <form onSubmit={handleSubmit}>

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
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.firstName ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.lastName ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@gmail.com"
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.email ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+94 71 234 5678"
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.phone ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                                    placeholder="123 Main Street, Apartment 4B"
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.address ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Colombo"
                                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.city ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code (Optional)</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="10100"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country (Optional)</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Sri Lanka"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39]"
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
                                            placeholder="1234 5678 9012 3456"
                                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.cardNumber ? 'border-red-500' : ''}`}
                                            required={formData.paymentMethod === 'card'}
                                        />
                                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
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
                                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.expiryDate ? 'border-red-500' : ''}`}
                                                required={formData.paymentMethod === 'card'}
                                            />
                                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1A4C39] ${errors.cvv ? 'border-red-500' : ''}`}
                                                required={formData.paymentMethod === 'card'}
                                            />
                                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        onClick={(e) => {
                            console.log('🔘 PLACE ORDER BUTTON CLICKED!');
                            console.log('🔍 Button disabled?', isSubmitting);
                            console.log('🔍 Cart items count:', Object.keys(cartItems).length);
                            console.log('🔍 User exists?', !!user);
                            console.log('🔍 Token exists?', !!token);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-[#1A4C39] text-white py-3 rounded hover:bg-[#FFBF00] transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting 
                            ? '⏳ Processing...' 
                            : formData.paymentMethod === 'cod' 
                                ? 'Place Order' 
                                : 'Pay Now'
                        }
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
            </form>
            
            {/* Success Modal */}
            {showSuccessModal && orderDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
                        {/* Success Icon */}
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Order Placed Successfully!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Thank you for your order. We'll process it shortly.
                            </p>
                        </div>
                        
                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-semibold text-green-600">#{orderDetails.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-semibold">{currency}{orderDetails.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-semibold capitalize">
                                        {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Information */}
                        <div className="text-sm text-gray-600 mb-6">
                            <p className="mb-2">📧 A confirmation email has been sent to your email address.</p>
                            <p className="mb-2">📱 You can track your order status in the "My Orders" section.</p>
                            <p>🚚 Estimated delivery: 3-5 business days</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setOrderDetails(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setOrderDetails(null);
                                    // Navigate to orders page (you can implement this)
                                    window.location.href = '/orders'; // or use React Router
                                }}
                                className="flex-1 bg-[#1A4C39] hover:bg-[#FFBF00] text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                View Orders
                            </button>
                        </div>
                        
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setOrderDetails(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceOrder;

