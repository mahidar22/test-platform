import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Sidebar from './Sidebar';

const ResultPage = ({ student, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;
  const reportRef = useRef(null);

  const handleLogout = () => { onLogout(); navigate('/'); };

  const getOptionLabel = (optIdx, optionsCount) => {
    if (parseInt(optionsCount) === 2) return optIdx === 0 ? 'True' : 'False';
    return String.fromCharCode(65 + optIdx);
  };

  // ── Download CORRECT Answer Key ──
  const downloadAnswerKey = () => {
    if (!result) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const answerKey = result.answerKey;
    const optionsCount = result.optionsCount;

    let answerRows = '';
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    for (let i = 0; i < result.total; i++) {
      const correctOption = answerKey[i];
      const studentOption = result.answers[i];

      const correctText = correctOption !== undefined
        ? getOptionLabel(correctOption, optionsCount)
        : 'Not Set';

      const studentText = studentOption !== undefined
        ? getOptionLabel(studentOption, optionsCount)
        : '—';

      let statusText = '';
      let statusColor = '';
      let rowBg = i % 2 === 0 ? '#fff' : '#fafafa';

      if (studentOption === undefined) {
        statusText = 'Not Answered';
        statusColor = '#ff9800';
        unansweredCount++;
      } else if (studentOption === correctOption) {
        statusText = 'Correct';
        statusColor = '#4caf50';
        correctCount++;
      } else {
        statusText = 'Wrong';
        statusColor = '#e53935';
        wrongCount++;
      }

      answerRows += `
        <tr style="background: ${rowBg};">
          <td style="padding: 10px 16px; border-bottom: 1px solid #eee; font-weight: 700; text-align: center; color: #2D0040;">${i + 1}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="display: inline-block; padding: 4px 16px; border-radius: 20px; font-weight: 700; background: #e8f5e9; color: #2e7d32;">
              ${correctText}
            </span>
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600; color: ${studentOption !== undefined ? '#2D0040' : '#ccc'};">
            ${studentText}
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="display: inline-block; padding: 3px 12px; border-radius: 20px; font-weight: 600; font-size: 12px; background: ${statusColor}15; color: ${statusColor};">
              ${statusText}
            </span>
          </td>
        </tr>`;
    }

    const studentEmail = student?.email || student?.rollNo;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Answer Key - ${result.examTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #2D0040, #5B0A7B); color: #fff; padding: 28px 32px; }
    .header h1 { font-size: 20px; margin-bottom: 4px; }
    .header p { font-size: 13px; opacity: 0.7; }
    .header .badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 14px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
    .body-content { padding: 28px 32px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .info-item { background: #F8F0FB; border-radius: 10px; padding: 14px 20px; flex: 1; min-width: 120px; }
    .info-item .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-item .value { font-size: 16px; font-weight: 700; color: #2D0040; margin-top: 4px; }
    .score-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .score-box { background: #F8F0FB; border-radius: 10px; padding: 16px; text-align: center; }
    .score-box .num { font-size: 24px; font-weight: 700; }
    .score-box .lbl { font-size: 10px; color: #888; text-transform: uppercase; margin-top: 4px; }
    .green { color: #4caf50; } .red { color: #e53935; } .orange { color: #ff9800; } .blue { color: #7B1FA2; }
    .section-title { font-size: 15px; font-weight: 700; color: #2D0040; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #E1BEE7; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 10px 16px; text-align: center; font-size: 12px; color: #555; text-transform: uppercase; background: #F3E5F5; }
    .footer { text-align: center; padding: 20px 32px; color: #aaa; font-size: 11px; border-top: 1px solid #E1BEE7; }
    @media print { body { padding: 0; background: #fff; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Answer Key — ${result.examTitle}</h1>
      <p>Exam Code: ${result.examCode}</p>
      <div class="badge">Generated: ${dateStr} at ${timeStr}</div>
    </div>
    <div class="body-content">
      <div class="info-row">
        <div class="info-item"><div class="label">Email</div><div class="value">${studentEmail}</div></div>
        <div class="info-item"><div class="label">Exam</div><div class="value">${result.examTitle}</div></div>
        <div class="info-item"><div class="label">Date</div><div class="value">${dateStr}</div></div>
      </div>
      <div class="score-grid">
        <div class="score-box"><div class="num blue">${result.total}</div><div class="lbl">Total</div></div>
        <div class="score-box"><div class="num green">${correctCount}</div><div class="lbl">Correct</div></div>
        <div class="score-box"><div class="num red">${wrongCount}</div><div class="lbl">Wrong</div></div>
        <div class="score-box"><div class="num orange">${unansweredCount}</div><div class="lbl">Skipped</div></div>
      </div>
      <div class="section-title">Detailed Answer Comparison</div>
      <table>
        <thead><tr>
          <th>Q.No</th><th>Correct Answer</th><th>Your Answer</th><th>Status</th>
        </tr></thead>
        <tbody>${answerRows}</tbody>
      </table>
    </div>
    <div class="footer">Generated on ${dateStr} at ${timeStr} &nbsp;|&nbsp; ExamPortal</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AnswerKey_${result.examCode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Print ──
  const printReport = () => {
    if (!result) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const studentEmail = student?.email || student?.rollNo;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Report</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;padding:40px;}.h{text-align:center;margin-bottom:32px;border-bottom:2px solid #2D0040;padding-bottom:16px;}table{width:100%;border-collapse:collapse;margin-bottom:20px;}th,td{padding:10px 14px;text-align:left;border:1px solid #E1BEE7;font-size:14px;}th{background:#F8F0FB;}.s{display:flex;gap:20px;margin:20px 0;}.sb{flex:1;text-align:center;padding:16px;border:1px solid #E1BEE7;border-radius:8px;}.sb .n{font-size:28px;font-weight:700;}.f{text-align:center;margin-top:40px;color:#aaa;font-size:12px;border-top:1px solid #E1BEE7;padding-top:16px;}</style></head><body><div class="h"><h1>ExamPortal - Report</h1><p>${dateStr}</p></div><table><tr><th>Email</th><td>${studentEmail}</td></tr><tr><th>Exam</th><td>${result.examTitle}</td></tr><tr><th>Code</th><td>${result.examCode}</td></tr></table><div class="s"><div class="sb"><div class="n">${result.total}</div><div>Total</div></div><div class="sb"><div class="n" style="color:#4caf50;">${result.attempted}</div><div>Attempted</div></div><div class="sb"><div class="n" style="color:#e53935;">${result.total - result.attempted}</div><div>Unanswered</div></div><div class="sb"><div class="n" style="color:#7B1FA2;">${Math.round((result.attempted / result.total) * 100)}%</div><div>Completion</div></div></div><div class="f">ExamPortal</div></body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 500);
  };

  const studentEmail = student?.email || student?.rollNo;
  const studentInitial = student?.name
    ? student.name.charAt(0)
    : studentEmail
    ? studentEmail.charAt(0).toUpperCase()
    : '';

  if (!result) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar active="results" onLogout={handleLogout} />
        <div className="dashboard-main">
          <div className="dashboard-topbar">
            <h3>Results</h3>
            <div className="user-info">
              <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{studentEmail}</div>
              <div className="user-avatar">{studentInitial}</div>
            </div>
          </div>
          <div className="result-card">
            <div className="result-icon-text">No Data</div>
            <h3>No Results Yet</h3>
            <p style={{ color: '#888' }}>Complete an exam to view results.</p>
            <Button variant="dark" onClick={() => navigate('/exams')} style={{ borderRadius: 10, fontWeight: 600, padding: '10px 32px' }}>Go to Exams</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active="results" onLogout={handleLogout} />
      <div className="dashboard-main" style={{ overflowY: 'auto' }}>
        <div className="dashboard-topbar">
          <h3>Exam Result</h3>
          <div className="user-info">
            <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 500 }}>{studentEmail}</div>
            <div className="user-avatar">{studentInitial}</div>
          </div>
        </div>

        <div className="result-card" ref={reportRef}>
          {result.terminated && (
            <div className="termination-banner">
              <div><strong>Exam Terminated</strong><div style={{ fontSize: 12 }}>{result.terminationReason}</div></div>
            </div>
          )}

          <div className="result-check-icon">
            {result.terminated ? (
              <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#ff9800" strokeWidth="3" fill="#fff8e1"/><text x="32" y="42" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#ff9800">!</text></svg>
            ) : (
              <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#4caf50" strokeWidth="3" fill="#e8f5e9"/><path d="M20 32 L28 40 L44 24" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            )}
          </div>

          <h3>{result.terminated ? 'Exam Submitted (Terminated)' : 'Exam Submitted Successfully!'}</h3>

          <div className="result-stats-grid">
            <div className="result-stat-box">
              <div className="result-stat-value">{result.total}</div>
              <div className="result-stat-label">Total</div>
            </div>
            <div className="result-stat-box">
              <div className="result-stat-value" style={{ color: '#4caf50' }}>{result.attempted}</div>
              <div className="result-stat-label">Attempted</div>
            </div>
            <div className="result-stat-box">
              <div className="result-stat-value" style={{ color: '#e53935' }}>{result.total - result.attempted}</div>
              <div className="result-stat-label">Unanswered</div>
            </div>
            <div className="result-stat-box">
              <div className="result-stat-value" style={{ color: '#7B1FA2' }}>{Math.round((result.attempted / result.total) * 100)}%</div>
              <div className="result-stat-label">Completion</div>
            </div>
          </div>

          <div className="result-details-section">
            <table className="result-details-table"><tbody>
              <tr><td className="result-detail-label">Email</td><td className="result-detail-value">{studentEmail}</td></tr>
              <tr><td className="result-detail-label">Exam</td><td className="result-detail-value">{result.examTitle}</td></tr>
              <tr><td className="result-detail-label">Code</td><td className="result-detail-value" style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{result.examCode}</td></tr>
              <tr><td className="result-detail-label">Submitted</td><td className="result-detail-value">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td></tr>
            </tbody></table>
          </div>

          <p style={{ color: '#888', marginTop: 12, fontSize: 13 }}>Your results will be evaluated and published by the administrator.</p>

          <div className="result-actions">
            <Button variant="dark" onClick={() => navigate('/dashboard')} className="result-action-btn"
              style={{ background: '#5B0A7B', borderColor: '#5B0A7B' }}>
              Back to Dashboard
            </Button>
            <Button variant="outline-success" onClick={downloadAnswerKey} className="result-action-btn">
              Download Answer Key
            </Button>
            <Button variant="outline-secondary" onClick={printReport} className="result-action-btn">
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
