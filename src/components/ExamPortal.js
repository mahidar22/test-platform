import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Form, Button, Badge, Alert, Modal } from 'react-bootstrap';
import Sidebar from './Sidebar';

var EXAMS = {
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

var LEGACY_CODES = {
  'CS401-XK9M': { examId: 4, title: 'Operating Systems', code: 'CS401' },
};

var ExamPortal = function (props) {
  var student = props.student;
  var onLogout = props.onLogout;
  var customExams = props.customExams || [];

  var activeTabState = useState('ongoing');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  var examCodeState = useState('');
  var examCode = examCodeState[0];
  var setExamCode = examCodeState[1];

  var codeErrorState = useState('');
  var codeError = codeErrorState[0];
  var setCodeError = codeErrorState[1];

  var reminderExamsState = useState([]);
  var reminderExams = reminderExamsState[0];
  var setReminderExams = reminderExamsState[1];

  var showReminderModalState = useState(false);
  var showReminderModal = showReminderModalState[0];
  var setShowReminderModal = showReminderModalState[1];

  var dismissedRemindersState = useState(new Set());
  var dismissedReminders = dismissedRemindersState[0];
  var setDismissedReminders = dismissedRemindersState[1];

  var navigate = useNavigate();

  var handleLogout = function () {
    onLogout();
    navigate('/');
  };

  var getActiveCustomExams = function () {
    var currentTime = new Date();
    return customExams.filter(function (e) {
      if (!e.deadline) return true;
      return new Date(e.deadline) > currentTime;
    });
  };

  var activeCustomExams = getActiveCustomExams();

  useEffect(function () {
    var checkReminders = function () {
      var currentTime = new Date();
      var activeExams = customExams.filter(function (e) {
        if (!e.deadline) return false;
        return new Date(e.deadline) > currentTime;
      });
      var expiringSoon = activeExams.filter(function (exam) {
        var deadlineTime = new Date(exam.deadline);
        var timeRemaining = deadlineTime - currentTime;
        return (timeRemaining > 0 && timeRemaining <= 30 * 60 * 1000 && !dismissedReminders.has(exam.examCode));
      });
      if (expiringSoon.length > 0) {
        setReminderExams(expiringSoon);
        setShowReminderModal(true);
      }
    };
    checkReminders();
    var interval = setInterval(checkReminders, 60000);
    return function () { clearInterval(interval); };
    // eslint-disable-next-line
  }, [customExams, dismissedReminders]);

  var dismissReminder = function (code) {
    var newSet = new Set(dismissedReminders);
    newSet.add(code);
    setDismissedReminders(newSet);
    var remaining = reminderExams.filter(function (e) { return e.examCode !== code; });
    setReminderExams(remaining);
    if (remaining.length === 0) setShowReminderModal(false);
  };

  var dismissAllReminders = function () {
    var codes = new Set(dismissedReminders);
    reminderExams.forEach(function (e) { codes.add(e.examCode); });
    setDismissedReminders(codes);
    setReminderExams([]);
    setShowReminderModal(false);
  };

  var getTimeRemaining = function (deadline) {
    var diff = new Date(deadline) - new Date();
    if (diff <= 0) return 'Expired';
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Less than 1 min';
    if (mins === 1) return '1 minute';
    return mins + ' minutes';
  };

  var isValidCode = function (code) {
    if (LEGACY_CODES[code]) return true;
    return !!activeCustomExams.find(function (e) { return e.examCode === code; });
  };

  var handleEnterExam = function (e) {
    e.preventDefault();
    setCodeError('');
    var trimmed = examCode.trim().toUpperCase();
    if (!trimmed) { setCodeError('Please enter your exam code.'); return; }
    if (isValidCode(trimmed)) {
      navigate('/exam/' + trimmed);
    } else {
      setCodeError('Invalid exam code. Please check the code sent to your email.');
    }
  };

  var getStatusBadge = function (status) {
    if (status === 'Completed') return <Badge className="badge-status" bg="success">Completed</Badge>;
    if (status === 'Live Now') return <Badge className="badge-status" bg="danger">Live Now</Badge>;
    if (status === 'Scheduled') return <Badge className="badge-status" bg="primary">Scheduled</Badge>;
    if (status === 'Expiring Soon') return <Badge className="badge-status" bg="warning" text="dark">Expiring Soon</Badge>;
    return null;
  };

  var getExamList = function () {
    var currentTime = new Date();
    var list = [];
    if (EXAMS[activeTab]) EXAMS[activeTab].forEach(function (exam) { list.push(exam); });
    if (activeTab === 'ongoing') {
      activeCustomExams.forEach(function (ce) {
        var deadlineTime = ce.deadline ? new Date(ce.deadline) : null;
        var timeRemaining = deadlineTime ? (deadlineTime - currentTime) : Infinity;
        var isExpiringSoon = timeRemaining > 0 && timeRemaining <= 30 * 60 * 1000;
        list.push({
          id: ce.id, title: ce.title, code: ce.examCode,
          date: new Date(ce.createdAt).toISOString().split('T')[0],
          duration: ce.duration + ' min',
          status: isExpiringSoon ? 'Expiring Soon' : 'Live Now',
          hasPdf: true, deadline: ce.deadline,
        });
      });
    }
    return list;
  };

  var examList = getExamList();
  var ongoingCount = EXAMS.ongoing.length + activeCustomExams.length;

  var studentEmail = student ? (student.email || student.rollNo || '') : '';
  var studentInitial = (student && student.name)
    ? student.name.charAt(0).toUpperCase()
    : (studentEmail ? studentEmail.charAt(0).toUpperCase() : '?');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar active="exams" onLogout={handleLogout} />
      <div className="dashboard-main">

        <div className="dashboard-topbar">
          <h3>Exams</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{studentEmail}</div>
            <div className="user-avatar">{studentInitial}</div>
          </div>
        </div>

        {reminderExams.length > 0 && !showReminderModal && (
          <div className="reminder-banner" onClick={function () { setShowReminderModal(true); }}>
            <span className="reminder-banner-icon">!</span>
            <span>{reminderExams.length} exam{reminderExams.length > 1 ? 's' : ''} expiring within 30 minutes! Click to view.</span>
          </div>
        )}

        <Nav variant="pills" className="exam-tab-pills mb-4" activeKey={activeTab}>
          <Nav.Item>
            <Nav.Link eventKey="past" onClick={function () { setActiveTab('past'); }}>Past Exams</Nav.Link>
          </Nav.Item>
          <Nav.Item className="ms-2">
            <Nav.Link eventKey="ongoing" onClick={function () { setActiveTab('ongoing'); }}>
              Ongoing Exams<Badge bg="danger" className="ms-2" pill>{ongoingCount}</Badge>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="ms-2">
            <Nav.Link eventKey="upcoming" onClick={function () { setActiveTab('upcoming'); }}>Upcoming Exams</Nav.Link>
          </Nav.Item>
        </Nav>

        {examList.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No exams found.</p>
        ) : (
          <Row className="g-3">
            {examList.map(function (exam) {
              return (
                <Col md={6} lg={4} key={exam.id || exam.code}>
                  <div className={'exam-card' + (exam.status === 'Expiring Soon' ? ' exam-card-expiring' : '')}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: exam.status === 'Expiring Soon' ? '#fff8e1' : '#F3E5F5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: '#5B0A7B',
                      }}>
                        {exam.hasPdf ? 'PDF' : 'MCQ'}
                      </div>
                      {getStatusBadge(exam.status)}
                    </div>
                    <h6 style={{ fontWeight: 700, color: '#2D0040', marginBottom: 4 }}>{exam.title}</h6>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Code: {exam.code}</p>
                    <div className="d-flex justify-content-between" style={{ fontSize: 13, color: '#666' }}>
                      <span>Date: {exam.date}</span>
                      <span>Duration: {exam.duration}</span>
                    </div>
                    {exam.deadline && (
                      <div style={{ marginTop: 8, fontSize: 12, color: exam.status === 'Expiring Soon' ? '#e65100' : '#666', fontWeight: exam.status === 'Expiring Soon' ? 700 : 400 }}>
                        Deadline: {new Date(exam.deadline).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    {exam.status === 'Expiring Soon' && (
                      <div className="expiring-soon-badge">Time left: {getTimeRemaining(exam.deadline)}</div>
                    )}
                    {exam.hasPdf && exam.status !== 'Expiring Soon' && (
                      <div style={{ marginTop: 12, padding: '6px 12px', background: '#F3E5F5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#5B0A7B', textAlign: 'center' }}>
                        PDF-Based Exam
                      </div>
                    )}
                    {exam.score && (
                      <div style={{ marginTop: 12, padding: '8px 12px', background: '#e8f5e9', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#2e7d32', textAlign: 'center' }}>
                        Score: {exam.score}
                      </div>
                    )}
                    {activeTab === 'ongoing' && studentEmail && (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#888', fontStyle: 'italic' }}>
                        Code sent to: {studentEmail}
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        {activeTab === 'ongoing' && (
          <div className="code-entry-section">
            <Row className="align-items-center">
              <Col md={6}>
                <h5>Enter Your Exam Code</h5>
                <p>Eligible students receive a unique exam code via email ({studentEmail || 'your registered email'}). Enter it below to start your exam.</p>
              </Col>
              <Col md={6}>
                <Form onSubmit={handleEnterExam}>
                  {codeError && (
                    <Alert variant="danger" className="py-2" style={{ borderRadius: 10, fontSize: 13 }}>{codeError}</Alert>
                  )}
                  <div className="d-flex gap-2">
                    <Form.Control className="code-input flex-grow-1" type="text" placeholder="Enter exam code"
                      value={examCode} onChange={function (e) { setExamCode(e.target.value); }} maxLength={12} />
                    <Button type="submit" className="btn-enter-exam">Enter</Button>
                  </div>
                  <small style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8, display: 'block' }}>
                    Check your email ({studentEmail || '...'}) for the exam code
                  </small>
                </Form>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <Modal show={showReminderModal} onHide={function () { setShowReminderModal(false); }} centered className="modal-reminder">
        <Modal.Body style={{ padding: 0 }}>
          <div className="reminder-modal-content">
            <div className="reminder-modal-header">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#ff9800" strokeWidth="3" fill="#fff8e1"/>
                <text x="24" y="32" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ff9800">!</text>
              </svg>
              <h4>Exam Reminder</h4>
              <p>The following exam{reminderExams.length > 1 ? 's are' : ' is'} expiring soon!</p>
            </div>
            <div className="reminder-exam-list">
              {reminderExams.map(function (exam) {
                return (
                  <div key={exam.examCode} className="reminder-exam-item">
                    <div className="reminder-exam-info">
                      <div className="reminder-exam-title">{exam.title}</div>
                      <div className="reminder-exam-code">Code: {exam.examCode}</div>
                      <div className="reminder-exam-time">Time remaining: <strong>{getTimeRemaining(exam.deadline)}</strong></div>
                      {studentEmail && <div className="reminder-exam-email">Code sent to: {studentEmail}</div>}
                    </div>
                    <div className="reminder-exam-actions">
                      <Button size="sm" style={{ borderRadius: 8, fontWeight: 600, background: '#5B0A7B', border: 'none', color: '#fff' }}
                        onClick={function () { setShowReminderModal(false); setExamCode(exam.examCode); setActiveTab('ongoing'); }}>
                        Enter Code
                      </Button>
                      <Button size="sm" variant="outline-secondary" style={{ borderRadius: 8, fontWeight: 600 }}
                        onClick={function () { dismissReminder(exam.examCode); }}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="reminder-modal-footer">
              <Button variant="outline-secondary" onClick={dismissAllReminders} style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px' }}>Dismiss All</Button>
              <Button onClick={function () { setShowReminderModal(false); }} style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px', background: '#5B0A7B', border: 'none' }}>Close</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExamPortal;