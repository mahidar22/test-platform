import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { AdminSidebar } from './AdminDashboard';

const CreateExam = ({ user, onLogout, addExam }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [optionsCount, setOptionsCount] = useState(4);
  const [duration, setDuration] = useState(60);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => { onLogout(); navigate('/'); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }
      setPdfFile(file);
      setPdfFileName(file.name);
      setError('');
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setExamCode(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) { setError('Please enter exam title.'); return; }
    if (!examCode.trim()) { setError('Please enter or generate an exam code.'); return; }
    if (!pdfFile) { setError('Please upload a PDF question paper.'); return; }
    if (totalQuestions < 1) { setError('Number of questions must be at least 1.'); return; }
    if (duration < 1) { setError('Duration must be at least 1 minute.'); return; }

    const pdfUrl = URL.createObjectURL(pdfFile);

    const newExam = {
      id: Date.now(),
      title: title.trim(),
      examCode: examCode.trim().toUpperCase(),
      pdfUrl: pdfUrl,
      pdfFileName: pdfFileName,
      totalQuestions: parseInt(totalQuestions),
      optionsCount: parseInt(optionsCount),
      duration: parseInt(duration),
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    addExam(newExam);
    setSuccess(`Exam "${newExam.title}" created successfully! Code: ${newExam.examCode}`);

    // Reset form
    setTitle('');
    setExamCode('');
    setTotalQuestions(10);
    setOptionsCount(4);
    setDuration(60);
    setPdfFile(null);
    setPdfFileName('');

    // Reset file input
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar active="create" onLogout={handleLogout} />
      <div className="dashboard-main">
        {/* Topbar */}
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

        {/* Form Card */}
        <div className="create-exam-card">
          {success && (
            <Alert variant="success" style={{ borderRadius: 12, fontWeight: 600 }} dismissible onClose={() => setSuccess('')}>
              ✅ {success}
              <div style={{ marginTop: 8 }}>
                <Button
                  variant="success" size="sm"
                  style={{ borderRadius: 8, fontWeight: 600 }}
                  onClick={() => navigate('/admin')}
                >
                  View All Exams
                </Button>
              </div>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" style={{ borderRadius: 12 }} dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Exam Title */}
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Exam Title *</Form.Label>
                  <Form.Control
                    type="text" placeholder="e.g. Operating Systems Mid-Term Exam"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>

              {/* Exam Code */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Exam Code *</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text" placeholder="e.g. OS2025"
                      value={examCode} onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                      className="form-input-custom" maxLength={12}
                      style={{ letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}
                    />
                    <Button
                      variant="outline-primary" onClick={generateCode}
                      style={{ borderRadius: 10, fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      Generate
                    </Button>
                  </div>
                  <Form.Text style={{ color: '#888', fontSize: 11 }}>
                    Students will enter this code to access the exam
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* PDF Upload */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Upload Question Paper (PDF) *</Form.Label>
                  <div className="pdf-upload-zone">
                    <input
                      type="file" id="pdf-upload" accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="pdf-upload" className="pdf-upload-label">
                      {pdfFileName ? (
                        <div className="pdf-uploaded-info">
                          <span style={{ fontSize: 36 }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{pdfFileName}</div>
                            <div style={{ fontSize: 12, color: '#4caf50', fontWeight: 600 }}>
                              ✅ File selected — Click to change
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pdf-upload-placeholder">
                          <span style={{ fontSize: 48 }}>📤</span>
                          <div style={{ fontWeight: 700, color: '#1a1a2e', marginTop: 8 }}>
                            Click to upload PDF
                          </div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                            Max file size: 10MB
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </Form.Group>
              </Col>

              {/* Number of Questions */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Number of Questions *</Form.Label>
                  <Form.Control
                    type="number" min="1" max="200"
                    value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>

              {/* Options per Question */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Options per Question</Form.Label>
                  <Form.Select
                    value={optionsCount} onChange={(e) => setOptionsCount(e.target.value)}
                    className="form-input-custom"
                  >
                    <option value={2}>2 (A, B)</option>
                    <option value={3}>3 (A, B, C)</option>
                    <option value={4}>4 (A, B, C, D)</option>
                    <option value={5}>5 (A, B, C, D, E)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Duration */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Duration (minutes) *</Form.Label>
                  <Form.Control
                    type="number" min="1" max="300"
                    value={duration} onChange={(e) => setDuration(e.target.value)}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>

              {/* Preview Summary */}
              <Col md={12}>
                <div className="exam-preview-box">
                  <h6 style={{ fontWeight: 700, marginBottom: 12 }}>📋 Exam Summary Preview</h6>
                  <Row>
                    <Col sm={3}>
                      <div className="preview-item">
                        <div className="preview-value">{title || '—'}</div>
                        <div className="preview-label">Title</div>
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div className="preview-item">
                        <div className="preview-value" style={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                          {examCode || '—'}
                        </div>
                        <div className="preview-label">Code</div>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="preview-item">
                        <div className="preview-value">{totalQuestions}</div>
                        <div className="preview-label">Questions</div>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="preview-item">
                        <div className="preview-value">{optionsCount} Opts</div>
                        <div className="preview-label">Per Question</div>
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div className="preview-item">
                        <div className="preview-value">{duration} min</div>
                        <div className="preview-label">Duration</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Submit */}
              <Col md={12}>
                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a2e, #2c5364)',
                      border: 'none', borderRadius: 12, padding: '14px 40px',
                      fontWeight: 700, fontSize: 16,
                    }}
                  >
                    ✅ Create Exam
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/admin')}
                    style={{ borderRadius: 12, padding: '14px 28px', fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
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