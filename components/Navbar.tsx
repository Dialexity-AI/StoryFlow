'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Generate', href: '/generate' },
  { name: 'Library', href: '/library' },
  { name: 'Premium', href: '/premium' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpenIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-900">StoryFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link text-secondary-700 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="btn-secondary btn-animate">
              Login
            </Link>
            <Link href="/signup" className="btn-primary btn-animate">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-secondary-700 hover:text-primary-600 transition-all duration-300 hover:scale-110 transform"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 animate-spin" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 animate-slide-up">
            <div className="space-y-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-secondary-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 transform"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block btn-secondary text-center btn-animate hover-lift"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block btn-primary text-center btn-animate hover-lift"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom mobile nav */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-secondary-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-4">
          {navigation.slice(0,4).map((item) => (
            <Link key={item.name} href={item.href} className="text-sm text-secondary-700 hover:text-primary-600">
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
