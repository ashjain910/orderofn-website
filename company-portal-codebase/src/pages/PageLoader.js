import React from 'react';

const PageLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    background: 'rgba(244,246,251,0.30)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 8px 40px rgba(0,0,51,0.13)',
      padding: '36px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      minWidth: 200,
    }}>
      {/* Spinner ring */}
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '4px solid #eef0ff',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: '#000033',
          borderRightColor: '#000033',
          animation: 'portal-spin 0.75s linear infinite',
        }} />
      </div>

      {/* Label */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: '#0d1b3e',
          letterSpacing: '0.01em',
        }}>Loading</span>
        <span style={{
          fontSize: '0.78rem',
          color: '#8a9ab5',
          fontWeight: 500,
        }}>Please wait…</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#000033',
            display: 'inline-block',
            animation: `portal-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>

    {/* Keyframes injected once */}
    <style>{`
      @keyframes portal-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes portal-dot {
        0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
        40%            { opacity: 1;   transform: scale(1.2); }
      }
    `}</style>
  </div>
);

export default PageLoader;
