import React from 'react';

const PageLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(255,255,255,0.15)', // Further reduced opacity
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default PageLoader;