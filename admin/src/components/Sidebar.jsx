import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
          <p className="text-sm text-gray-600">Manage your store</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isActive('/') 
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/add"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isActive('/add') 
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Items
          </Link>

          <Link
            to="/list"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isActive('/list') 
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            List Items
          </Link>

          <Link
            to="/orders"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              isActive('/orders') 
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>GreenChart Admin</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
