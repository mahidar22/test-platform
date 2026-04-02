import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Alert, Modal, Table } from 'react-bootstrap';

const AdminSidebar = ({ active, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/admin' },
    { key: 'create', label: 'Create Exam', icon: '➕', path: '/admin/create' },
    { key: 'exams', label: 'Manage Exams', icon: '📝', path: '/admin/exams' },
    { key: 'results', label: 'View Results', icon: '📊', path: '/admin/results' },
    { key: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div className="sidebar">
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: 1 }}>
          Admin Panel
        </h2>
        <span style={{ color: '#CE93D8', fontSize: 11 }}>ExamPortal</span>
      </div>

      <div style={{ padding: '16px 0', flex: 1 }}>
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`sidebar-item ${active === item.key ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', margin: '4px 12px', borderRadius: 10,
              cursor: 'pointer',
              color: active === item.key ? '#fff' : 'rgba(255,255,255,0.7)',
              background: active === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: active === item.key ? 600 : 400,
              fontSize: 14, transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD HOME
// ══════════════════════════════════════════════════════════════
const AdminDashboard = ({ admin, onLogout, customExams, examResults }) => {
  const navigate = useNavigate();

  const handleLogout = () => { onLogout(); navigate('/'); };

  const adminEmail = admin?.email;
  const adminInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : '';

  const activeExamsCount = customExams?.filter(e => {
    if (!e.deadline) return true;
    return new Date(e.deadline) > new Date();
  }).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar active="dashboard" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Admin Dashboard</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{adminEmail}</div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>{adminInitial}</div>
          </div>
        </div>

        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E3F2FD' }}>📝</div>
              <h5>Total Exams</h5>
              <h2>{customExams?.length}</h2>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E8F5E9' }}>✅</div>
              <h5>Active Exams</h5>
              <h2>{activeExamsCount}</h2>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3E0' }}>👥</div>
              <h5>Submissions</h5>
              <h2>{examResults?.length}</h2>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F3E5F5' }}>📊</div>
              <h5>Avg Score</h5>
              <h2>—</h2>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/create')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#E8F5E9', marginBottom: 0 }}>➕</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>Create New Exam</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Upload PDF and set answer key</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/exams')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#FFF3E0', marginBottom: 0 }}>📋</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>Manage Exams</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>View and edit existing exams</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/results')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#E3F2FD', marginBottom: 0 }}>📈</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>View Results</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Check student submissions</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/settings')}>
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon" style={{ background: '#F3E5F5', marginBottom: 0 }}>⚙️</div>
                <div>
                  <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>Settings</h5>
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Configure portal settings</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {customExams?.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h5 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 16 }}>Recent Exams</h5>
            <div className="create-exam-card">
              <Table responsive hover style={{ marginBottom: 0 }}>
                <thead>
                  <tr style={{ background: '#F8F0FB' }}>
                    <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Title</th>
                    <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Code</th>
                    <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Questions</th>
                    <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Duration</th>
                    <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customExams.slice(0, 5).map((exam, idx) => {
                    const isActive = !exam.deadline || new Date(exam.deadline) > new Date();
                    return (
                      <tr key={idx}>
                        <td style={{ padding: 12, fontWeight: 500 }}>{exam.title}</td>
                        <td style={{ padding: 12, fontFamily: 'monospace', letterSpacing: 1 }}>{exam.examCode}</td>
                        <td style={{ padding: 12 }}>{exam.totalQuestions}</td>
                        <td style={{ padding: 12 }}>{exam.duration} min</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            background: isActive ? '#e8f5e9' : '#ffebee',
                            color: isActive ? '#2e7d32' : '#c62828',
                          }}>
                            {isActive ? 'Active' : 'Expired'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CREATE EXAM PAGE (with OK button for deadline)
// ══════════════════════════════════════════════════════════════
const CreateExam = ({ admin, onLogout, onCreateExam, settings }) => {
  const navigate = useNavigate();

  const defaultOptions = settings?.defaultOptionsCount;
  const shuffleEnabled = settings?.shuffleQuestions;

  const [title, setTitle] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [optionsCount, setOptionsCount] = useState(defaultOptions);
  const [duration, setDuration] = useState('');

  // Deadline with OK button
  const [deadlineInput, setDeadlineInput] = useState('');
  const [confirmedDeadline, setConfirmedDeadline] = useState('');
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [answerKey, setAnswerKey] = useState({});
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [examCode, setExamCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => { onLogout(); navigate('/'); };

  const adminEmail = admin?.email;
  const adminInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : '';

  const generateExamCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleAnswerSelect = (qIndex, optIndex) => {
    if (answerKey[qIndex] === optIndex) {
      const updated = { ...answerKey };
      delete updated[qIndex];
      setAnswerKey(updated);
    } else {
      setAnswerKey({ ...answerKey, [qIndex]: optIndex });
    }
  };

  const setAllAnswers = (optIndex) => {
    const newKey = {};
    for (let i = 0; i < totalQuestions; i++) newKey[i] = optIndex;
    setAnswerKey(newKey);
  };

  const clearAllAnswers = () => setAnswerKey({});

  // Deadline OK button handlers
  const openDeadlinePicker = () => {
    setDeadlineInput(confirmedDeadline);
    setShowDeadlineModal(true);
  };

  const confirmDeadline = () => {
    setConfirmedDeadline(deadlineInput);
    setShowDeadlineModal(false);
  };

  const clearDeadline = () => {
    setDeadlineInput('');
    setConfirmedDeadline('');
    setShowDeadlineModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Please enter exam title.'); return; }
    if (!pdfFile) { setError('Please upload a PDF question paper.'); return; }
    if (Object.keys(answerKey).length < totalQuestions) {
      setError(`Please set answers for all ${totalQuestions} questions. (${Object.keys(answerKey).length}/${totalQuestions} set)`);
      return;
    }

    const code = generateExamCode();
    setExamCode(code);

    const newExam = {
      id: Date.now(),
      title: title.trim(),
      examCode: code,
      totalQuestions: parseInt(totalQuestions),
      optionsCount: parseInt(optionsCount),
      duration: parseInt(duration),
      deadline: confirmedDeadline || null,
      pdfUrl, pdfFile, answerKey,
      shuffleQuestions: shuffleEnabled,
      createdAt: new Date().toISOString(),
    };

    onCreateExam(newExam);
    setSuccess(true);
  };

  const resetForm = () => {
    setTitle(''); setTotalQuestions(''); setOptionsCount(defaultOptions);
    setDuration(''); setDeadlineInput(''); setConfirmedDeadline('');
    setPdfFile(null); setPdfUrl(''); setAnswerKey({});
    setShowAnswerKey(false); setExamCode(''); setSuccess(false); setError('');
  };

  const getOptionLabel = (optIdx) => {
    if (parseInt(optionsCount) === 2) return optIdx === 0 ? 'T' : 'F';
    return String.fromCharCode(65 + optIdx);
  };

  const answeredCount = Object.keys(answerKey).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const formatDeadlineDisplay = (dl) => {
    if (!dl) return '';
    return new Date(dl).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar active="create" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Create New Exam</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{adminEmail}</div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>{adminInitial}</div>
          </div>
        </div>

        {success ? (
          <div className="create-exam-card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h4 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 8 }}>Exam Created Successfully!</h4>
            <p style={{ color: '#888', marginBottom: 24 }}>Share this code with your students</p>
            <div style={{
              background: 'linear-gradient(135deg, #2D0040, #5B0A7B)',
              borderRadius: 16, padding: 24, display: 'inline-block', marginBottom: 24,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 }}>EXAM CODE</div>
              <div style={{ color: '#fff', fontSize: 32, fontWeight: 700, letterSpacing: 4, fontFamily: 'monospace' }}>
                {examCode}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button onClick={resetForm} style={{ background: '#5B0A7B', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600 }}>
                Create Another Exam
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/admin')} style={{ borderRadius: 10, padding: '10px 24px', fontWeight: 600 }}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger" style={{ borderRadius: 10 }}>{error}</Alert>}

            <Row className="g-4">
              <Col lg={8}>
                <div className="create-exam-card">
                  <h5 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 24 }}>Exam Details</h5>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Exam Title</Form.Label>
                    <Form.Control type="text" className="form-input-custom" placeholder="e.g., Data Structures Mid-Term"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Total Questions</Form.Label>
                        <Form.Control type="number" className="form-input-custom" min="1" max="200"
                          value={totalQuestions} onChange={(e) => { setTotalQuestions(e.target.value); setAnswerKey({}); }} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Options per Question</Form.Label>
                        <Form.Select className="form-input-custom" value={optionsCount}
                          onChange={(e) => { setOptionsCount(e.target.value); setAnswerKey({}); }}>
                          <option value="2">2 (True/False)</option>
                          <option value="4">4 (A, B, C, D)</option>
                          <option value="5">5 (A, B, C, D, E)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Duration (minutes)</Form.Label>
                        <Form.Control type="number" className="form-input-custom" min="5" max="300"
                          value={duration} onChange={(e) => setDuration(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Deadline with OK Button */}
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">Deadline (Optional)</Form.Label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {confirmedDeadline ? (
                        <div style={{
                          flex: 1, padding: '12px 16px', borderRadius: 10,
                          border: '1.5px solid #4caf50', background: '#f1f8e9',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                          <div>
                            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase' }}>Deadline Set</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#2D0040' }}>
                              {formatDeadlineDisplay(confirmedDeadline)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button size="sm" variant="outline-primary" onClick={openDeadlinePicker}
                              style={{ borderRadius: 8, fontWeight: 600, fontSize: 12 }}>Change</Button>
                            <Button size="sm" variant="outline-danger" onClick={clearDeadline}
                              style={{ borderRadius: 8, fontWeight: 600, fontSize: 12 }}>Remove</Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline-secondary" onClick={openDeadlinePicker}
                          style={{ borderRadius: 10, padding: '12px 24px', fontWeight: 600, width: '100%',
                            border: '1.5px dashed #E1BEE7', color: '#888', background: '#fafafa' }}>
                          📅 Click to Set Deadline
                        </Button>
                      )}
                    </div>
                    <Form.Text style={{ color: '#888', fontSize: 11 }}>
                      Leave empty for no deadline
                    </Form.Text>
                  </Form.Group>

                  {/* PDF Upload */}
                  <div className="pdf-upload-zone">
                    <label className="pdf-upload-label">
                      <input type="file" accept="application/pdf" onChange={handlePdfChange} style={{ display: 'none' }} />
                      {pdfFile ? (
                        <div className="pdf-uploaded-info">
                          <span style={{ fontSize: 40 }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 600, color: '#2D0040' }}>{pdfFile.name}</div>
                            <div style={{ fontSize: 12, color: '#888' }}>{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                      ) : (
                        <div className="pdf-upload-placeholder">
                          <span style={{ fontSize: 48, marginBottom: 12 }}>📤</span>
                          <div style={{ fontWeight: 600, color: '#5B0A7B', marginBottom: 4 }}>Click to upload PDF</div>
                          <div style={{ fontSize: 12, color: '#888' }}>Question paper in PDF format</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Answer Key Section */}
                <div className="answer-key-section" style={{ marginTop: 24 }}>
                  <div className="answer-key-header" onClick={() => setShowAnswerKey(!showAnswerKey)}>
                    <div>
                      <h6 style={{ margin: 0, fontWeight: 700, color: '#2D0040' }}>Answer Key</h6>
                      <span style={{ fontSize: 12, color: '#888' }}>{answeredCount} of {totalQuestions} answers set</span>
                    </div>
                    <span style={{ fontSize: 20 }}>{showAnswerKey ? '▼' : '▶'}</span>
                  </div>

                  {showAnswerKey && (
                    <div className="answer-key-body">
                      <div className="answer-key-progress">
                        <div className="answer-key-progress-bar" style={{ width: `${progressPercent}%` }} />
                      </div>

                      <div className="ak-quick-actions">
                        <span style={{ fontSize: 12, color: '#888', marginRight: 8 }}>Quick Set:</span>
                        {Array.from({ length: parseInt(optionsCount) }, (_, i) => (
                          <button key={i} type="button" className="ak-quick-btn" onClick={() => setAllAnswers(i)}>
                            All {getOptionLabel(i)}
                          </button>
                        ))}
                        <button type="button" className="ak-quick-btn ak-quick-btn-clear" onClick={clearAllAnswers}>
                          Clear All
                        </button>
                      </div>

                      <div className="ak-column-header">
                        <div className="ak-col-q">Q.No</div>
                        <div className="ak-col-options">
                          {Array.from({ length: parseInt(optionsCount) }, (_, i) => (
                            <span key={i}>{getOptionLabel(i)}</span>
                          ))}
                        </div>
                        <div className="ak-col-status">Status</div>
                      </div>

                      <div className="ak-rows-container">
                        {Array.from({ length: parseInt(totalQuestions) }, (_, qIdx) => (
                          <div key={qIdx} className={`ak-row ${answerKey[qIdx] !== undefined ? 'ak-row-set' : ''}`}>
                            <div className="ak-q-number">
                              <span className={`ak-q-badge ${answerKey[qIdx] !== undefined ? 'set' : 'unset'}`}>{qIdx + 1}</span>
                            </div>
                            <div className="ak-options">
                              {Array.from({ length: parseInt(optionsCount) }, (_, optIdx) => (
                                <div key={optIdx}
                                  className={`ak-option-bubble ${answerKey[qIdx] === optIdx ? 'correct' : ''}`}
                                  onClick={() => handleAnswerSelect(qIdx, optIdx)}>
                                  {getOptionLabel(optIdx)}
                                </div>
                              ))}
                            </div>
                            <div className="ak-status">{answerKey[qIdx] !== undefined ? '✓' : '—'}</div>
                          </div>
                        ))}
                      </div>

                      <div className="ak-bottom-summary">
                        <span style={{ fontSize: 13, color: '#888' }}>Progress: {answeredCount}/{totalQuestions} ({progressPercent}%)</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: answeredCount === parseInt(totalQuestions) ? '#4caf50' : '#ff9800' }}>
                          {answeredCount === parseInt(totalQuestions) ? '✓ Complete' : `${parseInt(totalQuestions) - answeredCount} remaining`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Preview Panel */}
              <Col lg={4}>
                <div className="exam-preview-box">
                  <h6 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Exam Preview</h6>
                  <Row>
                    <Col xs={6}>
                      <div className="preview-item">
                        <div className="preview-value">{totalQuestions}</div>
                        <div className="preview-label">Questions</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="preview-item">
                        <div className="preview-value">{duration} min</div>
                        <div className="preview-label">Duration</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="preview-item">
                        <div className="preview-value">{parseInt(optionsCount) === 2 ? 'T/F' : optionsCount}</div>
                        <div className="preview-label">Options</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="preview-item">
                        <div className="preview-value" style={{ color: pdfFile ? '#4caf50' : '#ccc' }}>{pdfFile ? '✓' : '—'}</div>
                        <div className="preview-label">PDF</div>
                      </div>
                    </Col>
                  </Row>

                  {confirmedDeadline && (
                    <div style={{ marginTop: 16, padding: 12, background: '#f1f8e9', borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase' }}>Deadline</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32' }}>{formatDeadlineDisplay(confirmedDeadline)}</div>
                    </div>
                  )}

                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E1BEE7' }}>
                    <div className="preview-item">
                      <div className="preview-value" style={{ color: answeredCount === parseInt(totalQuestions) ? '#4caf50' : '#ff9800' }}>
                        {answeredCount}/{totalQuestions}
                      </div>
                      <div className="preview-label">Answer Key</div>
                    </div>
                  </div>

                  <Button type="submit" style={{
                    width: '100%', marginTop: 24,
                    background: 'linear-gradient(135deg, #2D0040, #5B0A7B)',
                    border: 'none', borderRadius: 10, padding: 14, fontWeight: 700,
                  }} disabled={!title || !pdfFile || answeredCount !== parseInt(totalQuestions)}>
                    Create Exam
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}

        {/* ── Deadline Picker Modal with OK Button ── */}
        <Modal show={showDeadlineModal} onHide={() => setShowDeadlineModal(false)} centered>
          <Modal.Body style={{ padding: 0 }}>
            <div style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <h5 style={{ fontWeight: 700, color: '#2D0040', marginBottom: 4 }}>Set Exam Deadline</h5>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Choose the date and time when this exam expires</p>

              <Form.Control
                type="datetime-local"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                style={{
                  borderRadius: 12, padding: '14px 16px', border: '2px solid #E1BEE7',
                  fontSize: 16, fontWeight: 500, textAlign: 'center', marginBottom: 12,
                }}
              />

              {deadlineInput && (
                <div style={{
                  background: '#F8F0FB', borderRadius: 10, padding: 12,
                  marginBottom: 20, fontSize: 14, color: '#5B0A7B', fontWeight: 500,
                }}>
                  Selected: {formatDeadlineDisplay(deadlineInput)}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                <Button variant="outline-secondary" onClick={() => setShowDeadlineModal(false)}
                  style={{ borderRadius: 10, padding: '10px 28px', fontWeight: 600 }}>
                  Cancel
                </Button>
                <Button variant="outline-danger" onClick={clearDeadline}
                  style={{ borderRadius: 10, padding: '10px 28px', fontWeight: 600 }}>
                  No Deadline
                </Button>
                <Button onClick={confirmDeadline} disabled={!deadlineInput}
                  style={{
                    borderRadius: 10, padding: '10px 28px', fontWeight: 700,
                    background: '#5B0A7B', border: 'none', fontSize: 15,
                  }}>
                  ✓ OK — Set Deadline
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MANAGE EXAMS PAGE
// ══════════════════════════════════════════════════════════════
const ManageExams = ({ admin, onLogout, customExams, onDeleteExam }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  const handleLogout = () => { onLogout(); navigate('/'); };

  const adminEmail = admin?.email;
  const adminInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : '';

  const confirmDelete = () => {
    if (examToDelete && onDeleteExam) onDeleteExam(examToDelete.id);
    setShowDeleteModal(false);
    setExamToDelete(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar active="exams" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Manage Exams</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{adminEmail}</div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>{adminInitial}</div>
          </div>
        </div>

        {!customExams?.length ? (
          <div className="create-exam-card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
            <h4 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 8 }}>No Exams Created Yet</h4>
            <p style={{ color: '#888', marginBottom: 24 }}>Create your first exam to get started</p>
            <Button onClick={() => navigate('/admin/create')}
              style={{ background: 'linear-gradient(135deg, #5B0A7B, #7B1FA2)', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 600 }}>
              Create Exam
            </Button>
          </div>
        ) : (
          <div className="create-exam-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700 }}>All Exams ({customExams.length})</h5>
              <Button onClick={() => navigate('/admin/create')}
                style={{ background: '#5B0A7B', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13 }}>
                + New Exam
              </Button>
            </div>

            <Table responsive hover>
              <thead>
                <tr style={{ background: '#F8F0FB' }}>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Title</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Code</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Questions</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Duration</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Deadline</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Status</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customExams.map((exam, idx) => {
                  const isActive = !exam.deadline || new Date(exam.deadline) > new Date();
                  return (
                    <tr key={idx}>
                      <td style={{ padding: 12, fontWeight: 500 }}>{exam.title}</td>
                      <td style={{ padding: 12, fontFamily: 'monospace', letterSpacing: 1, fontWeight: 600 }}>{exam.examCode}</td>
                      <td style={{ padding: 12 }}>{exam.totalQuestions}</td>
                      <td style={{ padding: 12 }}>{exam.duration} min</td>
                      <td style={{ padding: 12, fontSize: 13 }}>
                        {exam.deadline
                          ? new Date(exam.deadline).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: isActive ? '#e8f5e9' : '#ffebee', color: isActive ? '#2e7d32' : '#c62828',
                        }}>
                          {isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>
                        <Button size="sm" variant="outline-danger"
                          onClick={() => { setExamToDelete(exam); setShowDeleteModal(true); }}
                          style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700, fontSize: 18 }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this exam?</p>
          {examToDelete && (
            <div style={{ background: '#F8F0FB', padding: 16, borderRadius: 10 }}>
              <strong>{examToDelete.title}</strong>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Code: {examToDelete.examCode}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ borderRadius: 8 }}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} style={{ borderRadius: 8 }}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// VIEW RESULTS PAGE
// ══════════════════════════════════════════════════════════════
const ViewResults = ({ admin, onLogout, examResults }) => {
  const navigate = useNavigate();
  const handleLogout = () => { onLogout(); navigate('/'); };

  const adminEmail = admin?.email;
  const adminInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar active="results" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Student Results</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{adminEmail}</div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>{adminInitial}</div>
          </div>
        </div>

        {!examResults?.length ? (
          <div className="create-exam-card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
            <h4 style={{ color: '#2D0040', fontWeight: 700, marginBottom: 8 }}>No Results Yet</h4>
            <p style={{ color: '#888' }}>Student submissions will appear here</p>
          </div>
        ) : (
          <div className="create-exam-card">
            <h5 style={{ margin: 0, color: '#2D0040', fontWeight: 700, marginBottom: 20 }}>
              All Submissions ({examResults.length})
            </h5>
            <Table responsive hover>
              <thead>
                <tr style={{ background: '#F8F0FB' }}>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Student</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Exam</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Code</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Attempted</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Status</th>
                  <th style={{ fontWeight: 600, color: '#5B0A7B', padding: 12 }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 12, fontWeight: 500 }}>{result.studentEmail}</td>
                    <td style={{ padding: 12 }}>{result.examTitle}</td>
                    <td style={{ padding: 12, fontFamily: 'monospace' }}>{result.examCode}</td>
                    <td style={{ padding: 12 }}>{result.attempted}/{result.total}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: result.terminated ? '#ffebee' : '#e8f5e9',
                        color: result.terminated ? '#c62828' : '#2e7d32',
                      }}>
                        {result.terminated ? 'Terminated' : 'Completed'}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: '#888' }}>
                      {new Date(result.submittedAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════════
const AdminSettings = ({ admin, onLogout, settings, onUpdateSettings }) => {
  const navigate = useNavigate();
  const handleLogout = () => { onLogout(); navigate('/'); };

  const adminEmail = admin?.email;
  const adminInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : '';

  const [defaultOptionsCount, setDefaultOptionsCount] = useState(settings?.defaultOptionsCount);
  const [shuffleQuestions, setShuffleQuestions] = useState(settings?.shuffleQuestions);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      defaultOptionsCount: parseInt(defaultOptionsCount),
      shuffleQuestions,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar active="settings" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Settings</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{adminEmail}</div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>{adminInitial}</div>
          </div>
        </div>

        {saved && (
          <Alert variant="success" style={{ borderRadius: 10, fontWeight: 600 }}>
            ✓ Settings saved successfully!
          </Alert>
        )}

        <Row className="g-4">
          {/* Question Options Setting */}
          <Col lg={6}>
            <div className="create-exam-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#F3E5F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>🔢</div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700, color: '#2D0040' }}>Default Options per Question</h5>
                  <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Set the default number of options when creating exams</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {/* True/False Option */}
                <div
                  onClick={() => setDefaultOptionsCount(2)}
                  style={{
                    flex: 1, minWidth: 140, padding: 20, borderRadius: 14, cursor: 'pointer',
                    border: defaultOptionsCount === 2 ? '2.5px solid #5B0A7B' : '2px solid #E1BEE7',
                    background: defaultOptionsCount === 2 ? '#F8F0FB' : '#fff',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅❌</div>
                  <div style={{ fontWeight: 700, color: '#2D0040', fontSize: 16 }}>True / False</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>2 options per question</div>
                  {defaultOptionsCount === 2 && (
                    <div style={{
                      marginTop: 10, padding: '4px 14px', borderRadius: 20,
                      background: '#5B0A7B', color: '#fff', fontSize: 12, fontWeight: 600,
                      display: 'inline-block',
                    }}>Selected</div>
                  )}
                </div>

                {/* 4 Options */}
                <div
                  onClick={() => setDefaultOptionsCount(4)}
                  style={{
                    flex: 1, minWidth: 140, padding: 20, borderRadius: 14, cursor: 'pointer',
                    border: defaultOptionsCount === 4 ? '2.5px solid #5B0A7B' : '2px solid #E1BEE7',
                    background: defaultOptionsCount === 4 ? '#F8F0FB' : '#fff',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔠</div>
                  <div style={{ fontWeight: 700, color: '#2D0040', fontSize: 16 }}>MCQ (A–D)</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>4 options per question</div>
                  {defaultOptionsCount === 4 && (
                    <div style={{
                      marginTop: 10, padding: '4px 14px', borderRadius: 20,
                      background: '#5B0A7B', color: '#fff', fontSize: 12, fontWeight: 600,
                      display: 'inline-block',
                    }}>Selected</div>
                  )}
                </div>

                {/* 5 Options */}
                <div
                  onClick={() => setDefaultOptionsCount(5)}
                  style={{
                    flex: 1, minWidth: 140, padding: 20, borderRadius: 14, cursor: 'pointer',
                    border: defaultOptionsCount === 5 ? '2.5px solid #5B0A7B' : '2px solid #E1BEE7',
                    background: defaultOptionsCount === 5 ? '#F8F0FB' : '#fff',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                  <div style={{ fontWeight: 700, color: '#2D0040', fontSize: 16 }}>MCQ (A–E)</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>5 options per question</div>
                  {defaultOptionsCount === 5 && (
                    <div style={{
                      marginTop: 10, padding: '4px 14px', borderRadius: 20,
                      background: '#5B0A7B', color: '#fff', fontSize: 12, fontWeight: 600,
                      display: 'inline-block',
                    }}>Selected</div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Shuffle Setting */}
          <Col lg={6}>
            <div className="create-exam-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#E3F2FD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>🔀</div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700, color: '#2D0040' }}>Question Shuffling</h5>
                  <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Randomize question order for each student</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div
                  onClick={() => setShuffleQuestions(false)}
                  style={{
                    flex: 1, padding: 20, borderRadius: 14, cursor: 'pointer',
                    border: !shuffleQuestions ? '2.5px solid #5B0A7B' : '2px solid #E1BEE7',
                    background: !shuffleQuestions ? '#F8F0FB' : '#fff',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <div style={{ fontWeight: 700, color: '#2D0040' }}>Sequential</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Questions in original order</div>
                  {!shuffleQuestions && (
                    <div style={{
                      marginTop: 10, padding: '4px 14px', borderRadius: 20,
                      background: '#5B0A7B', color: '#fff', fontSize: 12, fontWeight: 600,
                      display: 'inline-block',
                    }}>Selected</div>
                  )}
                </div>

                <div
                  onClick={() => setShuffleQuestions(true)}
                  style={{
                    flex: 1, padding: 20, borderRadius: 14, cursor: 'pointer',
                    border: shuffleQuestions ? '2.5px solid #5B0A7B' : '2px solid #E1BEE7',
                    background: shuffleQuestions ? '#F8F0FB' : '#fff',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔀</div>
                  <div style={{ fontWeight: 700, color: '#2D0040' }}>Shuffled</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Randomized for each student</div>
                  {shuffleQuestions && (
                    <div style={{
                      marginTop: 10, padding: '4px 14px', borderRadius: 20,
                      background: '#5B0A7B', color: '#fff', fontSize: 12, fontWeight: 600,
                      display: 'inline-block',
                    }}>Selected</div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Current Settings Summary */}
          <Col lg={12}>
            <div className="create-exam-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h6 style={{ fontWeight: 700, color: '#2D0040', marginBottom: 4 }}>Current Settings</h6>
                  <div style={{ fontSize: 13, color: '#888' }}>
                    Default Options: <strong style={{ color: '#5B0A7B' }}>
                      {defaultOptionsCount === 2 ? 'True/False' : `${defaultOptionsCount} Options (MCQ)`}
                    </strong>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    Shuffle: <strong style={{ color: '#5B0A7B' }}>
                      {shuffleQuestions ? 'Enabled' : 'Disabled'}
                    </strong>
                  </div>
                </div>
                <Button onClick={handleSave} style={{
                  background: 'linear-gradient(135deg, #2D0040, #5B0A7B)',
                  border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 15,
                }}>
                  Save Settings
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { AdminDashboard, CreateExam, ManageExams, ViewResults, AdminSettings, AdminSidebar };
export default AdminDashboard;
