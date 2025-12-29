import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnderMaintenancePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        padding: '48px 32px',
        maxWidth: 420,
        textAlign: 'center'
      }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/564/564445.png"
          alt="Maintenance"
          style={{ width: 80, marginBottom: 24, opacity: 0.85 }}
        />
        <h2 className="mb-3" style={{ color: '#2d3748' }}>We'll Be Back Soon!</h2>
        <p className="mb-4" style={{ color: '#4a5568', fontSize: 18 }}>
          Our site is currently undergoing scheduled maintenance.<br />
          We apologize for the inconvenience and appreciate your patience.<br />
          <span style={{ color: '#3182ce', fontWeight: 500 }}>Please check back later.</span>
        </p>
        <div style={{ fontSize: 14, color: '#a0aec0' }}>
          <i className="bi bi-tools me-2"></i>
          Maintenance Mode &mdash; {new Date().toLocaleString()}
        </div>
        <button
          className="btn btn-outline-primary mt-4 w-100"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UnderMaintenancePage;