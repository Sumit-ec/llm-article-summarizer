/**
 * Home Page Component
 * 
 * Landing page for the Knowledge Hub application featuring a welcome message
 * and call-to-action buttons for registration and login. Uses gradient styling
 * for visual appeal.
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        {/* Main heading with gradient text effect */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to Knowledge Hub
        </h1>
        
        {/* Description text */}
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          Your AI-powered platform for storing, editing, and summarizing articles. 
          Create, manage, and enhance your knowledge base with intelligent summarization.
        </p>
        
        {/* Call-to-action buttons */}
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 