import { createContext, useState } from "react";
import { products } from "../assets/assets";
import toast from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'LKR';
    const delivery_fee = 0;
    const [cartItems, setCartItems] = useState({});
    const [showCartPopup, setShowCartPopup] = useState(false);

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
        showCartPopup,
        setShowCartPopup
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
