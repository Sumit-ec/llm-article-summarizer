import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getUserFromToken } from '../../utils/auth';

function EditArticle() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (id && currentUser) {
      const fetchArticle = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`/api/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const articleData = res.data;
          
          // Check if user can edit this article
          if (currentUser.role !== 'admin' && articleData.createdBy !== currentUser.id) {
            setError('You can only edit your own articles');
            return;
          }
          
          setArticle(articleData);
          setTitle(articleData.title);
          setContent(articleData.content);
          setTags(articleData.tags ? articleData.tags.join(', ') : '');
        } catch (err) {
          setError('Failed to load article');
        }
      };
      fetchArticle();
    }
  }, [id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await axios.put(`/api/articles/${id}`, {
        title,
        content,
        tags: tagArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  if (!article && !error) {
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

  if (error && error.includes('can only edit your own articles')) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <h2 style={{ color: 'var(--text)', marginBottom: '20px' }}>Access Denied</h2>
            <p>You can only edit your own articles. Administrators can edit any article.</p>
            <button onClick={() => router.push('/dashboard')} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text)' }}>Edit Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              rows="10"
              required
              style={{ resize: 'vertical', minHeight: '200px' }}
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-control"
              placeholder="e.g., technology, programming, web development"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Article'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
}

export default function ProtectedEditArticle() {
  return (
    <ProtectedRoute>
      <EditArticle />
    </ProtectedRoute>
  );
} 