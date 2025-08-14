import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Navbar({ onLogout }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('adminToken')
    
    // Call logout callback
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <header className="admin-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-800">FOREVER.</h1>
                <span className="text-sm text-purple-600 font-medium">ADMIN PANEL</span>
              </div>
            </div>
            
           
          </div>
          
          {/* Logout Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
