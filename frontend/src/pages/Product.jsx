import { useContext, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { ShopContext } from "../context/ShopContext";
import { Link, useParams } from "react-router-dom";
import Title from '../components/Title';
import { assets } from "../assets/assets";
import Toast from '../components/Toast';

const Product = () => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const { navigate } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);

  const product = products.find((item) => item._id === id);

  if (!product) return <div className="p-4 text-[#FFBF00]">Product not found</div>;

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) =>
        product.category === item.category && item._id !== product._id
      );
      productsCopy.sort(() => Math.random() - 0.5);
      setRelatedProducts(productsCopy.slice(0, 4));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowToast(true);
      return;
    }
    console.log("Adding to cart:", { ...product, selectedSize });
    addToCart(product._id, selectedSize);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    // TODO: Implement buy now functionality
    console.log("Buying now:", { ...product, selectedSize });
  };

  const shippingAndReturns = [
    "Free shipping on all orders over $100",
    "Standard shipping (3-5 business days)",
    "Express shipping (1-2 business days)",
    "International shipping available",
    "30-day return policy",
    "Items must be unworn and in original packaging",
    "Return shipping is free for defective items"
  ];

  return product && (
    <div className="mt-12 px-4 md:px-8">
      {showToast && (
        <Toast
          message="Please select a Size!"
          onClose={() => setShowToast(false)}
          type="error"
        />
      )}
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative max-w-3xl w-full mx-4">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src="/src/assets/luvee_SC.png"
              alt="Size Chart"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-black">
        <Link to={"/"} className="hover:text-indigo-500">Home</Link> /
        <Link to={"/Collection"} className="hover:text-[#FFBF00]"> Products</Link> /
        <span className="text-[#1A4C39]"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border max-w-24 border-[#1A4C39] rounded overflow-hidden cursor-pointer hover:border-[#FFBF00] ${thumbnail === image ? 'border-[#FFBF00]' : ''}`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="border border-[#1A4C39] max-w-[500px] rounded overflow-hidden">
            <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="mt-6">
            <p className="text-2xl font-medium"> {currency}{product.price}.00</p>
            <span className="text-[#1A4C39]">(inclusive of all taxes)</span>
          </div>

          <div className="mt-6">
            <p className="text-base font-medium mb-2">Select Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border ${selectedSize === size
                    ? 'border-[#1A4C39] bg-[#1A4C39] text-white'
                    : 'border-[#1A4C39] hover:border-[#FFBF00]'
                    } rounded`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>


          <hr className="mt-5 sm:w-5/5 sm:h-1 border-[#1A4C39]" />
          <p
            className="text-base font-medium mt-3 cursor-pointer hover:text-[#FFBF00]"
            onClick={() => setShowSizeChart(true)}
          >
            Size Chart
          </p>
          <hr className="mt-4 sm:w-5/5 sm:h-1 border-[#1A4C39]" />

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-[#0e1210] hover:bg-[#FFBF00] hover:text-white transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 cursor-pointer font-medium bg-[#1A4C39] text-white hover:bg-[#FFBF00] transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Description and Shipping & Returns */}
      <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 text-sm font-medium ${activeTab === 'description' ? 'bg-[#1A4C39] text-white' : 'hover:bg-gray-50'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`border px-5 py-3 text-sm font-medium ${activeTab === 'shipping' ? 'bg-[#1A4C39] text-white' : 'hover:bg-gray-50'}`}
          >
            Shipping & Returns
          </button>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-4 text-sm text-black">
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4">
              {product.description.split(',').map((sentence, index) => (
                <p key={index} className="flex items-start gap-2">
                  <span className="text-[#1A4C39]">•</span>
                  {sentence.trim()}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {shippingAndReturns.map((item, index) => (
                <p key={index} className="flex items-start gap-2">
                  <span className="text-[#1A4C39]">•</span>
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products*/}

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-2">
            <Title text1={'RELATED'} text2={'COLLECTIONS'} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/Collection/${item._id}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-medium group-hover:text-[#FFBF00]">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{currency}{item.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;