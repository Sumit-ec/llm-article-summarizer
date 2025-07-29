/**
 * Navigation Bar Component
 * 
 * Main navigation component that provides site-wide navigation, user authentication
 * status, theme switching, and responsive mobile menu functionality.
 * Adapts navigation items based on user authentication and role.
 */

import Link from 'next/link';
import { getUserFromToken, logout } from '../utils/auth';
import { getTheme, toggleTheme } from '../utils/theme';
import { useEffect, useState } from 'react';

export default function NavBar() {
  // State management for user, theme, and mobile menu
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Update user state from localStorage token
   */
  const updateUserState = () => {
    const user = getUserFromToken();
    setUser(user);
    setLoading(false);
  };

  // Initialize component and set up event listeners
  useEffect(() => {
    // Initial state setup
    updateUserState();
    setThemeState(getTheme());

    // Event listener for authentication state changes
    const handleAuthStateChanged = () => {
      updateUserState();
    };

    // Event listener for theme changes
    const handleThemeChanged = (event) => {
      setThemeState(event.detail);
    };

    // Add event listeners
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    window.addEventListener('themeChanged', handleThemeChanged);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
      window.removeEventListener('themeChanged', handleThemeChanged);
    };
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          Knowledge Hub
        </Link>
        <div className="navbar-actions">
          <button 
            onClick={handleThemeToggle}
            className="theme-toggle"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      {/* Brand/Logo */}
      <Link href="/" className="navbar-brand">
        Knowledge Hub
      </Link>
      
      {/* Desktop navigation links */}
      <div className="navbar-nav">
        {user ? (
          // Authenticated user navigation
          <>
            <Link href="/dashboard" className="nav-link" onClick={closeMobileMenu}>
              Dashboard
            </Link>
            <Link href="/add-article" className="nav-link" onClick={closeMobileMenu}>
              Add Article
            </Link>
            {/* Admin-only navigation */}
            {user.role === 'admin' && (
              <Link href="/users" className="nav-link" onClick={closeMobileMenu}>
                All Users
              </Link>
            )}
          </>
        ) : (
          // Guest user navigation
          <>
            <Link href="/login" className="nav-link" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link href="/register" className="nav-link" onClick={closeMobileMenu}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Desktop action buttons */}
      <div className="navbar-actions">
        {/* Theme toggle button */}
        <button 
          onClick={handleThemeToggle}
          className="theme-toggle"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* Logout button for authenticated users */}
        {user && (
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        )}
      </div>

      {/* Mobile menu toggle button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile navigation menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {user ? (
          // Authenticated user mobile navigation
          <>
            <Link href="/dashboard" className="nav-link" onClick={closeMobileMenu}>
              Dashboard
            </Link>
            <Link href="/add-article" className="nav-link" onClick={closeMobileMenu}>
              Add Article
            </Link>
            {/* Admin-only mobile navigation */}
            {user.role === 'admin' && (
              <Link href="/users" className="nav-link" onClick={closeMobileMenu}>
                All Users
              </Link>
            )}
          </>
        ) : (
          // Guest user mobile navigation
          <>
            <Link href="/login" className="nav-link" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link href="/register" className="nav-link" onClick={closeMobileMenu}>
              Register
            </Link>
          </>
        )}
        
        {/* Mobile logout button */}
        {user && (
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
} 