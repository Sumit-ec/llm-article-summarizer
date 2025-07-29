/**
 * Theme Management Utility
 * 
 * Provides theme configuration and management for light and dark modes.
 * Includes color schemes, theme switching functionality, and localStorage persistence.
 */

/**
 * Theme color schemes for light and dark modes
 * Each theme includes colors for backgrounds, text, buttons, alerts, and UI elements
 */
export const themes = {
  light: {
    // Background gradients and main colors
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: '#ffffff',
    
    // Text colors
    text: '#2d3748',
    textSecondary: '#718096',
    
    // Border and input styling
    border: '#e2e8f0',
    inputBg: '#f8f9fa',
    inputBorder: '#e1e5e9',
    
    // Button colors
    buttonPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonSecondary: '#6c757d',
    buttonDanger: '#e74c3c',
    
    // Alert and notification colors
    alertError: '#fee',
    alertSuccess: '#f0fff4',
    
    // Tag and summary styling
    tagBg: '#e2e8f0',
    tagText: '#4a5568',
    summaryBox: '#f7fafc',
    summaryBorder: '#667eea',
    
    // Navigation and loading
    navbarBg: 'rgba(255, 255, 255, 0.95)',
    navbarBorder: 'rgba(255, 255, 255, 0.2)',
    loadingColor: '#667eea'
  },
  dark: {
    // Background gradients and main colors
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    cardBg: '#2d3748',
    
    // Text colors
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    
    // Border and input styling
    border: '#4a5568',
    inputBg: '#4a5568',
    inputBorder: '#718096',
    
    // Button colors
    buttonPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonSecondary: '#718096',
    buttonDanger: '#e74c3c',
    
    // Alert and notification colors
    alertError: '#2d1b1b',
    alertSuccess: '#1a2e1a',
    
    // Tag and summary styling
    tagBg: '#4a5568',
    tagText: '#e2e8f0',
    summaryBox: '#4a5568',
    summaryBorder: '#667eea',
    
    // Navigation and loading
    navbarBg: 'rgba(45, 55, 72, 0.95)',
    navbarBorder: 'rgba(45, 55, 72, 0.2)',
    loadingColor: '#667eea'
  }
};

/**
 * Get the current theme from localStorage
 * @returns {string} Current theme ('light' or 'dark'), defaults to 'light'
 */
export function getTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') || 'light';
}

/**
 * Set the theme and persist it to localStorage
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
export function setTheme(theme) {
  if (typeof window === 'undefined') return;
  
  // Save theme to localStorage
  localStorage.setItem('theme', theme);
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);
  
  // Notify other components about theme change
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
}

/**
 * Toggle between light and dark themes
 * @returns {string} The new theme that was set
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
} 