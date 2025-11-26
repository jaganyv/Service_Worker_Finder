import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Service Worker Finder
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.email}</span>
                {user.role === 'CUSTOMER' && (
                  <Link to="/dashboard/customer" className="hover:underline">
                    My Bookings
                  </Link>
                )}
                {user.role === 'WORKER' && (
                  <Link to="/dashboard/worker" className="hover:underline">
                    Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/dashboard/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

