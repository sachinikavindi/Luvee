import { useState } from 'react'

function BackendTest() {
  const [testResults, setTestResults] = useState([])
  const [isTesting, setIsTesting] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const addTestResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
  }

  const testBackendConnection = async () => {
    setIsTesting(true)
    setTestResults([])
    
    addTestResult('🔍 Starting backend connection test...', 'info')
    addTestResult(`📍 Backend URL: ${BACKEND_URL}`, 'info')

    try {
      // Test 1: Basic connectivity
      addTestResult('📡 Testing basic connectivity...', 'info')
      const startTime = Date.now()
      const response = await fetch(`${BACKEND_URL}/`, { method: 'GET' })
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        addTestResult(`✅ Backend is reachable (${responseTime}ms)`, 'success')
      } else {
        addTestResult(`⚠️ Backend responded with status: ${response.status}`, 'warning')
      }

      // Test 2: Health check endpoint
      addTestResult('🏥 Testing health check endpoint...', 'info')
      try {
        const healthResponse = await fetch(`${BACKEND_URL}/health`, { method: 'GET' })
        if (healthResponse.ok) {
          addTestResult('✅ Health check endpoint working', 'success')
        } else {
          addTestResult(`⚠️ Health check failed: ${healthResponse.status}`, 'warning')
        }
      } catch (error) {
        addTestResult('❌ Health check endpoint not available', 'error')
      }

      // Test 3: API base endpoint
      addTestResult('🔌 Testing API base endpoint...', 'info')
      try {
        const apiResponse = await fetch(`${BACKEND_URL}/api`, { method: 'GET' })
        if (apiResponse.ok) {
          addTestResult('✅ API base endpoint working', 'success')
        } else {
          addTestResult(`⚠️ API base failed: ${apiResponse.status}`, 'warning')
        }
      } catch (error) {
        addTestResult('❌ API base endpoint not available', 'error')
      }

      // Test 4: Products endpoint
      addTestResult('📦 Testing products endpoint...', 'info')
      try {
        const productsResponse = await fetch(`${BACKEND_URL}/api/products`, { method: 'GET' })
        if (productsResponse.ok) {
          addTestResult('✅ Products endpoint working', 'success')
        } else {
          addTestResult(`⚠️ Products endpoint failed: ${productsResponse.status}`, 'warning')
        }
      } catch (error) {
        addTestResult('❌ Products endpoint not available', 'error')
      }

      // Test 5: Authentication check
      addTestResult('🔐 Testing authentication...', 'info')
      const token = localStorage.getItem('adminToken')
      if (token) {
        addTestResult(`✅ Admin token found: ${token.substring(0, 20)}...`, 'success')
      } else {
        addTestResult('❌ No admin token found', 'error')
      }

    } catch (error) {
      addTestResult(`❌ Connection failed: ${error.message}`, 'error')
    }

    addTestResult('🏁 Backend test completed', 'info')
    setIsTesting(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Backend Connection Test</h2>
          <p className="text-sm text-gray-600 mt-1">Diagnose backend connectivity issues</p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={testBackendConnection}
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? 'Testing...' : 'Test Backend Connection'}
            </button>
            <button
              onClick={clearResults}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Results
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Backend Configuration</h3>
            <p className="text-xs text-gray-600">URL: {BACKEND_URL}</p>
            <p className="text-xs text-gray-600">Expected endpoint: {BACKEND_URL}/api/products/add</p>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg text-sm ${
                  result.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  result.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                  result.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  <span className="font-medium">[{result.timestamp}]</span> {result.message}
                </div>
              ))}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>1. Ensure backend server is running on port 4000</li>
              <li>2. Check if the route `/api/products/add` exists in your backend</li>
              <li>3. Verify your backend server.js has the products route configured</li>
              <li>4. Check backend console for any error messages</li>
              <li>5. Ensure CORS is properly configured for the admin panel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackendTest
