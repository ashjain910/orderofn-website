import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, sendOtp, verifyOtp, updatePassword } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const inputStyle = {
  height: 52,
  borderRadius: 10,
  border: '1.5px solid #e0e6ed',
  background: '#f7f9fc',
  fontSize: '0.97rem',
  paddingLeft: 16,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontWeight: 600,
  fontSize: '0.88rem',
  color: '#374151',
  marginBottom: 6,
  display: 'block',
};

const primaryBtn = {
  background: '#000033',
  color: '#fff',
  height: 52,
  borderRadius: 10,
  fontWeight: 700,
  fontSize: '1rem',
  border: 'none',
  width: '100%',
  cursor: 'pointer',
  letterSpacing: 0.3,
  transition: 'opacity 0.2s',
};

const LinkBtn = ({ onClick, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{ background: 'none', border: 'none', color: '#000033', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
  >
    {children}
  </button>
);

const PasswordInput = ({ value, onChange, show, onToggle, placeholder, name }) => (
  <div style={{ position: 'relative' }}>
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      autoComplete={name}
      style={{ ...inputStyle, paddingRight: 64 }}
    />
    <button
      type="button"
      onClick={onToggle}
      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6a85', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', padding: 0, letterSpacing: 0.5 }}
    >
      {show ? 'HIDE' : 'SHOW'}
    </button>
  </div>
);

const LoginPage = () => {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const { loading, setLoading } = useLoader();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({ username, password, role });
      if (result.success) {
        await new Promise((resolve) => {
          localStorage.setItem('auth', JSON.stringify({ role, username, token: result.user.user_key }));
          const interval = setInterval(() => {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (auth && auth.token === result.user.user_key) { clearInterval(interval); resolve(); }
          }, 50);
        });
        if (role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await sendOtp({ email });
      if (result.success) setStep(3);
      else setError(result.message || 'Failed to send OTP. Please try again.');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp });
      if (result.success) setStep(4);
      else setError(result.message || 'Invalid OTP. Please try again.');
    } catch (err) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const result = await updatePassword({ email, password: newPassword });
      if (result.success) { alert(result.message || 'Password updated successfully. Please login.'); setStep(1); }
      else setError(result.message || 'Failed to update password. Please try again.');
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: { title: 'Sign in', sub: 'Enter your credentials to access your account.' },
    2: { title: 'Forgot Password', sub: 'Enter your registered email to receive an OTP.' },
    3: { title: 'Verify OTP', sub: `A one-time code was sent to ${email}` },
    4: { title: 'Reset Password', sub: 'Set a new password for your account.' },
  };


  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', sans-serif" }}>
      {loading && <PageLoader />}

      {/* ── Left panel ── */}
      <div
        className="d-none d-md-flex"
        style={{
          width: '45%',
          background: 'linear-gradient(145deg, #000033 55%, #0a1a6e 100%)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -110, left: -110 }} />
        <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -80, right: -80 }} />
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 160, right: 70 }} />
        <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: 130, left: 70 }} />
        <div style={{ position: 'absolute', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', top: 220, right: 120 }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 52px' }}>
          <img
            src={require('../images/company-logo-white.png')}
            alt="Company Logo"
            style={{ maxWidth: 190, marginBottom: 40 }}
          />
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.9rem', marginBottom: 14, letterSpacing: 0.2 }}>
            Welcome Back!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.97rem', lineHeight: 1.75, margin: 0 }}>
            Manage your team, track leaves,<br />and stay organised — all in one place.
          </p>

          {/* Decorative divider */}
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>

        <p style={{ position: 'absolute', bottom: 22, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: 0.3 }}>
          © {new Date().getFullYear()} Order of N. All rights reserved.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="d-md-none" style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src={require('../images/company-logo.png')} alt="Company Logo" style={{ maxHeight: 56 }} />
          </div>

          {/* Step heading */}
          <h3 style={{ fontWeight: 700, color: '#0d1b3e', marginBottom: 4, fontSize: '1.65rem' }}>
            {stepTitles[step].title}
          </h3>
          <p style={{ color: '#8a9ab5', fontSize: '0.9rem', marginBottom: 28 }}>
            {stepTitles[step].sub}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', marginBottom: 20, fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* ── Step 1: Login ── */}
          {step === 1 && (
            <form onSubmit={handleSubmit} autoComplete="off">
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, appearance: 'auto' }}
                >
                  <option value="user">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  autoComplete="off"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Password</label>
                <PasswordInput
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  show={showPassword}
                  onToggle={() => setShowPassword(p => !p)}
                  placeholder="Enter your password"
                  name="new-password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 26 }}>
                <LinkBtn onClick={() => { setError(''); setStep(2); }} disabled={loading}>
                  Forgot Password?
                </LinkBtn>
              </div>

              <button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {/* ── Step 2: Send OTP ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  autoComplete="off"
                  style={inputStyle}
                />
              </div>
              <button onClick={handleSendOtp} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <LinkBtn onClick={() => { setError(''); setStep(1); }} disabled={loading}>← Back to Sign in</LinkBtn>
              </div>
            </div>
          )}

          {/* ── Step 3: Verify OTP ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>One-Time Password</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  required
                  disabled={loading}
                  autoComplete="off"
                  style={{ ...inputStyle, letterSpacing: 4, fontSize: '1.1rem' }}
                />
              </div>
              <button onClick={handleVerifyOtp} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <LinkBtn onClick={() => { setError(''); setStep(1); }} disabled={loading}>← Back to Sign in</LinkBtn>
              </div>
            </div>
          )}

          {/* ── Step 4: Reset Password ── */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>New Password</label>
                <PasswordInput
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  show={showNew}
                  onToggle={() => setShowNew(p => !p)}
                  placeholder="Enter new password"
                  name="new-password"
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  show={showConfirm}
                  onToggle={() => setShowConfirm(p => !p)}
                  placeholder="Confirm new password"
                  name="new-password"
                />
              </div>
              <button onClick={handleResetPassword} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <LinkBtn onClick={() => { setError(''); setStep(1); }} disabled={loading}>← Back to Sign in</LinkBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
