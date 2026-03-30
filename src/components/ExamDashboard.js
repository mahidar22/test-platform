import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const QUESTION_BANKS = {
  CS401: {
    title: 'Operating Systems',
    duration: 90 * 60,
    answerKey: { 0: 2, 1: 1, 2: 1, 3: 2, 4: 2, 5: 1, 6: 2, 7: 1, 8: 1, 9: 1 },
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

  const legacySubject = LEGACY_CODES[examCode];
  const legacyData = legacySubject ? QUESTION_BANKS[legacySubject] : null;
  const customExam = customExams.find((e) => e.examCode === examCode);

  const isPdfExam = !!customExam;
  const examTitle = isPdfExam ? customExam.title : legacyData?.title || '';
  const totalQ = isPdfExam ? customExam.totalQuestions : legacyData?.questions?.length || 0;
  const optCount = isPdfExam ? customExam.optionsCount : 4;
  const examDuration = isPdfExam ? customExam.duration * 60 : legacyData?.duration || 0;

  const isTrueFalse = parseInt(optCount) === 2;

  const correctAnswerKey = isPdfExam ? (customExam.answerKey || {}) : (legacyData?.answerKey || {});

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [examTerminated, setExamTerminated] = useState(false);
  const MAX_TAB_SWITCHES = 3;

  const buildResultState = useCallback((extraFields = {}) => ({
    answers,
    total: totalQ,
    attempted: Object.keys(answers).length,
    examTitle,
    examCode,
    answerKey: correctAnswerKey,
    optionsCount: parseInt(optCount),
    ...extraFields,
  }), [answers, totalQ, examTitle, examCode, correctAnswerKey, optCount]);

  const handleAutoSubmit = useCallback(() => {
    setSubmitted(true);
    navigate('/result', { state: buildResultState() });
  }, [navigate, buildResultState]);

  const handleForceSubmit = useCallback(() => {
    setExamTerminated(true);
    setSubmitted(true);
    navigate('/result', {
      state: buildResultState({
        terminated: true,
        terminationReason: 'Tab switch limit exceeded (3/3)',
      }),
    });
  }, [navigate, buildResultState]);

  useEffect(() => {
    if (submitted || examTerminated) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= MAX_TAB_SWITCHES) {
            setWarningMessage(
              `You have switched tabs ${MAX_TAB_SWITCHES} times. Your exam is now being auto-submitted.`
            );
            setShowWarningModal(true);
            setTimeout(() => {
              setShowWarningModal(false);
              handleForceSubmit();
            }, 3000);
          } else {
            const remaining = MAX_TAB_SWITCHES - newCount;
            setWarningMessage(
              `WARNING: You switched away from the exam tab!\n\nTab switch ${newCount} of ${MAX_TAB_SWITCHES}.\n\n${remaining} warning${remaining === 1 ? '' : 's'} remaining before auto-submission.`
            );
            setShowWarningModal(true);
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitted, examTerminated, handleForceSubmit]);

  useEffect(() => {
    if (submitted || examTerminated || (!legacyData && !customExam)) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, examTerminated, legacyData, customExam, handleAutoSubmit]);

  if (!legacyData && !customExam) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h3>Exam Not Found</h3>
        <p>The exam code "{examCode}" does not match any available exam.</p>
        <Button variant="primary" onClick={() => navigate('/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleOption = (qIndex, optIndex) => {
    if (answers[qIndex] === optIndex) {
      const updated = { ...answers };
      delete updated[qIndex];
      setAnswers(updated);
    } else {
      setAnswers({ ...answers, [qIndex]: optIndex });
    }
  };

  const goNext = () => {
    if (currentQ < totalQ - 1) setCurrentQ(currentQ + 1);
  };
  const goPrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const attemptedCount = Object.keys(answers).length;
  const unanswered = totalQ - attemptedCount;

  const confirmSubmit = () => {
    setShowModal(false);
    setSubmitted(true);
    navigate('/result', { state: buildResultState() });
  };

  const getOptionLabel = (optIdx) => {
    if (isTrueFalse) return optIdx === 0 ? 'T' : 'F';
    return String.fromCharCode(65 + optIdx);
  };

  const getOptionFullLabel = (optIdx) => {
    if (isTrueFalse) return optIdx === 0 ? 'True' : 'False';
    return String.fromCharCode(65 + optIdx);
  };

  const getWarningColor = () => {
    if (tabSwitchCount >= MAX_TAB_SWITCHES) return '#e53935';
    if (tabSwitchCount === 2) return '#ff9800';
    if (tabSwitchCount === 1) return '#ffc107';
    return 'transparent';
  };

  const renderQuestionOptions = () => {
    if (!legacyData) return null;
    const opts = legacyData.questions[currentQ].options;

    if (isTrueFalse) {
      return (
        <div className="question-options-display">
          {opts.map((opt, idx) => (
            <div key={idx} className="tf-option-item">
              <span className={`tf-option-badge ${idx === 0 ? 'tf-badge-true' : 'tf-badge-false'}`}>
                {idx === 0 ? 'T' : 'F'}
              </span>
              <span className="tf-option-text">{opt}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="question-options-display">
        {opts.map((opt, idx) => (
          <div key={idx} className="option-display-item">
            <span className="option-display-label">{getOptionLabel(idx)}</span>
            <span className="option-display-text">{opt}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div className="exam-header-bar">
        <h4>{examCode} — {examTitle}</h4>
        {tabSwitchCount > 0 && (
          <div className="tab-switch-indicator" style={{ background: getWarningColor() }}>
            Tab Switches: {tabSwitchCount}/{MAX_TAB_SWITCHES}
          </div>
        )}
      </div>

      <div className="exam-body">
        {/* Question Panel (Left) */}
        <div className="question-panel">
          {isPdfExam ? (
            <div className="pdf-viewer-container">
              <div className="pdf-viewer-header">
                <span>Question Paper — {examTitle}</span>
                <span className="q-counter">{attemptedCount} of {totalQ} Answered</span>
              </div>
              <iframe src={customExam.pdfUrl} title="Question Paper PDF" className="pdf-iframe" />
            </div>
          ) : (
            <>
              <div className="q-header">
                <h5>Question {currentQ + 1} of {totalQ}</h5>
                <span className="q-counter">{attemptedCount} of {totalQ} Answered</span>
              </div>
              <div className="question-number-badge">Q{currentQ + 1}</div>
              <div className="question-text">{legacyData.questions[currentQ].text}</div>
              {renderQuestionOptions()}
              <div className="question-nav-btns">
                <button className="btn-q-nav btn-prev" onClick={goPrev} disabled={currentQ === 0}>
                  ← Previous
                </button>
                <button className="btn-q-nav btn-next" onClick={goNext} disabled={currentQ === totalQ - 1}>
                  Next →
                </button>
              </div>
            </>
          )}
        </div>

        {/* OMR Panel (Right) */}
        <div className="omr-panel">
          {/* Timer */}
          <div className="timer-box">
            <div className="timer-label">Time Remaining</div>
            <div className={`timer-value ${timeLeft < 300 ? 'timer-warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Tab Switch Warning */}
          {tabSwitchCount > 0 && (
            <div className={`tab-warning-bar ${tabSwitchCount >= 2 ? 'critical' : ''}`}>
              <div className="tab-warning-icon">!</div>
              <div className="tab-warning-text">
                <strong>Tab Switches: {tabSwitchCount}/{MAX_TAB_SWITCHES}</strong>
                <br />
                <span>{MAX_TAB_SWITCHES - tabSwitchCount} remaining before auto-submit</span>
              </div>
            </div>
          )}

          {/* OMR Header */}
          <div className="omr-header">
            <h6>OMR Answer Sheet</h6>
            <span className="omr-count">{attemptedCount}/{totalQ} Answered</span>
          </div>
          <div className="omr-info-text">Click to select. Re-click same option to deselect.</div>

          {/* OMR Column Header */}
          <div className="omr-column-header">
            <div className="omr-col-q">Q.No</div>
            <div className="omr-col-options-full">
              {Array.from({ length: parseInt(optCount) }, (_, i) => (
                <span key={i}>{getOptionFullLabel(i)}</span>
              ))}
            </div>
          </div>

          {/* OMR Sheet */}
          <div className="omr-sheet-container">
            {Array.from({ length: totalQ }, (_, qIdx) => (
              <div
                key={qIdx}
                className={`omr-row ${qIdx === currentQ ? 'omr-row-active' : ''} ${answers[qIdx] !== undefined ? 'omr-row-answered' : ''}`}
                onClick={() => setCurrentQ(qIdx)}
              >
                <div className="omr-q-number">
                  <span className={`omr-q-badge ${qIdx === currentQ ? 'current' : answers[qIdx] !== undefined ? 'answered' : 'unanswered'}`}>
                    {qIdx + 1}
                  </span>
                </div>
                <div className="omr-options-full">
                  {Array.from({ length: parseInt(optCount) }, (_, optIdx) => (
                    <label
                      key={optIdx}
                      className="omr-radio-label"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(qIdx, optIdx);
                      }}
                    >
                      <span className={`omr-radio-circle ${answers[qIdx] === optIdx ? 'filled' : ''}`}>
                        {getOptionLabel(optIdx)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <Button className="btn-submit-exam" onClick={() => setShowModal(true)}>
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* ══════ Submit Confirmation Modal ══════ */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-confirm">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700, fontSize: 18 }}>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: '#555', marginBottom: 16 }}>
            Are you sure? You cannot change answers after submission.
          </p>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="s-value">{totalQ}</div>
              <div className="s-label">Total</div>
            </div>
            <div className="summary-item">
              <div className="s-value" style={{ color: '#4caf50' }}>{attemptedCount}</div>
              <div className="s-label">Attempted</div>
            </div>
            <div className="summary-item">
              <div className="s-value" style={{ color: '#e53935' }}>{unanswered}</div>
              <div className="s-label">Unanswered</div>
            </div>
            <div className="summary-item">
              <div className="s-value" style={{ color: '#7B1FA2' }}>
                {Math.round((attemptedCount / totalQ) * 100)}%
              </div>
              <div className="s-label">Progress</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px' }}
          >
            Go Back
          </Button>
          <Button
            variant="danger"
            onClick={confirmSubmit}
            style={{ borderRadius: 10, fontWeight: 600, padding: '8px 24px' }}
          >
            Yes, Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ══════ Tab Warning Modal ══════ */}
      <Modal
        show={showWarningModal}
        onHide={() => {
          if (tabSwitchCount < MAX_TAB_SWITCHES) setShowWarningModal(false);
        }}
        centered
        backdrop="static"
        keyboard={false}
        className="modal-warning"
      >
        <Modal.Body style={{ padding: 0 }}>
          <div className={`warning-modal-content ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'terminated' : ''}`}>
            <div className="warning-icon-container">
              {tabSwitchCount >= MAX_TAB_SWITCHES ? (
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <circle cx="36" cy="36" r="34" stroke="#e53935" strokeWidth="3" fill="#ffebee" />
                  <path d="M24 24L48 48M48 24L24 48" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <path d="M36 6L66 60H6L36 6Z" stroke="#ff9800" strokeWidth="3" fill="#fff8e1" />
                  <text x="36" y="48" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#ff9800">!</text>
                </svg>
              )}
            </div>
            <h4 className="warning-title">
              {tabSwitchCount >= MAX_TAB_SWITCHES
                ? 'Exam Terminated!'
                : 'Warning: Tab Switch Detected!'}
            </h4>
            <p className="warning-message">{warningMessage}</p>
            <div className="warning-dots">
              {Array.from({ length: MAX_TAB_SWITCHES }, (_, i) => (
                <div
                  key={i}
                  className={`warning-dot ${i < tabSwitchCount ? 'active' : ''} ${
                    i < tabSwitchCount && tabSwitchCount >= MAX_TAB_SWITCHES ? 'terminated' : ''
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="warning-level">
              {tabSwitchCount >= MAX_TAB_SWITCHES ? (
                <span className="level-critical">EXAM AUTO-SUBMITTING...</span>
              ) : tabSwitchCount === 2 ? (
                <span className="level-high">FINAL WARNING - Last chance!</span>
              ) : (
                <span className="level-low">Please stay on the exam tab</span>
              )}
            </div>
            {tabSwitchCount < MAX_TAB_SWITCHES && (
              <Button
                onClick={() => setShowWarningModal(false)}
                style={{
                  borderRadius: 10,
                  fontWeight: 700,
                  padding: '12px 40px',
                  marginTop: 16,
                  fontSize: 16,
                  background: '#5B0A7B',
                  border: 'none',
                }}
              >
                I Understand — Continue Exam
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExamDashboard;