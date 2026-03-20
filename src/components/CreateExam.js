import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { AdminSidebar } from './AdminDashboard';

const CreateExam = ({ user, onLogout, addExam }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('10');
  const [optionsCount, setOptionsCount] = useState('4');
  const [duration, setDuration] = useState('60');
  const [deadline, setDeadline] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [answerKey, setAnswerKey] = useState({});
  const [showAnswerKeySection, setShowAnswerKeySection] = useState(false);

  const handleLogout = () => { onLogout(); navigate('/'); };

  // ── Parse values safely ──
  const qCount = Math.max(1, Math.min(200, parseInt(totalQuestions) || 1));
  const optNum = parseInt(optionsCount) || 4;
  const answeredCount = Object.keys(answerKey).length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') { setError('Please upload a PDF file only.'); return; }
      if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB.'); return; }
      setPdfFile(file);
      setPdfFileName(file.name);
      setError('');
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setExamCode(code);
  };

  // ── Handle question count change ──
  const handleQuestionCountChange = (value) => {
    setTotalQuestions(value);
    // Clean up answer key: remove answers for questions that no longer exist
    const newCount = Math.max(1, Math.min(200, parseInt(value) || 1));
    const updatedKey = {};
    Object.keys(answerKey).forEach((key) => {
      const idx = parseInt(key);
      if (idx < newCount) {
        updatedKey[key] = answerKey[key];
      }
    });
    setAnswerKey(updatedKey);
  };

  // ── Handle options count change ──
  const handleOptionsCountChange = (value) => {
    setOptionsCount(value);
    // Clear answers that are out of range with new option count
    const newOptCount = parseInt(value) || 4;
    const updatedKey = {};
    Object.keys(answerKey).forEach((key) => {
      if (answerKey[key] < newOptCount) {
        updatedKey[key] = answerKey[key];
      }
    });
    setAnswerKey(updatedKey);
  };

  // ── Set answer for a question ──
  const setAnswer = (qIndex, optIndex) => {
    if (answerKey[qIndex] === optIndex) {
      const updated = { ...answerKey };
      delete updated[qIndex];
      setAnswerKey(updated);
    } else {
      setAnswerKey({ ...answerKey, [qIndex]: optIndex });
    }
  };

  // ── Set all answers at once ──
  const setAllAnswers = (optIndex) => {
    const newKey = {};
    for (let i = 0; i < qCount; i++) {
      newKey[i] = optIndex;
    }
    setAnswerKey(newKey);
  };

  // ── Clear all answers ──
  const clearAllAnswers = () => {
    setAnswerKey({});
  };

  const getOptionLabel = (optIdx) => {
    if (optNum === 2) return optIdx === 0 ? 'T' : 'F';
    return String.fromCharCode(65 + optIdx);
  };

  const getOptionsLabel = () => {
    switch (optNum) {
      case 2: return 'True / False';
      case 3: return 'A, B, C';
      case 4: return 'A, B, C, D';
      case 5: return 'A, B, C, D, E';
      default: return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) { setError('Please enter exam title.'); return; }
    if (!examCode) { setError('Please generate an exam code by clicking the Generate button.'); return; }
    if (!pdfFile) { setError('Please upload a PDF question paper.'); return; }
    if (qCount < 1) { setError('Number of questions must be at least 1.'); return; }
    if ((parseInt(duration) || 0) < 1) { setError('Duration must be at least 1 minute.'); return; }
    if (!deadline) { setError('Please set a deadline for the exam.'); return; }

    if (answeredCount < qCount) {
      setError(`Please set correct answers for all questions. ${answeredCount}/${qCount} set. Open the Answer Key section below.`);
      setShowAnswerKeySection(true);
      return;
    }

    const pdfUrl = URL.createObjectURL(pdfFile);

    const newExam = {
      id: Date.now(),
      title: title.trim(),
      examCode: examCode,
      pdfUrl: pdfUrl,
      pdfFileName: pdfFileName,
      totalQuestions: qCount,
      optionsCount: optNum,
      duration: parseInt(duration),
      deadline: deadline,
      answerKey: { ...answerKey },
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    addExam(newExam);
    setSuccess(`Exam "${newExam.title}" created successfully! Code: ${newExam.examCode}`);

    setTitle('');
    setExamCode('');
    setTotalQuestions('10');
    setOptionsCount('4');
    setDuration('60');
    setDeadline('');
    setPdfFile(null);
    setPdfFileName('');
    setAnswerKey({});
    setShowAnswerKeySection(false);

    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar active="create" onLogout={handleLogout} />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h3>Create New Exam</h3>
          <div className="user-info">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Administrator</div>
            </div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #e53935, #c62828)' }}>A</div>
          </div>
        </div>

        <div className="create-exam-card">
          {success && (
            <Alert variant="success" style={{ borderRadius: 12, fontWeight: 600 }} dismissible onClose={() => setSuccess('')}>
              {success}
              <div style={{ marginTop: 8 }}>
                <Button variant="success" size="sm" style={{ borderRadius: 8, fontWeight: 600 }}
                  onClick={() => navigate('/admin')}>View All Exams</Button>
              </div>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" style={{ borderRadius: 12 }} dismissible onClose={() => setError('')}>{error}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Title */}
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Exam Title *</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Operating Systems Mid-Term Exam"
                    value={title} onChange={(e) => setTitle(e.target.value)} className="form-input-custom" />
                </Form.Group>
              </Col>

              {/* Exam Code */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Exam Code *</Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <div style={{
                      flex: 1, padding: '12px 16px', background: examCode ? '#e8f5e9' : '#f5f5f5',
                      borderRadius: 10, border: `2px solid ${examCode ? '#4caf50' : '#ddd'}`,
                      fontFamily: 'monospace', fontWeight: 700, fontSize: 18, letterSpacing: 3,
                      textAlign: 'center', color: examCode ? '#1a1a2e' : '#bbb', minHeight: 48,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {examCode || '------'}
                    </div>
                    <Button variant="primary" onClick={generateCode}
                      style={{ borderRadius: 10, fontWeight: 600, whiteSpace: 'nowrap', padding: '12px 20px' }}>
                      Generate
                    </Button>
                  </div>
                  <Form.Text style={{ color: '#888', fontSize: 11 }}>Click Generate to create a unique exam code</Form.Text>
                </Form.Group>
              </Col>

              {/* PDF Upload */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Upload Question Paper (PDF) *</Form.Label>
                  <div className="pdf-upload-zone">
                    <input type="file" id="pdf-upload" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="pdf-upload" className="pdf-upload-label">
                      {pdfFileName ? (
                        <div className="pdf-uploaded-info">
                          <span style={{ fontSize: 36 }}>PDF</span>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{pdfFileName}</div>
                            <div style={{ fontSize: 12, color: '#4caf50', fontWeight: 600 }}>File selected — Click to change</div>
                          </div>
                        </div>
                      ) : (
                        <div className="pdf-upload-placeholder">
                          <span style={{ fontSize: 48, color: '#aaa' }}>Upload</span>
                          <div style={{ fontWeight: 700, color: '#1a1a2e', marginTop: 8 }}>Click to upload PDF</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Max file size: 10MB</div>
                        </div>
                      )}
                    </label>
                  </div>
                </Form.Group>
              </Col>

              {/* Questions */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Number of Questions *</Form.Label>
                  <Form.Control type="number" min="1" max="200" value={totalQuestions}
                    onChange={(e) => handleQuestionCountChange(e.target.value)}
                    className="form-input-custom" />
                  <Form.Text style={{ color: '#888', fontSize: 11 }}>
                    1 to 200 questions supported
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Options per Question */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Options per Question *</Form.Label>
                  <Form.Select value={optionsCount}
                    onChange={(e) => handleOptionsCountChange(e.target.value)}
                    className="form-input-custom">
                    <option value="2">2 — True / False</option>
                    <option value="3">3 — A, B, C</option>
                    <option value="4">4 — A, B, C, D</option>
                    <option value="5">5 — A, B, C, D, E</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Duration */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Duration (minutes) *</Form.Label>
                  <Form.Control type="number" min="1" max="300" value={duration}
                    onChange={(e) => setDuration(e.target.value)} className="form-input-custom" />
                </Form.Group>
              </Col>

              {/* Deadline */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Exam Deadline *</Form.Label>
                  <Form.Control type="datetime-local" value={deadline}
                    onChange={(e) => setDeadline(e.target.value)} className="form-input-custom" />
                  <Form.Text style={{ color: '#888', fontSize: 11 }}>Exam expires after this time</Form.Text>
                </Form.Group>
              </Col>

              {/* ══════════════════════════════════════
                  ANSWER KEY SECTION
                 ══════════════════════════════════════ */}
              <Col md={12}>
                <div className="answer-key-section">
                  <div className="answer-key-header" onClick={() => setShowAnswerKeySection(!showAnswerKeySection)}>
                    <div>
                      <h6 style={{ fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                        Answer Key * — Set Correct Answers ({qCount} Questions)
                      </h6>
                      <span style={{ fontSize: 12, color: answeredCount === qCount ? '#4caf50' : '#888' }}>
                        {answeredCount}/{qCount} answers set
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {answeredCount === qCount && qCount > 0 && (
                        <span style={{
                          background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px',
                          borderRadius: 20, fontSize: 12, fontWeight: 600,
                        }}>All Set</span>
                      )}
                      {answeredCount > 0 && answeredCount < qCount && (
                        <span style={{
                          background: '#fff8e1', color: '#f57f17', padding: '4px 12px',
                          borderRadius: 20, fontSize: 12, fontWeight: 600,
                        }}>{qCount - answeredCount} remaining</span>
                      )}
                      <span style={{ fontSize: 20, color: '#888' }}>
                        {showAnswerKeySection ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {showAnswerKeySection && (
                    <div className="answer-key-body">
                      {/* Progress Bar */}
                      <div className="answer-key-progress">
                        <div className="answer-key-progress-bar"
                          style={{ width: `${qCount > 0 ? (answeredCount / qCount) * 100 : 0}%` }}
                        ></div>
                      </div>

                      {/* Quick Actions */}
                      <div className="ak-quick-actions">
                        <span style={{ fontSize: 12, color: '#888', marginRight: 8 }}>Quick fill all:</span>
                        {Array.from({ length: optNum }, (_, i) => (
                          <button
                            key={i}
                            type="button"
                            className="ak-quick-btn"
                            onClick={() => setAllAnswers(i)}
                          >
                            All {getOptionLabel(i)}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ak-quick-btn ak-quick-btn-clear"
                          onClick={clearAllAnswers}
                        >
                          Clear All
                        </button>
                      </div>

                      <div style={{ fontSize: 12, color: '#888', marginBottom: 16, textAlign: 'center' }}>
                        Click the correct option for each question. Re-click to deselect.
                        {qCount > 50 && (
                          <span style={{ color: '#ff9800', fontWeight: 600 }}>
                            {' '}(Scroll down to see all {qCount} questions)
                          </span>
                        )}
                      </div>

                      {/* Column Headers */}
                      <div className="ak-column-header">
                        <div className="ak-col-q">Q.No</div>
                        <div className="ak-col-options">
                          {Array.from({ length: optNum }, (_, i) => (
                            <span key={i}>{getOptionLabel(i)}</span>
                          ))}
                        </div>
                        <div className="ak-col-status">Answer</div>
                      </div>

                      {/* Answer Key Rows — Dynamically generated based on qCount */}
                      <div className="ak-rows-container">
                        {Array.from({ length: qCount }, (_, qIdx) => (
                          <div key={qIdx} className={`ak-row ${answerKey[qIdx] !== undefined ? 'ak-row-set' : ''}`}>
                            <div className="ak-q-number">
                              <span className={`ak-q-badge ${answerKey[qIdx] !== undefined ? 'set' : 'unset'}`}>
                                {qIdx + 1}
                              </span>
                            </div>
                            <div className="ak-options">
                              {Array.from({ length: optNum }, (_, optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`ak-option-bubble ${answerKey[qIdx] === optIdx ? 'correct' : ''}`}
                                  onClick={() => setAnswer(qIdx, optIdx)}
                                >
                                  {getOptionLabel(optIdx)}
                                </div>
                              ))}
                            </div>
                            <div className="ak-status">
                              {answerKey[qIdx] !== undefined ? (
                                <span style={{ color: '#4caf50', fontWeight: 700, fontSize: 13 }}>
                                  {getOptionLabel(answerKey[qIdx])}
                                </span>
                              ) : (
                                <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Summary */}
                      <div className="ak-bottom-summary">
                        <span>
                          {answeredCount === qCount ? (
                            <span style={{ color: '#4caf50', fontWeight: 700 }}>
                              All {qCount} answers set
                            </span>
                          ) : (
                            <span style={{ color: '#e53935', fontWeight: 600 }}>
                              {qCount - answeredCount} answers remaining
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: 12, color: '#888' }}>
                          Total: {qCount} | Set: {answeredCount} | Remaining: {qCount - answeredCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Preview */}
              <Col md={12}>
                <div className="exam-preview-box">
                  <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Exam Summary Preview</h6>
                  <Row>
                    <Col sm={2}><div className="preview-item"><div className="preview-value">{title || '—'}</div><div className="preview-label">Title</div></div></Col>
                    <Col sm={2}><div className="preview-item"><div className="preview-value" style={{ fontFamily: 'monospace', letterSpacing: 2 }}>{examCode || '—'}</div><div className="preview-label">Code</div></div></Col>
                    <Col sm={2}><div className="preview-item"><div className="preview-value">{qCount}</div><div className="preview-label">Questions</div></div></Col>
                    <Col sm={2}><div className="preview-item"><div className="preview-value">{getOptionsLabel()}</div><div className="preview-label">Options</div></div></Col>
                    <Col sm={2}><div className="preview-item"><div className="preview-value">{duration} min</div><div className="preview-label">Duration</div></div></Col>
                    <Col sm={2}><div className="preview-item"><div className="preview-value" style={{ color: answeredCount === qCount && qCount > 0 ? '#4caf50' : '#e53935' }}>{answeredCount}/{qCount}</div><div className="preview-label">Answer Key</div></div></Col>
                  </Row>
                </div>
              </Col>

              {/* Submit */}
              <Col md={12}>
                <div className="d-flex gap-3">
                  <Button type="submit" style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #2c5364)',
                    border: 'none', borderRadius: 12, padding: '14px 40px', fontWeight: 700, fontSize: 16,
                  }}>
                    Create Exam
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/admin')}
                    style={{ borderRadius: 12, padding: '14px 28px', fontWeight: 600 }}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;