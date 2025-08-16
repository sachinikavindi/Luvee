import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'LKR';
    const delivery_fee = 0;
    const [cartItems, setCartItems] = useState({});
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Backend URL
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    // Fetch products from database
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/api/products/list`);
            
            if (response.data.success) {
                setProducts(response.data.products);
                setError(null);
            } else {
                setError('Failed to fetch products');
                toast.error('Failed to load products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Failed to connect to server');
            toast.error('Failed to load products. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    const addToCart = (itemId, size) => {


        console.log('Adding to cart:', { itemId, size });
        if (!itemId || !size) {
            console.error('Item ID and size are required');
            return;
        }

        setCartItems(prevCart => {
            console.log('Previous cart:', prevCart);
            const cartData = { ...prevCart };

            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                } else {
                    cartData[itemId][size] = 1;
                }
            } else {
                cartData[itemId] = { [size]: 1 };
            }

            console.log('Updated cart:', cartData);
            return cartData;
        });
        setShowCartPopup(true);
    };

    const removeFromCart = (itemId, size) => {
        console.log('Removing from cart:', { itemId, size });
        setCartItems(prevCart => {
            console.log('Previous cart:', prevCart);
            const cartData = { ...prevCart };

            if (cartData[itemId] && cartData[itemId][size]) {
                if (cartData[itemId][size] > 1) {
                    cartData[itemId][size] -= 1;
                } else {
                    delete cartData[itemId][size];
                    if (Object.keys(cartData[itemId]).length === 0) {
                        delete cartData[itemId];
                    }
                }
            }

            console.log('Updated cart:', cartData);
            return cartData;
        });
    };

    const getCartTotal = () => {
        let total = 0;
        Object.entries(cartItems).forEach(([itemId, sizes]) => {
            const product = products.find(p => p._id === itemId);
            if (product) {
                Object.entries(sizes).forEach(([size, quantity]) => {
                    total += product.price * quantity;
                });
            }
        });
        console.log('Cart total:', total);
        return total;
    };

    const getCartItemCount = () => {
        let count = 0;
        Object.values(cartItems).forEach(sizes => {
            Object.values(sizes).forEach(quantity => {
                count += quantity;
            });
        });
        console.log('Cart item count:', count);
        return count;
    };

    const clearCart = () => {
        setCartItems({});
    };

    // Log cart items whenever they change
    console.log('Current cart items:', cartItems);

    const value = {
        products,
        currency,
        delivery_fee,
        cartItems,
        addToCart,
        removeFromCart,
        getCartTotal,
        getCartItemCount,
        clearCart,
        showCartPopup,
        setShowCartPopup,
        loading,
        error,
        fetchProducts
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
