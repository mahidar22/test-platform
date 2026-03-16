import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

/* ── Legacy question bank (non-PDF exams) ── */
const QUESTION_BANKS = {
  CS401: {
    title: 'Operating Systems',
    duration: 90 * 60,
    questions: [
      { id: 1, text: 'Which of the following is NOT a function of an operating system?', options: ['Memory management', 'Network management', 'Compiler design', 'Process management'] },
      { id: 2, text: 'What is the main purpose of the kernel?', options: ['To provide a user interface', 'To manage hardware resources', 'To compile programs', 'To browse the internet'] },
      { id: 3, text: 'Which scheduling algorithm gives minimum average waiting time?', options: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'] },
      { id: 4, text: 'Deadlock requires which conditions?', options: ['Mutual exclusion only', 'Hold and wait only', 'All four conditions', 'None'] },
      { id: 5, text: 'Which page replacement is optimal?', options: ['FIFO', 'LRU', "Belady's Optimal", 'Clock'] },
      { id: 6, text: 'What is thrashing?', options: ['High CPU use', 'More paging than executing', 'All processes ready', 'Deadlock'] },
      { id: 7, text: 'Which is non-preemptive?', options: ['Round Robin', 'SRTF', 'FCFS', 'Multilevel Queue'] },
      { id: 8, text: "Banker's algorithm is for:", options: ['Detection', 'Avoidance', 'Prevention', 'Allocation'] },
      { id: 9, text: 'What is a semaphore?', options: ['CPU register', 'Sync tool', 'Memory type', 'Scheduling algo'] },
      { id: 10, text: 'External fragmentation in?', options: ['Paging', 'Contiguous', 'Seg+Paging', 'Virtual'] },
    ],
  },
};

const LEGACY_CODES = { 'CS401-XK9M': 'CS401' };

const ExamDashboard = ({ student, customExams = [] }) => {
  const { examCode } = useParams();
  const navigate = useNavigate();

  /* ── Determine exam type ── */
  const legacySubject = LEGACY_CODES[examCode];
  const legacyData = legacySubject ? QUESTION_BANKS[legacySubject] : null;
  const customExam = customExams.find((e) => e.examCode === examCode);

  const isPdfExam = !!customExam;
  const examTitle = isPdfExam ? customExam.title : legacyData?.title || '';
  const totalQ = isPdfExam ? customExam.totalQuestions : legacyData?.questions?.length || 0;
  const optCount = isPdfExam ? customExam.optionsCount : 4;
  const examDuration = isPdfExam ? customExam.duration * 60 : legacyData?.duration || 0;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAutoSubmit = useCallback(() => {
    setSubmitted(true);
    navigate('/result', {
      state: {
        answers,
        total: totalQ,
        attempted: Object.keys(answers).length,
        examTitle,
        examCode,
      },
    });
    // eslint-disable-next-line
  }, [answers, totalQ]);

  useEffect(() => {
    if (submitted || (!legacyData && !customExam)) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, legacyData, customExam, handleAutoSubmit]);

  /* ── Guard ── */
  if (!legacyData && !customExam) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h3>Exam Not Found</h3>
        <p>The exam code "{examCode}" does not match any available exam.</p>
        <Button variant="primary" onClick={() => navigate('/exams')}>Back to Exams</Button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectOption = (qIndex, optIndex) => {
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const clearResponse = (qIndex) => {
    const updated = { ...answers };
    delete updated[qIndex];
    setAnswers(updated);
  };

  const goNext = () => { if (currentQ < totalQ - 1) setCurrentQ(currentQ + 1); };
  const goPrev = () => { if (currentQ > 0) setCurrentQ(currentQ - 1); };

  const attemptedCount = Object.keys(answers).length;
  const unanswered = totalQ - attemptedCount;

  const confirmSubmit = () => {
    setShowModal(false);
    setSubmitted(true);
    navigate('/result', {
      state: {
        answers, total: totalQ, attempted: attemptedCount,
        examTitle, examCode,
      },
    });
  };

  const optionLetters = 'ABCDEFGHIJ';

  return (
    <div>
      {/* ── Header ── */}
      <div className="exam-header-bar">
        <h4>{examCode} — {examTitle}</h4>
      </div>

      {/* ── Body ── */}
      <div className="exam-body">

        {/* ════════════════════════════════
            LEFT PANEL
           ════════════════════════════════ */}
        <div className="question-panel">
          {isPdfExam ? (
            /* ── PDF Viewer ── */
            <div className="pdf-viewer-container">
              <div className="pdf-viewer-header">
                <span>📄 Question Paper — {examTitle}</span>
                <span className="q-counter">{attemptedCount} of {totalQ} Answered</span>
              </div>
              <iframe
                src={customExam.pdfUrl}
                title="Question Paper PDF"
                className="pdf-iframe"
              />
            </div>
          ) : (
            /* ── Legacy Question Display ── */
            <>
              <div className="q-header">
                <h5>Question {currentQ + 1} of {totalQ}</h5>
                <span className="q-counter">{attemptedCount} of {totalQ} Answered</span>
              </div>
              <div className="question-number-badge">Q{currentQ + 1}</div>
              <div className="question-text">{legacyData.questions[currentQ].text}</div>
              <div className="question-options-display">
                {legacyData.questions[currentQ].options.map((opt, idx) => (
                  <div key={idx} className="option-display-item">
                    <span className="option-display-label">{optionLetters[idx]}</span>
                    <span className="option-display-text">{opt}</span>
                  </div>
                ))}
              </div>
              <div className="question-nav-btns">
                <button className="btn-q-nav btn-prev" onClick={goPrev} disabled={currentQ === 0}>← Previous</button>
                <button className="btn-q-nav btn-next" onClick={goNext} disabled={currentQ === totalQ - 1}>Next →</button>
              </div>
            </>
          )}
        </div>

        {/* ════════════════════════════════
            RIGHT PANEL — OMR SHEET
           ════════════════════════════════ */}
        <div className="omr-panel">
          {/* Timer */}
          <div className="timer-box">
            <div className="timer-label">Time Remaining</div>
            <div className={`timer-value ${timeLeft < 300 ? 'timer-warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* OMR Header */}
          <div className="omr-header">
            <h6>📋 OMR Answer Sheet</h6>
            <span className="omr-count">{attemptedCount}/{totalQ} Answered</span>
          </div>

          {/* OMR Column Headers */}
          <div className="omr-column-header">
            <div className="omr-col-q">Q.No</div>
            <div className="omr-col-options">
              {Array.from({ length: optCount }, (_, i) => (
                <span key={i}>{optionLetters[i]}</span>
              ))}
            </div>
            <div className="omr-col-clear">Clear</div>
          </div>

          {/* OMR Rows */}
          <div className="omr-sheet-container">
            {Array.from({ length: totalQ }, (_, qIdx) => (
              <div
                key={qIdx}
                className={`omr-row ${qIdx === currentQ ? 'omr-row-active' : ''} ${answers[qIdx] !== undefined ? 'omr-row-answered' : ''}`}
                onClick={() => setCurrentQ(qIdx)}
              >
                <div className="omr-q-number">
                  <span className={`omr-q-badge ${
                    qIdx === currentQ ? 'current' : answers[qIdx] !== undefined ? 'answered' : 'unanswered'
                  }`}>
                    {qIdx + 1}
                  </span>
                </div>

                <div className="omr-options">
                  {Array.from({ length: optCount }, (_, optIdx) => (
                    <label key={optIdx} className="omr-radio-label">
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        className="omr-radio-input"
                        checked={answers[qIdx] === optIdx}
                        onChange={() => selectOption(qIdx, optIdx)}
                      />
                      <span className={`omr-radio-circle ${answers[qIdx] === optIdx ? 'filled' : ''}`}>
                        {optionLetters[optIdx]}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="omr-clear-btn-col">
                  {answers[qIdx] !== undefined && (
                    <button
                      className="omr-clear-btn"
                      onClick={(e) => { e.stopPropagation(); clearResponse(qIdx); }}
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="submit-section">
            <Button className="btn-submit-exam" onClick={() => setShowModal(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-confirm">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700, fontSize: 18 }}>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: '#555', marginBottom: 16 }}>
            Are you sure you want to submit? You cannot change answers after submission.
          </p>
          <div className="summary-grid">
            <div className="summary-item"><div className="s-value">{totalQ}</div><div className="s-label">Total</div></div>
            <div className="summary-item"><div className="s-value" style={{ color: '#4caf50' }}>{attemptedCount}</div><div className="s-label">Attempted</div></div>
            <div className="summary-item"><div className="s-value" style={{ color: '#e53935' }}>{unanswered}</div><div className="s-label">Unanswered</div></div>
            <div className="summary-item"><div className="s-value" style={{ color: '#1565c0' }}>{Math.round((attemptedCount / totalQ) * 100)}%</div><div className="s-label">Progress</div></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px' }}>Go Back</Button>
          <Button variant="danger" onClick={confirmSubmit} style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px' }}>Yes, Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamDashboard;