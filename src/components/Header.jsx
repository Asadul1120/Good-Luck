import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const { logout, user } = useAuth();

  const isUser = user?.role === "user";
  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* ===== Top Bar ===== */}
        <div className="flex items-center justify-between">
          {/* Left: Mobile menu + Logo + Brand */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-700 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Logo + Name */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2"
            >
              <div className="bg-white rounded-full items-center ">
                <img
                  src={
                    user?.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            </Link>
          </div>

          {/* ===== Desktop Menu (USER) ===== */}
          {isUser && (
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/depositRequest">Deposit Request</Link>
              <Link to="/depositHistory">Deposit History</Link>
              <Link to="/transaction">Transaction</Link>
              <Link to="/medicalCenter">Medical center</Link>
              <Link to="/profile">Profile</Link>
              <p>
                Balance:{" "}
                <span className="text-yellow-300">{user.balance || 0}</span>
              </p>
            </nav>
          )}

          {/* ===== Desktop Menu (ADMIN) ===== */}
          {isAdmin && (
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/adminDashboard">Admin Dashboard</Link>
              <Link to="/adminPayment">Admin Payment</Link>
              <Link to="/depositRequests">Deposit Requests</Link>
              <Link to="/adminPanel">Admin Panel</Link>
              <Link to="/Notice">Notice </Link>
              <Link to="/addUser">Add User</Link>
              <Link to="/addMedicalCenter">Add Medical Center</Link>
              <Link to="/profile">Profile</Link>
            </nav>
          )}

          {/* Right Button */}
          <div>
            {!user ? (
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition shadow"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition shadow"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* ===== Mobile Menu ===== */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {/* USER MENU */}
            {isUser && (
              <>
                <p className="bg-gray-300 p-2 rounded-md text-gray-800 font-medium">
                  Balance:{" "}
                  <span className="text-yellow-600 font-bold">
                    {user.balance || 0}
                  </span>
                </p>

                <Link to="/dashboard">Dashboard</Link>
                <Link to="/depositRequest">Deposit Request</Link>
                <Link to="/depositHistory">Deposit History</Link>
                <Link to="/transaction">Transaction</Link>
                <Link to="/medicalCenter">Medical center</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}

            {/* ADMIN MENU */}
            {isAdmin && (
              <>
                <Link to="/adminDashboard">Admin Dashboard</Link>
                <Link to="/adminPayment">Admin Payment</Link>
                <Link to="/depositRequests">User Deposit </Link>
                <Link to="/adminPanel">Admin Panel</Link>
                <Link to="/Notice">Notice </Link>
                <Link to="/addUser">Add User</Link>
                <Link to="/addMedicalCenter">Add Medical Center</Link>
                <Link to="/profile">Profile</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
