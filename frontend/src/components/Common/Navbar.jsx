import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eye, Moon, Sun, Menu, X, Phone, Calendar, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Book Appointment' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg border-b border-white/10 dark:border-slate-700/50 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-glow-teal group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5 text-white eye-blink" />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-slate-800 dark:text-white text-sm leading-tight">
                Mahatme Eye Hospital
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Nagpur</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Phone */}
            <a
              href="tel:+917122123456"
              className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 712 212 3456</span>
            </a>

            {/* Book CTA */}
            <Link
              to="/"
              className="hidden md:flex btn-primary text-sm py-2 px-4"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>

            {/* Admin Panel */}
            <Link
              to="/admin/dashboard"
              className="hidden md:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-teal-700 dark:bg-slate-700 dark:hover:bg-teal-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass shadow-xl border-b border-white/10 dark:border-slate-700 md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <a
                  href="tel:+917122123456"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 dark:text-slate-300"
                >
                  <Phone className="w-4 h-4 text-teal-500" />
                  +91 712 212 3456
                </a>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex btn-primary justify-center mt-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
