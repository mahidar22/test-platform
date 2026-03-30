import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ExamPortal from './components/ExamPortal';
import ExamDashboard from './components/ExamDashboard';
import ResultPage from './components/ResultPage';
import { AdminDashboard, CreateExam, ManageExams, ViewResults, AdminSettings } from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [customExams, setCustomExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    defaultOptionsCount: 4,
    shuffleQuestions: false,
  });

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  const addCustomExam = (exam) => setCustomExams([...customExams, exam]);
  const deleteExam = (examId) => setCustomExams(customExams.filter(e => e.id !== examId));

  const updateSettings = (newSettings) => setAdminSettings({ ...adminSettings, ...newSettings });

  // Not logged in
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  // Admin routes
  if (user.role === 'admin') {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={
            <AdminDashboard admin={user} onLogout={handleLogout} customExams={customExams} examResults={examResults} />
          } />
          <Route path="/admin/create" element={
            <CreateExam admin={user} onLogout={handleLogout} onCreateExam={addCustomExam} settings={adminSettings} />
          } />
          <Route path="/admin/exams" element={
            <ManageExams admin={user} onLogout={handleLogout} customExams={customExams} onDeleteExam={deleteExam} />
          } />
          <Route path="/admin/results" element={
            <ViewResults admin={user} onLogout={handleLogout} examResults={examResults} />
          } />
          <Route path="/admin/settings" element={
            <AdminSettings admin={user} onLogout={handleLogout} settings={adminSettings} onUpdateSettings={updateSettings} />
          } />
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </Router>
    );
  }

  // Student routes
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={
          <Dashboard student={user} onLogout={handleLogout} customExams={customExams} />
        } />
        <Route path="/exams" element={
          <ExamPortal student={user} onLogout={handleLogout} customExams={customExams} />
        } />
        <Route path="/exam/:examCode" element={
          <ExamDashboard student={user} customExams={customExams} />
        } />
        <Route path="/result" element={
          <ResultPage student={user} onLogout={handleLogout} />
        } />
        <Route path="/results" element={
          <ResultPage student={user} onLogout={handleLogout} />
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;