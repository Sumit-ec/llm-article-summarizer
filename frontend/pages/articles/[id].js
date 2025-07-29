import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getUserFromToken } from '../../utils/auth';
import { exportArticleAsPDF } from '../../utils/pdfExport';
import Link from 'next/link';

function ArticleView() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`/api/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setArticle(res.data);
        } catch (err) {
          setError('Failed to load article');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSummarize = async () => {
    if (!article) return;
    
    setSummarizing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/articles/${id}/summarize`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticle({ ...article, summary: res.data.summary });
    } catch (err) {
      setError('Failed to summarize article');
    } finally {
      setSummarizing(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const handleExportPDF = () => {
    if (article) {
      exportArticleAsPDF(article);
    }
  };

  const canEditArticle = () => {
    return currentUser && (currentUser.role === 'admin' || article?.createdBy === currentUser.id);
  };

  const canDeleteArticle = () => {
    return currentUser && currentUser.role === 'admin';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <h2 style={{ color: 'var(--text)', marginBottom: '20px' }}>Article Not Found</h2>
            <p>The article you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="article-content">
          <div className="article-main">
            <h1 className="article-title" style={{ fontSize: '32px', marginBottom: '15px' }}>{article.title}</h1>
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
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="article-actions">
            <button onClick={handleExportPDF} className="btn btn-secondary">
              Export PDF
            </button>
            {canEditArticle() && (
              <Link href={`/edit-article/${article._id}`} className="btn btn-secondary">
                Edit
              </Link>
            )}
            {canDeleteArticle() && (
              <button onClick={handleDeleteArticle} className="btn btn-danger">
                Delete
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.8', 
            fontSize: '16px',
            color: 'var(--text)'
          }}>
            {article.content}
          </div>
        </div>

        {article.summary && (
          <div className="summary-box">
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>Summary</h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{article.summary}</p>
          </div>
        )}

        {!article.summary && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              onClick={handleSummarize} 
              disabled={summarizing}
              className="btn btn-primary"
            >
              {summarizing ? 'Generating Summary...' : 'Generate Summary'}
            </button>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
}

export default function ProtectedArticleView() {
  return (
    <ProtectedRoute>
      <ArticleView />
    </ProtectedRoute>
  );
} 