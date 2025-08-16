import { useState } from 'react'

function Add() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [], // Array to store selected sizes
    bestSeller: false, // Best seller checkbox
    images: Array(5).fill(null) // Initialize with 5 null values
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Get backend URL from environment variables
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageChange = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.map((img, i) => i === index ? file : img)
      }))
      setMessage('')
    } else if (file) {
      setMessage('Please select a valid image file')
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? null : img)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Basic validation
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields')
      }

      if (formData.sizes.length === 0) {
        throw new Error('Please select at least one size')
      }

      const validImages = formData.images.filter(img => img !== null)
      if (validImages.length === 0) {
        throw new Error('Please select at least one image')
      }

      // Create FormData for image uploads
      const formDataToSend = new FormData()
      
      // Add product data fields directly (matching backend expectations)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('sizes', JSON.stringify(formData.sizes))
      formDataToSend.append('bestseller', formData.bestSeller)
      
      // Add images with correct field names
      validImages.forEach((image, index) => {
        if (index === 0) formDataToSend.append('image1', image)
        if (index === 1) formDataToSend.append('image2', image)
        if (index === 2) formDataToSend.append('image3', image)
        if (index === 3) formDataToSend.append('image4', image)
      })

      // Get authentication token
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('Authentication required. Please login again.')
      }

      console.log('Sending request to:', `${BACKEND_URL}/api/products/add`)
      console.log('Form data fields:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        sizes: formData.sizes,
        bestseller: formData.bestSeller
      })
      console.log('Images count:', validImages.length)

      // Make API call to backend
      const response = await fetch(`${BACKEND_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        try {
          // Try to parse error response as JSON
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          try {
            const errorText = await response.text()
            if (errorText && errorText.trim()) {
              errorMessage = errorText
            }
          } catch (textError) {
            // If both JSON and text fail, use status-based message
            switch (response.status) {
              case 400:
                errorMessage = 'Bad request. Please check your data.'
                break
              case 401:
                errorMessage = 'Unauthorized. Please login again.'
                break
              case 403:
                errorMessage = 'Forbidden. You do not have permission.'
                break
              case 404:
                errorMessage = `API endpoint not found: ${BACKEND_URL}/api/products/add. Please check if backend is running and route exists.`
                break
              case 500:
                errorMessage = 'Internal server error. Please try again later.'
                break
              default:
                errorMessage = `Server error (${response.status}). Please try again.`
            }
          }
        }
        
        throw new Error(errorMessage)
      }

      // Check if response has content
      const responseText = await response.text()
      let result = null
      
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.warn('Response is not valid JSON:', responseText)
          result = { message: 'Product added successfully' }
        }
      } else {
        result = { message: 'Product added successfully' }
      }
      
      setMessage('Product added successfully to MongoDB!')
      console.log('Product saved:', result)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: [],
        bestSeller: false,
        images: Array(5).fill(null)
      })
      
      // Reset all file inputs
      for (let i = 0; i < 5; i++) {
        const fileInput = document.getElementById(`image-${i}`)
        if (fileInput) fileInput.value = ''
      }
      
    } catch (err) {
      console.error('Error adding product:', err)
      setMessage(err.message || 'Failed to add product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const availableSizes = ['L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL']

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add New Item</h2>
          <p className="text-sm text-gray-600 mt-1">Create a new product for your store</p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter product name" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea 
              rows={4} 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price(LKR.) *
              </label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="0.00" 
                step="0.01" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              >
                <option value="">Select category</option>
                <option value="Top">Top</option>
                <option value="Dresses">Dresses</option>
              </select>
            </div>
          </div>

          {/* Product Size Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Sizes * (Select available sizes)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">{size}</span>
                </label>
              ))}
            </div>
            {formData.sizes.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected sizes: {formData.sizes.join(', ')}
              </p>
            )}
          </div>

          {/* Best Seller Checkbox */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Best Seller</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              Check this box if this product should be featured as a best seller
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images * (Upload up to 5 images)
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Supported formats: JPG, PNG, GIF. Each image will be displayed separately.
            </p>
            
            {/* 5 Individual Image Upload Spaces */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors duration-200">
                  {formData.images[index] ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.images[index])}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-600 truncate">{formData.images[index].name}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Image {index + 1}</p>
                      <input
                        id={`image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                        className="hidden"
                      />
                      <label
                        htmlFor={`image-${index}`}
                        className="cursor-pointer bg-primary-50 text-primary-700 px-3 py-1 rounded-md text-xs hover:bg-primary-100 transition-colors duration-200"
                      >
                        Upload
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Images uploaded: {formData.images.filter(img => img !== null).length}/5</p>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding Product to MongoDB...' : 'Add Product'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  sizes: [],
                  bestSeller: false,
                  images: Array(5).fill(null)
                })
                // Reset all file inputs
                for (let i = 0; i < 5; i++) {
                  const fileInput = document.getElementById(`image-${i}`)
                  if (fileInput) fileInput.value = ''
                }
                setMessage('')
              }}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add
