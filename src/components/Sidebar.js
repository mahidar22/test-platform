import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ active, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { key: 'exams',     label: 'Exams',     path: '/exams' },
    { key: 'results',   label: 'Results',   path: '/results' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand" style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
          letterSpacing: 1
        }}>
          ExamPortal
        </h2>
      </div>

      <div style={{ padding: '16px 0', flex: 1 }}>
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`sidebar-item ${active === item.key ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 24px',
              margin: '4px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              color: active === item.key ? '#fff' : 'rgba(255,255,255,0.7)',
              background: active === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: active === item.key ? 600 : 400,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (active !== item.key)
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              if (active !== item.key)
                e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          className="sidebar-item"
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;