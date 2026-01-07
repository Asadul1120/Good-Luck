import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
              <div className="bg-white rounded-full items-center p-1 ">
                <img src={Logo} alt="Logo" className="w-12 h-12  " />
              </div>
              <span className="text-xl font-bold">
                Tours &<span className="text-yellow-300"> Travels</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-300 font-medium">
              Dashboard
            </Link>
            <Link
              to="/depositRequest"
              className="hover:text-yellow-300 font-medium"
            >
              Deposit Request
            </Link>

            <Link
              to="/depositHistory"
              className="hover:text-yellow-300 font-medium"
            >
              Deposit History
            </Link>
            <Link
              to="/transaction"
              className="hover:text-yellow-300 font-medium"
            >
              Transaction
            </Link>
            <Link
              to="/medicalCenter"
              className="hover:text-yellow-300 font-medium"
            >
              Medical center
            </Link>

            <Link to="/profile" className="hover:text-yellow-300 font-medium">
              Profile
            </Link>

            <p>
              Balance: <span className="text-yellow-300">00.00</span>
            </p>
          </nav>

          {/* Right Button */}
          <div className="">
            <Link
              to="/login"
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition shadow"
            >
              Login
            </Link>
          </div>
        </div>

        {/* ===== Mobile Menu ===== */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-blue-500"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            <p className="bg-gray-300 p-2 rounded-md text-gray-800 font-medium">
              Balance: <span className="text-yellow-600 font-bold">00.00</span>
            </p>

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/depositRequest"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Deposit Request
            </Link>

            <Link
              to="/depositHistory"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Deposit History
            </Link>
            <Link
              to="/transaction"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Transaction
            </Link>
            <Link
              to="/medicalCenter"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Medical center
            </Link>

            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="hover:text-yellow-300 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
