import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ExamPortal from './components/ExamPortal';
import ExamDashboard from './components/ExamDashboard';
import ResultPage from './components/ResultPage';
import AdminDashboard from './components/AdminDashboard';
import CreateExam from './components/CreateExam';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [customExams, setCustomExams] = useState([]);

  const handleLogin = (info) => {
    setIsLoggedIn(true);
    setUserInfo(info);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const addExam = (exam) => {
    setCustomExams((prev) => [...prev, exam]);
  };

  const deleteExam = (examCode) => {
    setCustomExams((prev) => prev.filter((e) => e.examCode !== examCode));
  };

  const isAdmin = userInfo?.role === 'admin';

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={isAdmin ? '/admin' : '/dashboard'} />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* ── Admin Routes ── */}
        <Route
          path="/admin"
          element={
            isLoggedIn && isAdmin ? (
              <AdminDashboard
                user={userInfo}
                onLogout={handleLogout}
                customExams={customExams}
                deleteExam={deleteExam}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create-exam"
          element={
            isLoggedIn && isAdmin ? (
              <CreateExam
                user={userInfo}
                onLogout={handleLogout}
                addExam={addExam}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ── Student Routes ── */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && !isAdmin ? (
              <Dashboard student={userInfo} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/exams"
          element={
            isLoggedIn && !isAdmin ? (
              <ExamPortal
                student={userInfo}
                onLogout={handleLogout}
                customExams={customExams}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/exam/:examCode"
          element={
            isLoggedIn && !isAdmin ? (
              <ExamDashboard student={userInfo} customExams={customExams} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/result"
          element={
            isLoggedIn && !isAdmin ? (
              <ResultPage student={userInfo} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;