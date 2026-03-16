import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Form, Button, Badge, Alert } from 'react-bootstrap';
import { Sidebar } from './Dashboard';

const EXAMS = {
  past: [
    { id: 1, title: 'Data Structures & Algorithms', code: 'CS301', date: '2025-01-15', duration: '60 min', status: 'Completed', score: '42/50' },
    { id: 2, title: 'Database Management Systems', code: 'CS302', date: '2025-02-10', duration: '90 min', status: 'Completed', score: '38/50' },
  ],
  ongoing: [
    { id: 4, title: 'Operating Systems', code: 'CS401', date: '2025-06-20', duration: '90 min', status: 'Live Now' },
  ],
  upcoming: [
    { id: 6, title: 'Machine Learning', code: 'CS501', date: '2025-07-10', duration: '90 min', status: 'Scheduled' },
    { id: 7, title: 'Artificial Intelligence', code: 'CS502', date: '2025-07-15', duration: '60 min', status: 'Scheduled' },
  ],
};

const LEGACY_CODES = {
  'CS401-XK9M': { examId: 4, title: 'Operating Systems', code: 'CS401' },
};

const ExamPortal = ({ student, onLogout, customExams = [] }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [examCode, setExamCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => { onLogout(); navigate('/'); };

  const now = new Date();

  // Only active custom exams (deadline not passed)
  const activeCustomExams = customExams.filter((e) => {
    if (!e.deadline) return true;
    return new Date(e.deadline) > now;
  });

  const isValidCode = (code) => {
    if (LEGACY_CODES[code]) return true;
    if (activeCustomExams.find((e) => e.examCode === code)) return true;
    return false;
  };

  const handleEnterExam = (e) => {
    e.preventDefault();
    setCodeError('');
    const trimmed = examCode.trim().toUpperCase();
    if (!trimmed) { setCodeError('Please enter your exam code.'); return; }
    if (isValidCode(trimmed)) {
      navigate(`/exam/${trimmed}`);
    } else {
      setCodeError('Invalid exam code. Please check the code sent to your email.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge className="badge-status" bg="success">Completed</Badge>;
      case 'Live Now': return <Badge className="badge-status" bg="danger">● Live Now</Badge>;
      case 'Scheduled': return <Badge className="badge-status" bg="primary">Scheduled</Badge>;
      default: return null;
    }
  };

  const getExamList = () => {
    let list = [...(EXAMS[activeTab] || [])];
    if (activeTab === 'ongoing') {
      activeCustomExams.forEach((ce) => {
        list.push({
          id: ce.id,
          title: ce.title,
          code: ce.examCode,
          date: new Date(ce.createdAt).toISOString().split('T')[0],
          duration: ce.duration + ' min',
          status: 'Live Now',
          hasPdf: true,
        });
      });
    }
    return list;
  };

  const renderExams = () => {
    const list = getExamList();
    if (list.length === 0) {
      return <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No exams found.</p>;
    }
    return (
      <Row className="g-3">
        {list.map((exam) => (
          <Col md={6} lg={4} key={exam.id}>
            <div className="exam-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{
                  width: 42, height: 42, borderRadius: 10, background: '#e3f2fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {exam.hasPdf ? '📄' : '📝'}
                </div>
                {getStatusBadge(exam.status)}
              </div>
              <h6 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{exam.title}</h6>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Code: {exam.code}</p>
              <div className="d-flex justify-content-between" style={{ fontSize: 13, color: '#666' }}>
                <span>📅 {exam.date}</span>
                <span>⏱️ {exam.duration}</span>
              </div>
              {exam.hasPdf && (
                <div style={{
                  marginTop: 12, padding: '6px 12px', background: '#e3f2fd', borderRadius: 8,
                  fontSize: 12, fontWeight: 600, color: '#1565c0', textAlign: 'center',
                }}>
                  📄 PDF-Based Exam
                </div>
              )}
              {exam.score && (
                <div style={{
                  marginTop: 12, padding: '8px 12px', background: '#e8f5e9', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, color: '#2e7d32', textAlign: 'center',
                }}>
                  Score: {exam.score}
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  // Count ongoing exams
  const ongoingCount = EXAMS.ongoing.length + activeCustomExams.length;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar active="exams" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Exams</h3>
          <div className="user-info">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{student?.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{student?.rollNo}</div>
            </div>
            <div className="user-avatar">{student?.name?.charAt(0)}</div>
          </div>
        </div>

        <Nav variant="pills" className="exam-tab-pills mb-4" activeKey={activeTab}>
          <Nav.Item>
            <Nav.Link eventKey="past" onClick={() => setActiveTab('past')}>Past Exams</Nav.Link>
          </Nav.Item>
          <Nav.Item className="ms-2">
            <Nav.Link eventKey="ongoing" onClick={() => setActiveTab('ongoing')}>
              Ongoing Exams<Badge bg="danger" className="ms-2" pill>{ongoingCount}</Badge>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="ms-2">
            <Nav.Link eventKey="upcoming" onClick={() => setActiveTab('upcoming')}>Upcoming Exams</Nav.Link>
          </Nav.Item>
        </Nav>

        {renderExams()}

        {/* ── Code Entry — ONLY in Ongoing Tab ── */}
        {activeTab === 'ongoing' && (
          <div className="code-entry-section">
            <Row className="align-items-center">
              <Col md={6}>
                <h5>🔑 Enter Your Exam Code</h5>
                <p>Eligible students receive a unique exam code via email. Enter it below to start your exam.</p>
              </Col>
              <Col md={6}>
                <Form onSubmit={handleEnterExam}>
                  {codeError && (
                    <Alert variant="danger" className="py-2" style={{ borderRadius: 10, fontSize: 13 }}>{codeError}</Alert>
                  )}
                  <div className="d-flex gap-2">
                    <Form.Control
                      className="code-input flex-grow-1" type="text" placeholder="Enter exam code"
                      value={examCode} onChange={(e) => setExamCode(e.target.value)} maxLength={12}
                    />
                    <Button type="submit" className="btn-enter-exam">Enter →</Button>
                  </div>
                  <small style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8, display: 'block' }}>
                    Enter the code provided by your admin
                  </small>
                </Form>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPortal;