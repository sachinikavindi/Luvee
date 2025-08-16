import { useState, useEffect } from 'react'
import axios from 'axios'

// Environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function List() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    price: '',
    sizes: [],
    bestseller: false
  })

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BACKEND_URL}/api/products/list`)
        
        if (response.data.success) {
          setProducts(response.data.products)
          setError(null)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.response?.data?.message || 'Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Active' && product.bestseller) ||
                         (statusFilter === 'Inactive' && !product.bestseller)
    
    return matchesSearch && matchesStatus
  })

  // Delete product function
  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) return
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Authentication required. Please login again.')
        return
      }

      const response = await axios.delete(`${BACKEND_URL}/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          productId: productId
        }
      })
      
      if (response.data.success) {
        // Remove product from local state
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId))
        alert('Product deleted successfully!')
      } else {
        alert('Failed to delete product: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.')
      } else if (err.response?.status === 403) {
        alert('You do not have permission to delete products.')
      } else {
        alert('Failed to delete product: ' + (err.response?.data?.message || 'Network error'))
      }
    }
  }

  // Edit product functions
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setEditFormData({
      price: product.price.toString(),
      sizes: [...(product.sizes || [])],
      bestseller: product.bestseller || false
    })
    setShowEditModal(true)
  }

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSizeToggle = (size) => {
    setEditFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Authentication required. Please login again.')
        return
      }

      // Validation
      if (!editFormData.price || parseFloat(editFormData.price) <= 0) {
        alert('Please enter a valid price.')
        return
      }

      if (editFormData.sizes.length === 0) {
        alert('Please select at least one size.')
        return
      }

      const updateData = {
        price: parseFloat(editFormData.price),
        sizes: JSON.stringify(editFormData.sizes), // Backend expects JSON string
        bestseller: editFormData.bestseller.toString() // Backend expects string
      }

      const response = await axios.put(`${BACKEND_URL}/api/products/${editingProduct._id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        // Update product in local state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === editingProduct._id 
              ? { ...product, ...updateData }
              : product
          )
        )
        setShowEditModal(false)
        setEditingProduct(null)
        alert('Product updated successfully!')
      } else {
        alert('Failed to update product: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error updating product:', err)
      console.error('Error response:', err.response)
      
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.')
      } else if (err.response?.status === 403) {
        alert('You do not have permission to update products.')
      } else if (err.response?.status === 400) {
        alert('Invalid data: ' + (err.response?.data?.message || 'Bad request'))
      } else if (err.response?.status === 404) {
        alert('Product not found. It may have been deleted.')
      } else if (err.response?.status === 500) {
        alert('Server error: ' + (err.response?.data?.message || 'Internal server error'))
      } else if (err.message.includes('JSON')) {
        alert('Server response error. Please check backend logs and try again.')
      } else {
        alert('Failed to update product: ' + (err.response?.data?.message || err.message || 'Network error'))
      }
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingProduct(null)
    setEditFormData({
      price: '',
      sizes: [],
      bestseller: false
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage all your store products</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search products..." 
            />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Add Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={product.image && product.image[0] ? product.image[0] : '/placeholder-image.png'} 
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png'
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    LKR {product.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes && product.sizes.map((size, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.bestseller ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.bestseller ? 'Bestseller' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter !== 'All' ? 'No products match your search criteria.' : 'No products found. Add some products to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Product: {editingProduct.name}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Image and Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={editingProduct.image && editingProduct.image[0] ? editingProduct.image[0] : '/placeholder-image.png'} 
                    alt={editingProduct.name}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{editingProduct.name}</h4>
                    <p className="text-sm text-gray-600">{editingProduct.category}</p>
                  </div>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => handleEditFormChange('price', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Sizes Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Sizes *
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {['L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'].map((size) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                  {editFormData.sizes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {editFormData.sizes.join(', ')}
                    </p>
                  )}
                </div>

                {/* Bestseller Status */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.bestseller}
                      onChange={(e) => handleEditFormChange('bestseller', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Bestseller</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Bestseller products are featured prominently in the store
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProduct}
                    className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Update Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
