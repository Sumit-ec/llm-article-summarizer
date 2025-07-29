import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await axios.post(`${API_BASE_URL}/articles`, {
        title,
        content,
        tags: tagArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text)' }}>Add New Article</h2>
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
              {loading ? 'Creating...' : 'Create Article'}
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

export default function ProtectedAddArticle() {
  return (
    <ProtectedRoute>
      <AddArticle />
    </ProtectedRoute>
  );
} 