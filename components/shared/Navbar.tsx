'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NK</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary hidden sm:inline">
              Nirapod Kontho
            </span>
            <span className="text-lg sm:text-xl font-bold text-primary sm:hidden">
              NK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4 items-center">
            <Link
              href="/login"
              className="text-gray-700 hover:text-primary px-4 py-2 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/report"
              className="bg-gradient-to-r from-secondary to-tertiary text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Report Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 mt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary px-4 py-2 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-primary px-4 py-2 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-primary px-4 py-2 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary px-4 py-2 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/report"
                  className="bg-gradient-to-r from-secondary to-tertiary text-white px-4 py-2.5 rounded-lg font-medium transition-all text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Report Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}