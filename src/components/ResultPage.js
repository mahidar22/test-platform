import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Sidebar } from './Dashboard';

const ResultPage = ({ student, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const handleLogout = () => { onLogout(); navigate('/'); };

  if (!result) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar active="results" onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="dashboard-topbar">
            <h3>Results</h3>
            <div className="user-info">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{student?.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{student?.rollNo}</div>
              </div>
              <div className="user-avatar">{student?.name?.charAt(0)}</div>
            </div>
          </div>
          <div className="result-card">
            <div className="result-icon">📊</div>
            <h3>No Results Yet</h3>
            <p style={{ color: '#888' }}>Complete an exam to view your results here.</p>
            <Button variant="dark" onClick={() => navigate('/exams')} style={{ borderRadius: 10, fontWeight: 600, padding: '10px 32px' }}>Go to Exams</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar active="results" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Exam Result</h3>
          <div className="user-info">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{student?.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{student?.rollNo}</div>
            </div>
            <div className="user-avatar">{student?.name?.charAt(0)}</div>
          </div>
        </div>

        <div className="result-card">
          <div className="result-icon">🎉</div>
          <h3>Exam Submitted Successfully!</h3>
          <div style={{ background: '#f8f9fa', borderRadius: 14, padding: 24, marginTop: 24, textAlign: 'left' }}>
            <table style={{ width: '100%', fontSize: 15 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555' }}>Exam</td>
                  <td style={{ padding: '8px 0', color: '#1a1a2e' }}>{result.examTitle}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555' }}>Code</td>
                  <td style={{ padding: '8px 0', color: '#1a1a2e' }}>{result.examCode}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555' }}>Total Questions</td>
                  <td style={{ padding: '8px 0', color: '#1a1a2e' }}>{result.total}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555' }}>Attempted</td>
                  <td style={{ padding: '8px 0', color: '#4caf50', fontWeight: 700 }}>{result.attempted}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555' }}>Unanswered</td>
                  <td style={{ padding: '8px 0', color: '#e53935', fontWeight: 700 }}>{result.total - result.attempted}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: '#888', marginTop: 20, fontSize: 14 }}>Your results will be evaluated and published by the administrator.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="dark" onClick={() => navigate('/dashboard')} style={{ borderRadius: 10, fontWeight: 600, padding: '10px 28px' }}>Back to Dashboard</Button>
            <Button variant="outline-secondary" onClick={() => navigate('/exams')} style={{ borderRadius: 10, fontWeight: 600, padding: '10px 28px' }}>View Exams</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;