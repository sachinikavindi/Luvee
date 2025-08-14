import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';

const CheckoutNavbar = () => {
    return (
        <div className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-12" />
                    </Link>
                    <Link to="/cart">
                        <img src={cart_icon} alt="Cart" className="h-8" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutNavbar; 