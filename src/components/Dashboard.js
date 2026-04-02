import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';

const Dashboard = ({ student, onLogout, customExams, completedExams, upcomingExams }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getActiveExamsCount = () => {
    const currentTime = new Date();
    return customExams?.filter((e) => {
      if (!e.deadline) return true;
      return new Date(e.deadline) > currentTime;
    }).length;
  };

  const studentEmail = student?.email || student?.rollNo;
  const studentInitial = student?.name
    ? student.name.charAt(0).toUpperCase()
    : studentEmail
    ? studentEmail.charAt(0).toUpperCase()
    : '';

  const activeExamsCount = getActiveExamsCount();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="dashboard" onLogout={handleLogout} />

      <div className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <h3>Dashboard</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{studentEmail}</div>
            <div className="user-avatar">{studentInitial}</div>
          </div>
        </div>

        {/* Stats Cards — Number beside text inline */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-card-inline">
                <div className="stat-icon" style={{ background: '#E3F2FD' }}>📝</div>
                <div className="stat-text">
                  <h5>Active Exams</h5>
                </div>
                <div className="stat-number">{activeExamsCount}</div>
              </div>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-card-inline">
                <div className="stat-icon" style={{ background: '#E8F5E9' }}>✅</div>
                <div className="stat-text">
                  <h5>Completed</h5>
                </div>
                <div className="stat-number" style={{ color: '#4caf50' }}>{completedExams?.length}</div>
              </div>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-card-inline">
                <div className="stat-icon" style={{ background: '#FFF3E0' }}>⏰</div>
                <div className="stat-text">
                  <h5>Upcoming</h5>
                </div>
                <div className="stat-number" style={{ color: '#ff9800' }}>{upcomingExams?.length}</div>
              </div>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-card-inline">
                <div className="stat-icon" style={{ background: '#F3E5F5' }}>📊</div>
                <div className="stat-text">
                  <h5>Avg Score</h5>
                </div>
                <div className="stat-number" style={{ color: '#7B1FA2' }}>—</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon">👋</div>
            <h4>Welcome to ExamPortal!</h4>
            <p>
              Your online examination platform. Take exams, track your progress,
              and view your results all in one place.
            </p>

            <div className="welcome-info-grid">
              <div className="welcome-info-item">
                <span className="welcome-info-icon">📧</span>
                <span><strong>Email:</strong> {studentEmail}</span>
              </div>
              {student?.rollNo && (
                <div className="welcome-info-item">
                  <span className="welcome-info-icon">🎫</span>
                  <span><strong>Roll No:</strong> {student.rollNo}</span>
                </div>
              )}
              <div className="welcome-info-item">
                <span className="welcome-info-icon">📝</span>
                <span><strong>Active Exams:</strong> {activeExamsCount} available</span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Button
                onClick={() => navigate('/exams')}
                style={{
                  background: 'linear-gradient(135deg, #5B0A7B, #7B1FA2)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 32px',
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Go to Exams →
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Row className="g-4 mt-4">
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/exams')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#E8F5E9', marginBottom: 0 }}>🚀</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>Take an Exam</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Enter your exam code and start</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/results')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#FFF3E0', marginBottom: 0 }}>📈</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>View Results</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Check your exam scores</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
