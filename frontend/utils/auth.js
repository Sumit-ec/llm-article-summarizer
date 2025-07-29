/**
 * Authentication Utilities
 * 
 * Provides functions for JWT token management, user authentication state,
 * and logout functionality. Handles token decoding and user data extraction.
 */

/**
 * Extract user data from JWT token stored in localStorage
 * Note: This is a simple decode without validation - for display purposes only
 * @returns {Object|null} User object with id, username, and role, or null if invalid
 */
export function getUserFromToken() {
  // Check if running in browser environment
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Decode JWT payload (second part of token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    // Return null if token is malformed
    return null;
  }
}

/**
 * Logout user by clearing token and redirecting to login page
 * Also dispatches custom event to notify other components of auth state change
 */
export function logout() {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Notify other components about auth state change
  window.dispatchEvent(new CustomEvent('authStateChanged'));
  
  // Redirect to login page
  window.location.href = '/login';
}

/**
 * Notify components about authentication state changes
 * Used to update UI elements that depend on auth state (e.g., navbar)
 */
export function notifyAuthStateChanged() {
  window.dispatchEvent(new CustomEvent('authStateChanged'));
} 