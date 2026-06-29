import React, { useState } from 'react';
import { createUser } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

const AdminCreateUser = () => {
  const [form, setForm] = useState({
    username: '', fullName: '', empCode: '', designation: '',
    department: '', panNo: '', gender: 'MALE', email: '', password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { loading, setLoading } = useLoader();

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    setLoading(true);
    try {
      const res = await createUser(
        form.username, form.email, form.password, form.fullName,
        form.empCode, form.department, form.designation, form.panNo, form.gender
      );
      if (res.success) {
        setMessage('User created — credentials sent to email.');
        setForm({ username: '', fullName: '', empCode: '', designation: '', department: '', panNo: '', gender: 'MALE', email: '', password: '' });
      } else {
        setError(res.message || 'Failed to create user.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="portal-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <i className="bi bi-person-plus-fill" style={{ fontSize: '1.1rem' }}></i>
            <h5>Create New User</h5>
          </div>
          <div className="portal-card-body" style={{ padding: 28 }}>
            {message && <div className="portal-alert-success">{message}</div>}
            {error   && <div className="portal-alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="portal-label">Username</label>
                <input className="portal-input" value={form.username} onChange={set('username')} required disabled={loading} placeholder="e.g. john" />
                <div style={{ fontSize: '0.78rem', color: '#8a9ab5', marginTop: 4 }}>Unique, lowercase, used everywhere to identify the user.</div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="portal-label">Full Name</label>
                  <input className="portal-input" value={form.fullName} onChange={set('fullName')} required disabled={loading} placeholder="Full name" />
                </div>
                <div className="col-6">
                  <label className="portal-label">Employee Code</label>
                  <input className="portal-input" value={form.empCode} onChange={set('empCode')} required disabled={loading} placeholder="EMP001" />
                </div>
                <div className="col-6">
                  <label className="portal-label">Designation</label>
                  <input className="portal-input" value={form.designation} onChange={set('designation')} required disabled={loading} placeholder="Developer" />
                </div>
                <div className="col-6">
                  <label className="portal-label">Department</label>
                  <input className="portal-input" value={form.department} onChange={set('department')} required disabled={loading} placeholder="Engineering" />
                </div>
                <div className="col-6">
                  <label className="portal-label">PAN No</label>
                  <input className="portal-input" value={form.panNo} onChange={set('panNo')} required disabled={loading} placeholder="ABCDE1234F" />
                </div>
                <div className="col-6">
                  <label className="portal-label">Gender</label>
                  <select className="portal-select" value={form.gender} onChange={set('gender')} required disabled={loading}>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="portal-label">Gmail</label>
                  <input className="portal-input" type="email" value={form.email} onChange={set('email')} required disabled={loading} placeholder="user@gmail.com" />
                </div>
                <div className="col-12">
                  <label className="portal-label">Password</label>
                  <input className="portal-input" type="text" value={form.password} onChange={set('password')} required disabled={loading} placeholder="Initial password" />
                </div>
              </div>
              <button className="portal-btn w-100" type="submit" disabled={loading} style={{ justifyContent: 'center', height: 48, fontSize: '0.95rem' }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span> Creating…</>
                  : <><i className="bi bi-person-check-fill"></i> Create User</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUser;
