import React, { useContext } from 'react'
import './index.css';
import Navbar from './components/Navbar'
import CheckoutNavbar from './components/CheckoutNavbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Fotter'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import Collection from './pages/Collection';
import SearchBar from './components/SearchBar';
import Product from './pages/Product';
import Cart from './pages/Cart';
import CartPopup from './components/CartPopup';
import { ShopContext } from './context/ShopContext';
import PlaceOrder from './pages/PlaceOrder';
import SignUp from './pages/SignUp';

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const isCheckoutPath = useLocation().pathname.includes("place-order");
  const { showUserLogin } = useAppContext()
  const { showCartPopup, setShowCartPopup } = useContext(ShopContext);

  return (
    <div>
      {isSellerPath ? null : isCheckoutPath ? <CheckoutNavbar /> : <Navbar />}
      {isSellerPath || isCheckoutPath ? null : <SearchBar />}
      {showUserLogin ? <Login /> : null}
      {showCartPopup ? <CartPopup onClose={() => setShowCartPopup(false)} /> : null}

      <div className={isSellerPath ? "" : ""}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/Collection' element={<Collection />} />
          <Route path='/Collection/:id' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </div>
      {!isSellerPath && !isCheckoutPath && <Footer />}
    </div>
  )
}

export default App
