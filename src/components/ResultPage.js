import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Sidebar } from './Dashboard';

const ResultPage = ({ student, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;
  const reportRef = useRef(null);

  const handleLogout = () => { onLogout(); navigate('/'); };

  // ── Download Report as HTML File ──
  const downloadReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exam Report - ${result.examTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px; }
    .report-container { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
    .report-header { background: linear-gradient(135deg, #1a1a2e, #2c5364); color: #fff; padding: 32px; text-align: center; }
    .report-header h1 { font-size: 22px; margin-bottom: 4px; }
    .report-header p { font-size: 13px; opacity: 0.7; }
    .report-body { padding: 32px; }
    .report-title { font-size: 18px; font-weight: 700; color: #1a1a2e; text-align: center; margin-bottom: 24px; border-bottom: 2px solid #f0f0f0; padding-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-box { background: #f8f9fa; border-radius: 10px; padding: 16px; text-align: center; }
    .info-box .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .info-box .value { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    .info-box .value.green { color: #4caf50; }
    .info-box .value.red { color: #e53935; }
    .info-box .value.blue { color: #1565c0; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .detail-table th, .detail-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .detail-table th { color: #888; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; background: #fafafa; }
    .detail-table td { color: #333; font-weight: 500; }
    .report-footer { text-align: center; padding: 20px 32px 32px; color: #aaa; font-size: 12px; border-top: 1px solid #f0f0f0; margin-top: 16px; }
    .stamp { display: inline-block; border: 2px solid #4caf50; color: #4caf50; padding: 8px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
    @media print { body { padding: 0; background: #fff; } .report-container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>ExamPortal</h1>
      <p>Online Examination & Assessment Platform</p>
    </div>
    <div class="report-body">
      <div class="report-title">Exam Submission Report</div>
      
      <table class="detail-table" style="margin-bottom: 24px;">
        <tr><th style="width:40%">Field</th><th>Details</th></tr>
        <tr><td>Student Name</td><td><strong>${student?.name || 'N/A'}</strong></td></tr>
        <tr><td>Roll Number</td><td><strong>${student?.rollNo || 'N/A'}</strong></td></tr>
        <tr><td>Exam Title</td><td><strong>${result.examTitle}</strong></td></tr>
        <tr><td>Exam Code</td><td><strong>${result.examCode}</strong></td></tr>
        <tr><td>Submission Date</td><td><strong>${dateStr}</strong></td></tr>
        <tr><td>Submission Time</td><td><strong>${timeStr}</strong></td></tr>
      </table>

      <div class="info-grid">
        <div class="info-box">
          <div class="label">Total Questions</div>
          <div class="value">${result.total}</div>
        </div>
        <div class="info-box">
          <div class="label">Attempted</div>
          <div class="value green">${result.attempted}</div>
        </div>
        <div class="info-box">
          <div class="label">Unanswered</div>
          <div class="value red">${result.total - result.attempted}</div>
        </div>
        <div class="info-box">
          <div class="label">Completion</div>
          <div class="value blue">${Math.round((result.attempted / result.total) * 100)}%</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <div class="stamp">Submitted Successfully</div>
        <p style="color: #888; font-size: 13px;">Results will be evaluated and published by the administrator.</p>
      </div>
    </div>
    <div class="report-footer">
      Generated on ${dateStr} at ${timeStr} | ExamPortal - Online Examination Platform
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exam_Report_${result.examCode}_${student?.rollNo || 'student'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Print Report ──
  const printReport = () => {
    const printWindow = window.open('', '_blank');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Exam Report - ${result.examTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #1a1a2e; }
    .header h1 { font-size: 24px; color: #1a1a2e; }
    .header p { color: #888; font-size: 14px; }
    .section-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 20px 0 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px 14px; text-align: left; border: 1px solid #ddd; font-size: 14px; }
    th { background: #f5f5f5; font-weight: 600; color: #555; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat-box { flex: 1; text-align: center; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
    .stat-box .num { font-size: 28px; font-weight: 700; }
    .stat-box .lbl { font-size: 11px; color: #888; text-transform: uppercase; margin-top: 4px; }
    .green { color: #4caf50; }
    .red { color: #e53935; }
    .blue { color: #1565c0; }
    .footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; color: #aaa; font-size: 12px; }
    .stamp { text-align: center; margin: 24px 0; }
    .stamp span { border: 2px solid #4caf50; color: #4caf50; padding: 6px 20px; font-weight: 700; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>ExamPortal - Exam Report</h1>
    <p>Online Examination & Assessment Platform</p>
  </div>
  
  <div class="section-title">Student & Exam Details</div>
  <table>
    <tr><th>Student Name</th><td>${student?.name || 'N/A'}</td></tr>
    <tr><th>Roll Number</th><td>${student?.rollNo || 'N/A'}</td></tr>
    <tr><th>Exam Title</th><td>${result.examTitle}</td></tr>
    <tr><th>Exam Code</th><td>${result.examCode}</td></tr>
    <tr><th>Date</th><td>${dateStr}</td></tr>
    <tr><th>Time</th><td>${timeStr}</td></tr>
  </table>

  <div class="section-title">Performance Summary</div>
  <div class="stats">
    <div class="stat-box"><div class="num">${result.total}</div><div class="lbl">Total</div></div>
    <div class="stat-box"><div class="num green">${result.attempted}</div><div class="lbl">Attempted</div></div>
    <div class="stat-box"><div class="num red">${result.total - result.attempted}</div><div class="lbl">Unanswered</div></div>
    <div class="stat-box"><div class="num blue">${Math.round((result.attempted / result.total) * 100)}%</div><div class="lbl">Completion</div></div>
  </div>

  <div class="stamp"><span>SUBMITTED SUCCESSFULLY</span></div>
  <p style="text-align:center; color:#888; font-size:13px;">Results will be evaluated and published by the administrator.</p>

  <div class="footer">Generated on ${dateStr} at ${timeStr} | ExamPortal</div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // ── No Result Data ──
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
            <div className="result-icon-text">No Data</div>
            <h3>No Results Yet</h3>
            <p style={{ color: '#888' }}>Complete an exam to view your results here.</p>
            <Button variant="dark" onClick={() => navigate('/exams')}
              style={{ borderRadius: 10, fontWeight: 600, padding: '10px 32px' }}>
              Go to Exams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── With Result Data ──
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

        <div className="result-card" ref={reportRef}>
          <div className="result-check-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="#4caf50" strokeWidth="3" fill="#e8f5e9"/>
              <path d="M20 32 L28 40 L44 24" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h3>Exam Submitted Successfully!</h3>

          {/* Summary Stats */}
          <div className="result-stats-grid">
            <div className="result-stat-box">
              <div className="result-stat-value">{result.total}</div>
              <div className="result-stat-label">Total Questions</div>
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
              <div className="result-stat-value" style={{ color: '#1565c0' }}>
                {Math.round((result.attempted / result.total) * 100)}%
              </div>
              <div className="result-stat-label">Completion</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="result-details-section">
            <table className="result-details-table">
              <tbody>
                <tr>
                  <td className="result-detail-label">Student</td>
                  <td className="result-detail-value">{student?.name}</td>
                </tr>
                <tr>
                  <td className="result-detail-label">Roll No.</td>
                  <td className="result-detail-value">{student?.rollNo}</td>
                </tr>
                <tr>
                  <td className="result-detail-label">Exam</td>
                  <td className="result-detail-value">{result.examTitle}</td>
                </tr>
                <tr>
                  <td className="result-detail-label">Code</td>
                  <td className="result-detail-value" style={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                    {result.examCode}
                  </td>
                </tr>
                <tr>
                  <td className="result-detail-label">Submitted</td>
                  <td className="result-detail-value">
                    {new Date().toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ color: '#888', marginTop: 20, fontSize: 14 }}>
            Your results will be evaluated and published by the administrator.
          </p>

          {/* Action Buttons */}
          <div className="result-actions">
            <Button
              variant="dark"
              onClick={() => navigate('/dashboard')}
              className="result-action-btn"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outline-primary"
              onClick={downloadReport}
              className="result-action-btn"
            >
              Download Report
            </Button>
            <Button
              variant="outline-secondary"
              onClick={printReport}
              className="result-action-btn"
            >
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;