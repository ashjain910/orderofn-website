import React, { useState } from 'react';
import { createUser } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

const AdminCreateUser = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [designation, setDesignation] = useState('');
  const [panNo, setPanNo] = useState('');
  const [gender, setGender] = useState('MALE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [department, setDepartment] = useState('');
  const { loading, setLoading } = useLoader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await createUser(
        username,
        email,
        password,
        fullName,
        empCode,
        department, // <-- add this
        designation,
        panNo,
        gender
      );
      if (res.success) {
        setMessage('User created and credentials sent to email.');
        setUsername('');
        setFullName('');
        setEmpCode('');
        setDesignation('');
        setPanNo('');
        setGender('MALE');
        setEmail('');
        setPassword('');
        setDepartment('');
      } else {
        setError(res.message || 'Failed to create user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: '#f8fafc' }}
    >
      <div className="card" style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
        <div className="card-header bg-primary text-white">
          <h2 className='mb-0' style={{fontSize: '24px'}}>Create New User</h2>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <div className="form-text">
                Username must be unique and in small letters (e.g., <b>user</b>). This will be used everywhere to fetch the user.
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Employee Code</label>
              <input className="form-control" value={empCode} onChange={e => setEmpCode(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input className="form-control" value={designation} onChange={e => setDesignation(e.target.value)} required disabled={loading} />
            </div>
                        <div className="mb-3">
              <label className="form-label">Department</label>
              <input
                className="form-control"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">PAN No</label>
              <input className="form-control" value={panNo} onChange={e => setPanNo(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={e => setGender(e.target.value)} required disabled={loading}>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gmail</label>
              <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="text" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
            </div>

            <button className="btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUser;