import React, { useState, useContext, useEffect } from 'react';
import { AppContext, useAppContext } from '../context/AppContext'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link } from "react-router-dom";
import QuickAddModal from "../components/QuickAddModal";

const Collection = () => {
  const { products, currency } = useContext(ShopContext);
  const { search, showSearch } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sortType, setSortType] = useState('relavent')
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSizes = (e) => {
    if (sizes.includes(e.target.value)) {
      setSizes(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSizes(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    //search
    if (search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    // Apply size filter
    if (sizes.length > 0) {
      productsCopy = productsCopy.filter(item =>
        item.sizes.some(size => sizes.includes(size))
      );
    }

    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;

    }
  }
  // Initial load of products

  // Apply filters when category, sizes, or search changes
  useEffect(() => {
    applyFilter();
  }, [category, sizes, search]);

  useEffect(() => {
    sortProduct();
  }, [sortType])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setShowQuickAdd(true);
  };

  return (
    <div className='mt-3 flex flex-col sm:flex-row gap-1 sm:gap-10'>


      {/* Filter option */}

      <div className='min-w-60 p-4'>

        {/* path */}

        <div class="flex flex-wrap  space-x-2 text-sm text-green-950 font-medium">
          <a href="/">Home</a>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1" />
          </svg>
          <a href="#">Collection</a>
        </div>

        <div className=' mt-5 border-t-2 border-green-950'></div>

        <p
          className='my-2 text-xl flex items-center cursor-pointer gap-x-2'
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS
          <span className="sm:hidden">{showFilter ? '▼' : '▶'}</span>
        </p>

        <div className={`border border-green-950 pl-5 py-3 mt-6 ${showFilter ? 'block' : 'hidden'} sm:block`}>
          {/* Add your filter options here */}
          <div className="space-y-4">
            <div>
              <p className='mb-3 text-sm font-medium '>CATEGORIES</p>
              <div className='flex flex-col gap 2 text-sm font-light text-green-950'>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'TOP'} onChange={toggleCategory} />TOP
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'DRESSES'} onChange={toggleCategory} />DRESSES
                </p>
              </div>
            </div>

          </div>
        </div>

        {/*Size filter*/}

        <div className={`border border-green-950 pl-5 py-3 my-5 ${showFilter ? 'block' : 'hidden'} sm:block`}>
          {/* Add your filter options here */}
          <div className="space-y-4">
            <div>
              <p className='mb-3 text-sm font-medium '>SIZE</p>
              <div className='flex flex-col gap 2 text-sm font-light text-green-950'>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'XS'} onChange={toggleSizes} />XS
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'S'} onChange={toggleSizes} />S
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'M'} onChange={toggleSizes} />M
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'L'} onChange={toggleSizes} />L
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type='checkbox' value={'XL'} onChange={toggleSizes} />XL
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="flex-1 p-4">
        <div className='flex justify-between text-base sm:text-4xl'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/*product sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-green-950 text-sm px-2 mb-3'>
            <option value="relevent">Sort by:Relavent</option>
            <option value="low-high">Sort by:Low to High</option>
            <option value="high-low">Sort by:High to Low</option>
          </select>


        </div>
        <div className='  border-t border-green-950 mb-8'></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {currentItems.map((item) => (
            <div key={item._id} className="text-black cursor-pointer relative">
              <div className="relative overflow-hidden group">
                <Link to={`/Collection/${item._id}`}>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="h-full w-full object-cover object-center hover:scale-110 transition ease-in-out"
                  />
                </Link>

                {/* Quick Add Button (hover) */}
                <button
                  onClick={() => handleQuickAdd(item)}
                  className="absolute bottom-0 left-0 w-full h-1/4 bg-black bg-opacity-70 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Quick Add
                </button>
              </div>

              {/* Name and Price */}
              <div className="mt-4">
                <h3 className="text-sm text-gray-700">{item.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {currency}{item.price}.00
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12 mb-8">
            <div className="text-sm text-green-950 mb-2">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filterProducts.length)} of {filterProducts.length} products
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 border-2 border-green-950 rounded-md transition-all duration-200 ${currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-950 hover:text-white active:scale-95'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = currentPage === pageNumber;
                  const isNearCurrentPage =
                    Math.abs(pageNumber - currentPage) <= 1 ||
                    pageNumber === 1 ||
                    pageNumber === totalPages;

                  if (!isNearCurrentPage) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return <span key={pageNumber} className="px-2">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-w-[2.5rem] h-10 flex items-center justify-center border-2 rounded-md transition-all duration-200 ${isCurrentPage
                        ? 'bg-green-950 text-white border-green-950'
                        : 'border-green-950 hover:bg-green-50 active:scale-95'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 border-2 border-green-950 rounded-md transition-all duration-200 ${currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-950 hover:text-white active:scale-95'
                  }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {showQuickAdd && selectedProduct && (
        <QuickAddModal
          onClose={() => {
            setShowQuickAdd(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

export default Collection

