'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Smartphone, FileBraces, TowerControl, Link2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary via-tertiary to-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-neutral rounded-lg flex items-center justify-center">
                <span className="text-tertiary font-bold text-lg">NK</span>
              </div>
              <h3 className="text-xl font-bold text-neutral">Nirapod Kontho</h3>
            </div>
            <p className="text-neutral/90 text-sm leading-relaxed">
              Safe, anonymous, and secure reporting platform for harassment, violence, and corruption in Bangladesh.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 bg-secondary hover:bg-neutral rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FileBraces className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary hover:bg-neutral rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <TowerControl className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary hover:bg-neutral rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Link2 className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Submit Report
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-tertiary">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Safety Guide
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-secondary">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:info@niramodkontho.org"
                className="flex items-start gap-3 text-neutral hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 mt-0.5 text-secondary group-hover:text-neutral transition-colors" />
                <span className="text-sm">info@niramodkontho.org</span>
              </a>
              <a
                href="tel:+8801700000000"
                className="flex items-start gap-3 text-neutral hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5 mt-0.5 text-secondary group-hover:text-neutral transition-colors" />
                <span className="text-sm">+880 1700 000 000</span>
              </a>
              <div className="flex items-start gap-3 text-neutral">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-tertiary hover:bg-secondary rounded-lg transition-colors font-medium text-sm text-neutral"
              >
                <Smartphone className="w-4 h-4" />
                Download App
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral/30 pt-8 mb-4">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-neutral text-sm">
            <p>
              &copy; {currentYear} Nirapod Kontho. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-neutral pt-6 border-t border-neutral/30">
          <span>🔒 Your safety is our priority</span>
          <span className="hidden sm:inline text-tertiary">•</span>
          <span>✓ 100% Anonymous Reports</span>
          <span className="hidden sm:inline text-secondary">•</span>
          <span>🛡️ Secure & Encrypted</span>
        </div>
      </div>
    </footer>
  );
}
