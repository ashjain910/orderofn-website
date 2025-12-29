import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, sendOtp, verifyOtp, updatePassword } from '../api/googleScriptApi'; // Add new API calls
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const LoginPage = () => {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Login, Step 2: Forgot Password, Step 3: OTP Verification, Step 4: Reset Password
  const { loading, setLoading } = useLoader();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const result = await loginUser({ username, password, role });

    if (result.success) {
      console.log('Login successful:', result);

      await new Promise((resolve) => {
        localStorage.setItem(
          'auth',
          JSON.stringify({
            role,
            username,
            token: result.user.user_key
          })
        );

        const interval = setInterval(() => {
          const auth = JSON.parse(localStorage.getItem('auth'));
          if (auth && auth.token === result.user.user_key) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });

      if (role === 'admin') navigate('/admin');
      else navigate('/');
    } else {
      setError('Invalid credentials');
    }
  } catch {
    setError('Login failed. Try again.');
  } finally {
    setLoading(false);
  }
};


  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await sendOtp({ email });
      if (result.success) {
        setStep(3); // Move to OTP verification step
      } else {
        setError(result.message || 'Failed to send OTP. Please try again.');
      }
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
      if (result.success) {
        setStep(4); // Move to reset password step
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const result = await updatePassword({ email, password: newPassword });
      if (result.success) {
        alert(result.message || 'Password updated successfully. Please login.');
        setStep(1); // Go back to login step
      } else {
        setError(result.message || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-5 px-2 px-md-4">
      {loading && <PageLoader />}
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5">
          <div className="card shadow" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #cfe2ff 100%)' }}>
            <div className="card-header text-white text-center" style={{ background: '#000033' }}>
              <img
                src={require('../images/company-logo-white.png')}
                alt="Company Logo"
                style={{ maxHeight: 60, maxWidth: '100%' }}
              />
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {step === 1 && (
                <form onSubmit={handleSubmit} autoComplete="off"> {/* Added autoComplete="off" */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <select className="form-select" value={role} onChange={e => setRole(e.target.value)} disabled={loading}>
                      <option value="user">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off" // Added autoComplete="off"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password" // Added autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ background: '#000033' }}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </form>
              )}
              {step === 2 && (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100 fw-bold"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    onClick={() => setStep(1)} // Reset to login step
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100 fw-bold"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    onClick={() => setStep(1)} // Reset to login step
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </div>
              )}
              {step === 4 && (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100 fw-bold"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    onClick={() => setStep(1)} // Reset to login step
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;