import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext, useAppContext } from '../context/AppContext'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin, navigate } = useAppContext()
    const { getCartItemCount } = useContext(ShopContext)

    const logout = async () => {
        setUser(null);
        navigate('/')
    }

    const { setShowSearch } = useContext(AppContext);
    return (
        <nav class="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-white transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img class="h-9" src={assets.logo} alt="dummyLogoWhite" />
            </NavLink>

            <ul class="text-[#1A4C39] md:flex hidden items-center space-x-20">
                <NavLink to='/' className="hover:text-[#FFBF00] transition">Home</NavLink>
                <NavLink to='/Collection' className="hover:text-[#FFBF00] transition">Collection</NavLink>
                <NavLink to='/about' className="hover:text-[#FFBF00] transition">About</NavLink>
                <NavLink to='/contact' className="hover:text-[#FFBF00] transition">Contact</NavLink>

            </ul>
            <div class="flex items-center gap-4">
                <img
                    onClick={() => {
                        setShowSearch(prev => !prev);
                    }}
                    src={assets.search_icon}
                    alt="search"
                    class="w-5 cursor-pointer hover:opacity-70 transition-opacity"
                />

                <Link to="/cart" className='relative'>
                    <img src={assets.cart_icon} alt="cart" class="w-5 min-w-5 cursor-pointer" />
                    {getCartItemCount() > 0 && (
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-green-950 text-white rounded-full text-[8px]'>
                            {getCartItemCount()}
                        </p>
                    )}
                </Link>

                {!user ? (
                    <button onClick={() => setShowUserLogin(true)} type="button" class="bg-green-950 text-white md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 gap-2 rounded-full">
                        Login
                    </button>) :
                    (
                        <div className='group relative'>
                            <img src={assets.profile_icon} alt="myprofile" class="w-5 cursor-pointer" />
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-green-950 text-white rounded'>
                                    <p className='cursor-pointer hover:text-orange-300 '>My Profile</p>
                                    <p onClick={() => navigate("Orders")} className='cursor-pointer hover:text-orange-300 '>My Orders</p>
                                    <p onClick={logout} className='cursor-pointer hover:text-orange-300 '>Logout</p>

                                </div>
                            </div>
                        </div>

                    )}

            </div>




            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className='sm:hidden' >
                <img src={assets.menu_icon} alt='menu' />
            </button>

            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden `}>
                    <NavLink to="/" onClick={() => setOpen(false)}> Home</NavLink>
                    <NavLink to="/Collection" onClick={() => setOpen(false)}> Collections</NavLink>
                    <NavLink to="/about" onClick={() => setOpen(false)}> About</NavLink>
                    {user &&
                        <NavLink to="/Product" onClick={() => setOpen(false)}>My Orders </NavLink>
                    }
                    <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

                    {!user ? (
                        <button onClick={() => {
                            setOpen(false);
                            setShowUserLogin(true);
                        }} className="cursor-pointer px-6 py-2 mt-2 bg-green-950 hover:bg-orange-300 transition text-white rounded-full text-sm">
                            Login
                        </button>
                    ) : (
                        <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-green-950 hover:bg-orange-300 transition text-white rounded-full text-sm">
                            LogOut
                        </button>
                    )}

                </div>)}
        </nav>

    )
}

export default Navbar
