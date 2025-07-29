/**
 * Dashboard Component
 * 
 * Main dashboard page for authenticated users to view, manage, and interact
 * with articles. Features pagination, article actions (edit, delete, export),
 * and role-based permissions for different user types.
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { getUserFromToken } from '../utils/auth';
import { exportArticleAsPDF } from '../utils/pdfExport';

function Dashboard() {
  // State management for articles and UI
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize current user on component mount
  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  /**
   * Fetch articles from API with pagination
   * @param {number} page - Page number to fetch
   */
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/articles?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.articles) {
        // Handle new paginated response format
        setArticles(res.data.articles);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
        setTotalArticles(res.data.pagination.totalArticles);
      } else {
        // Handle legacy response format
        setArticles(res.data);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalArticles(res.data.length);
      }
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles when page changes
  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  /**
   * Delete an article with confirmation
   * @param {string} articleId - ID of article to delete
   */
  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh current page after deletion
      fetchArticles(currentPage);
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  /**
   * Export article as PDF
   * @param {Object} article - Article object to export
   */
  const handleExportPDF = (article) => {
    exportArticleAsPDF(article);
  };

  /**
   * Check if current user can edit an article
   * @param {Object} article - Article object to check permissions for
   * @returns {boolean} True if user can edit the article
   */
  const canEditArticle = (article) => {
    return currentUser && (
      currentUser.role === 'admin' || 
      article.createdBy === currentUser.id
    );
  };

  /**
   * Check if current user can delete an article (admin only)
   * @param {Object} article - Article object to check permissions for
   * @returns {boolean} True if user can delete the article
   */
  const canDeleteArticle = (article) => {
    return currentUser && currentUser.role === 'admin';
  };

  /**
   * Handle page navigation
   * @param {number} newPage - Page number to navigate to
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Render pagination controls with smart page number display
   * @returns {JSX.Element} Pagination component
   */
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we don't have enough pages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Generate page numbers to display
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary pagination-btn"
          style={{ 
            opacity: currentPage === 1 ? 0.5 : 1
          }}
        >
          Previous
        </button>

        {/* First page and ellipsis */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="btn btn-secondary pagination-btn"
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: 'var(--text-secondary)' }}>...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? "btn btn-primary pagination-btn" : "btn btn-secondary pagination-btn"}
          >
            {page}
          </button>
        ))}

        {/* Last page and ellipsis */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: 'var(--text-secondary)' }}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="btn btn-secondary pagination-btn"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary pagination-btn"
          style={{ 
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card">
        {/* Header section with title and add button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '30px', 
          flexWrap: 'wrap', 
          gap: '15px' 
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <h2 style={{ color: 'var(--text)', margin: 0, marginBottom: '5px' }}>Articles</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
              Showing {articles.length} of {totalArticles} articles
            </p>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <Link href="/add-article" className="btn btn-primary">
              Add Article
            </Link>
          </div>
        </div>
        
        {/* Error display */}
        {error && <div className="alert alert-error">{error}</div>}
        
        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          // Empty state
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No articles yet. Create your first article!</p>
          </div>
        ) : (
          <>
            {/* Article list */}
            <div className="article-list">
              {articles.map((article) => (
                <div key={article._id} className="article-item">
                  <div className="article-content">
                    <div className="article-main">
                      {/* Article title link */}
                      <Link href={`/articles/${article._id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="article-title">{article.title}</h3>
                      </Link>
                      
                      {/* Article metadata */}
                      <div className="article-meta">
                        Created: {new Date(article.createdAt).toLocaleDateString()}
                        {article.createdBy && (
                          <span style={{ marginLeft: '15px' }}>
                            By: <span style={{ fontWeight: '600', color: 'var(--text)' }}>
                              {article.createdBy.username}
                            </span>
                          </span>
                        )}
                      </div>
                      
                      {/* Article tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="article-tags">
                          {article.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Article action buttons */}
                    <div className="article-actions">
                      <button 
                        onClick={() => handleExportPDF(article)}
                        className="btn btn-secondary"
                      >
                        Export PDF
                      </button>
                      {canEditArticle(article) && (
                        <Link 
                          href={`/edit-article/${article._id}`} 
                          className="btn btn-secondary"
                        >
                          Edit
                        </Link>
                      )}
                      {canDeleteArticle(article) && (
                        <button 
                          onClick={() => handleDeleteArticle(article._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination controls */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Protected Dashboard Component
 * Wraps the dashboard with authentication protection
 */
export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
} 