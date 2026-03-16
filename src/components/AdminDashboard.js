import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Badge, Button } from 'react-bootstrap';

const AdminSidebar = ({ active, onLogout }) => {
  const navigate = useNavigate();
  const menuItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/admin' },
    { key: 'create', icon: '➕', label: 'Create Exam', path: '/admin/create-exam' },
  ];

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h4><span>Exam</span>Portal</h4>
        <div style={{ color: '#4fc3f7', fontSize: 11, marginTop: 4, letterSpacing: 1 }}>
          ADMIN PANEL
        </div>
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

const AdminDashboard = ({ user, onLogout, customExams, deleteExam }) => {
  const navigate = useNavigate();

  const handleLogout = () => { onLogout(); navigate('/'); };

  const stats = [
    { icon: '📋', bg: '#e3f2fd', color: '#1565c0', label: 'Total Exams', value: customExams.length },
    { icon: '✅', bg: '#e8f5e9', color: '#2e7d32', label: 'Active', value: customExams.filter(e => e.status === 'Active').length },
    { icon: '📄', bg: '#fff3e0', color: '#e65100', label: 'PDF Uploaded', value: customExams.filter(e => e.pdfUrl).length },
    { icon: '❓', bg: '#fce4ec', color: '#c62828', label: 'Total Questions', value: customExams.reduce((sum, e) => sum + e.totalQuestions, 0) },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar active="dashboard" onLogout={handleLogout} />
      <div className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <h3>Admin Dashboard</h3>
          <div className="user-info">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Administrator</div>
            </div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #e53935, #c62828)' }}>A</div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Quick Action */}
        <Row className="g-4 mb-4">
          <Col md={12}>
            <div
              className="stat-card"
              style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #1a1a2e, #2c5364)', color: '#fff' }}
              onClick={() => navigate('/admin/create-exam')}
            >
              <h5 style={{ color: '#4fc3f7', fontSize: 16, fontWeight: 700 }}>➕ Create New Exam</h5>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
                Upload a PDF question paper, set duration, number of questions, and generate exam code.
              </p>
            </div>
          </Col>
        </Row>

        {/* Created Exams List */}
        <h5 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>📋 Created Exams</h5>

        {customExams.length === 0 ? (
          <div className="stat-card" style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#888', fontSize: 16, marginBottom: 16 }}>No exams created yet.</p>
            <Button
              variant="dark"
              onClick={() => navigate('/admin/create-exam')}
              style={{ borderRadius: 10, fontWeight: 600, padding: '10px 28px' }}
            >
              Create Your First Exam
            </Button>
          </div>
        ) : (
          <Row className="g-3">
            {customExams.map((exam, idx) => (
              <Col md={6} lg={4} key={idx}>
                <div className="exam-card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, background: '#e3f2fd',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      📄
                    </div>
                    <Badge bg="success" className="badge-status">Active</Badge>
                  </div>

                  <h6 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{exam.title}</h6>

                  <div style={{
                    background: '#f0f0f0', borderRadius: 8, padding: '6px 12px',
                    fontFamily: 'monospace', fontWeight: 700, fontSize: 14,
                    color: '#1a1a2e', marginBottom: 12, display: 'inline-block',
                    letterSpacing: 1,
                  }}>
                    Code: {exam.examCode}
                  </div>

                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                    📝 {exam.totalQuestions} Questions &nbsp; ⏱️ {exam.duration} min
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
                    Created: {new Date(exam.createdAt).toLocaleDateString()}
                  </div>

                  {exam.pdfUrl && (
                    <div style={{
                      background: '#e8f5e9', borderRadius: 8, padding: '6px 12px',
                      fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 12,
                    }}>
                      ✅ PDF Uploaded
                    </div>
                  )}

                  <Button
                    variant="outline-danger" size="sm"
                    style={{ borderRadius: 8, fontWeight: 600 }}
                    onClick={() => deleteExam(exam.examCode)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export { AdminSidebar };
export default AdminDashboard;