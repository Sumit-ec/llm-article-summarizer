/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Checks for valid JWT token and redirects to login if not authenticated.
 * Shows loading state while checking authentication status.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../utils/auth';

/**
 * Protected Route Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Protected content or loading/redirect state
 */
export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const user = getUserFromToken();
    
    if (!user) {
      // Redirect to login if no valid user found
      router.push('/login');
    } else {
      // Set user state if authenticated
      setUser(user);
    }
    
    setLoading(false);
  }, [router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <div className="loading" style={{ margin: '20px auto' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Render protected content if authenticated
  return children;
} 