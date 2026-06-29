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

  if (!auth || auth.role !== 'user') return <div className="portal-page" style={{ textAlign: 'center', color: '#8a9ab5' }}>Not authorized.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (oldPassword === newPassword) { setError('New password must be different from the old one.'); return; }
    setLoading(true);
    try {
      const data = await updateUserPassword(auth.username, oldPassword, newPassword);
      if (data.success) { setSuccess('Password updated successfully!'); setOldPassword(''); setNewPassword(''); }
      else setError(data.message || 'Failed to update password.');
    } catch { setError('Failed to update password.'); }
    setLoading(false);
  };

  return (
    <div className="portal-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <i className="bi bi-shield-lock" style={{ fontSize: '1.1rem' }}></i>
            <h5>Update Password</h5>
          </div>
          <div className="portal-card-body" style={{ padding: 28 }}>
            {success && <div className="portal-alert-success">{success}</div>}
            {error && <div className="portal-alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="portal-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showOld ? 'text' : 'password'}
                    className="portal-input"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter current password"
                    style={{ paddingRight: 64 }}
                  />
                  <button type="button" onClick={() => setShowOld(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6a85', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', padding: 0, letterSpacing: 0.5 }}>
                    {showOld ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              <div className="mb-5">
                <label className="portal-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="portal-input"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter new password"
                    style={{ paddingRight: 64 }}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6a85', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', padding: 0, letterSpacing: 0.5 }}>
                    {showNew ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              <button className="portal-btn w-100" type="submit" disabled={loading} style={{ justifyContent: 'center', height: 48, fontSize: '0.95rem' }}>
                {loading ? <><span className="spinner-border spinner-border-sm"></span> Updating…</> : <><i className="bi bi-shield-check"></i> Update Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
