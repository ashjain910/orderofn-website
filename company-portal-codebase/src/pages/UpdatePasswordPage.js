import React, { useState } from 'react';
import { useLoader } from '../context/LoaderProvider';
import { updateUserPassword } from '../api/googleScriptApi';

const UpdatePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { loading, setLoading } = useLoader();
  const auth = JSON.parse(localStorage.getItem('auth'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (oldPassword === newPassword) {
      setError('New password must be different from old password.');
      return;
    }

    setLoading(true);
    try {
      const data = await updateUserPassword(auth.username, oldPassword, newPassword);
      if (data.success) {
        setSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch {
      setError('Failed to update password');
    }
    setLoading(false);
  };

  // Only allow user role
  if (!auth || auth.role !== 'user') return <div className="container mt-5">Not authorized.</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Update Password</h4>
        </div>
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Old Password</label>
              <div className="input-group">
                <input
                  type={showOld ? 'text' : 'password'}
                  className="form-control"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowOld(v => !v)}
                  style={{ borderLeft: 0 }}
                >
                  <i className={`bi ${showOld ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-control"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowNew(v => !v)}
                  style={{ borderLeft: 0 }}
                >
                  <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;