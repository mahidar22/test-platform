import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  { username: 'student01', password: 'pass123', name: 'Arun Kumar', rollNo: '21CS101', role: 'student' },
  { username: 'student02', password: 'pass123', name: 'Priya Sharma', rollNo: '21CS102', role: 'student' },
  { username: 'student03', password: 'pass123', name: 'Rahul Dev', rollNo: '21EC201', role: 'student' },
];

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const found = VALID_CREDENTIALS.find(
        (cred) => cred.username === username && cred.password === password
      );
      if (found) {
        onLogin({
          name: found.name,
          rollNo: found.rollNo || '',
          username: found.username,
          role: found.role,
        });
      } else {
        setError('Invalid username or password. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #0f2027, #2c5364)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 28, color: '#fff' }}>📝</span>
          </div>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Online Examination &amp; Assessment Platform</p>

        {error && (
          <Alert variant="danger" className="py-2" style={{ borderRadius: 10, fontSize: 14 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Username</Form.Label>
            <Form.Control
              type="text" placeholder="Enter your username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              required disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Password</Form.Label>
            <Form.Control
              type="password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required disabled={loading}
            />
          </Form.Group>

          <Button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <><Spinner animation="border" size="sm" className="me-2" />Signing In...</>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <small style={{ color: '#aaa' }}>
            Use credentials provided by your institution
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;