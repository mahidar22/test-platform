import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const Sidebar = ({ active, onLogout }) => {
  const navigate = useNavigate();
  const menuItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { key: 'exams', icon: '📝', label: 'Exams', path: '/exams' },
    { key: 'results', icon: '📊', label: 'Results', path: '/result' },
  ];

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h4><span>Exam</span>Portal</h4>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div className="nav-item" key={item.key}>
            <div
              className={`nav-link ${active === item.key ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          </div>
        ))}
        <div className="nav-item" style={{ marginTop: 32 }}>
          <div className="nav-link" onClick={onLogout}>
            <span className="nav-icon">🚪</span>Logout
          </div>
        </div>
      </nav>
    </div>
  );
};

const Dashboard = ({ student, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = () => {
    if (location.pathname.includes('/exams')) return 'exams';
    if (location.pathname.includes('/result')) return 'results';
    return 'dashboard';
  };

  const stats = [
    { icon: '📋', bg: '#e3f2fd', color: '#1565c0', label: 'Total Exams', value: 8 },
    { icon: '✅', bg: '#e8f5e9', color: '#2e7d32', label: 'Completed', value: 3 },
    { icon: '🔴', bg: '#fff3e0', color: '#e65100', label: 'Ongoing', value: 2 },
    { icon: '📅', bg: '#fce4ec', color: '#c62828', label: 'Upcoming', value: 3 },
  ];

  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar active={getActive()} onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Dashboard</h3>
          <div className="user-info">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{student?.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{student?.rollNo}</div>
            </div>
            <div className="user-avatar">{student?.name?.charAt(0)}</div>
          </div>
        </div>

        <Row className="g-4 mb-4">
          {stats.map((s, i) => (
            <Col md={3} sm={6} key={i}>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <h5>{s.label}</h5>
                <h2>{s.value}</h2>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/exams')}>
              <h5 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 700 }}>📝 Go to Exams</h5>
              <p style={{ color: '#888', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
                View ongoing, upcoming & past exams. Enter your exam code here.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/result')}>
              <h5 style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 700 }}>📊 View Results</h5>
              <p style={{ color: '#888', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
                Check your scores and performance for completed exams.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { Sidebar };
export default Dashboard;