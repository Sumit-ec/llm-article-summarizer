import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { getUserFromToken } from '../utils/auth';

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
    if (user && user.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_BASE_URL}/users`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          setUsers(res.data);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to load users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <h2 style={{ color: 'var(--text)', marginBottom: '20px' }}>Access Denied</h2>
            <p>You don't have permission to view this page. Only administrators can access user management.</p>
          </div>
        </div>
      </div>
    );
  }

  const adminCount = users.filter(user => user.role === 'admin').length;
  const userCount = users.filter(user => user.role === 'user').length;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ color: 'var(--text)', marginBottom: '30px' }}>User Management</h2>
        {error && <div className="alert alert-error">{error}</div>}
        
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{adminCount}</div>
            <div className="stat-label">Administrators</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userCount}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No users found.</p>
          </div>
        ) : (
          <div className="article-list">
            {users.map((user) => (
              <div key={user._id} className="article-item">
                <div className="article-content">
                  <div className="article-main">
                    <h3 className="article-title">{user.username}</h3>
                    <div className="article-meta">
                      Role: <span style={{ 
                        background: user.role === 'admin' ? '#667eea' : 'var(--tag-bg)', 
                        color: user.role === 'admin' ? 'white' : 'var(--tag-text)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>{user.role}</span>
                    </div>
                    <div className="article-meta">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                    <div className="article-meta">User ID: {user._id}</div>
                  </div>
                  {user.role === 'admin' && (
                    <div style={{ 
                      background: '#667eea', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      marginTop: '10px'
                    }}>
                      ADMIN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProtectedUsers() {
  return (
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  );
} 