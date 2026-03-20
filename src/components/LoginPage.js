import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin', email: 'admin@examportal.com' },
  { username: 'student01', password: 'pass123', name: 'Arun Kumar', rollNo: '21CS101', role: 'student', email: 'arun.kumar@college.edu' },
  { username: 'student02', password: 'pass123', name: 'Priya Sharma', rollNo: '21CS102', role: 'student', email: 'priya.sharma@college.edu' },
  { username: 'student03', password: 'pass123', name: 'Rahul Dev', rollNo: '21EC201', role: 'student', email: 'rahul.dev@college.edu' },
];

const LoginPage = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState('username');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      let found = null;

      if (loginMethod === 'username') {
        found = VALID_CREDENTIALS.find(
          (cred) => cred.username === username && cred.password === password
        );
      } else {
        found = VALID_CREDENTIALS.find(
          (cred) => cred.email === email.toLowerCase().trim() && cred.password === password
        );
      }

      if (found) {
        onLogin({
          name: found.name,
          rollNo: found.rollNo || '',
          username: found.username,
          email: found.email,
          role: found.role,
        });
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #0f2027, #2c5364)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 22, color: '#fff', fontWeight: 700 }}>EP</span>
          </div>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Online Examination &amp; Assessment Platform</p>

        {/* Login Method Toggle */}
        <div className="login-method-toggle">
          <button
            type="button"
            className={`login-method-btn ${loginMethod === 'username' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('username'); setError(''); }}
          >
            Username
          </button>
          <button
            type="button"
            className={`login-method-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('email'); setError(''); }}
          >
            Email
          </button>
        </div>

        {error && (
          <Alert variant="danger" className="py-2" style={{ borderRadius: 10, fontSize: 14 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {loginMethod === 'username' ? (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Username</Form.Label>
              <Form.Control
                type="text" placeholder="Enter your username"
                value={username} onChange={(e) => setUsername(e.target.value)}
                required disabled={loading}
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Email Address</Form.Label>
              <Form.Control
                type="email" placeholder="Enter your email address"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required disabled={loading}
              />
              <Form.Text style={{ color: '#888', fontSize: 11 }}>
                Exam codes will be sent to this email
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-2">
            <Form.Label style={{ fontWeight: 600, fontSize: 14, color: '#555' }}>Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required disabled={loading}
              />
              <button type="button" className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check type="checkbox" label="Show Password"
              checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}
              style={{ fontSize: 13, color: '#888' }} />
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