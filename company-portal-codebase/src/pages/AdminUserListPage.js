import React, { useEffect, useState } from 'react';
import { fetchAllUsers, updateUserAndPayslip } from '../api/googleScriptApi';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAllUsers().then(res => {
      if (res.success) setUsers(res.users);
      setLoading(false);
    });
  }, []);

  const handleEdit = idx => {
    setEditIdx(idx);
    setEditUser({ ...users[idx] });
    setMsg('');
    setModalOpen(true);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditUser({});
    setMsg('');
    setModalOpen(false);
  };

  const handleChange = e => setEditUser({ ...editUser, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    const res = await updateUserAndPayslip(editUser.username, editUser);
    if (res.success) {
      const updated = [...users];
      updated[editIdx] = { ...editUser };
      setUsers(updated);
      setMsg('User updated successfully!');
      setEditIdx(null);
      setModalOpen(false);
    } else {
      setMsg(res.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          <div className="mb-3">
            <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>User Management</h4>
            <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>{users.length} registered users</p>
          </div>

          {msg && <div className="portal-alert-success">{msg}</div>}

          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-people" style={{ fontSize: '1.1rem' }}></i>
              <h5>All Users</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#000033' }} role="status" />
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Emp Code</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>PAN No</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.username}>
                          <td style={{ fontWeight: 700, color: '#000033' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#eef0ff', color: '#000033', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                {u.username?.[0]?.toUpperCase()}
                              </span>
                              {u.username}
                            </span>
                          </td>
                          <td>{u.full_name}</td>
                          <td style={{ fontSize: '0.82rem', color: '#8a9ab5' }}>{u.emp_code}</td>
                          <td>{u.department}</td>
                          <td>{u.designation}</td>
                          <td style={{ fontSize: '0.82rem', color: '#8a9ab5' }}>{u.pan_no}</td>
                          <td>
                            <span style={{ background: u.gender === 'MALE' ? '#eef4ff' : '#fdf4ff', color: u.gender === 'MALE' ? '#2563eb' : '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: '0.78rem', fontWeight: 600 }}>
                              {u.gender}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#8a9ab5' }}>{u.email}</td>
                          <td>
                            <button className="portal-btn portal-btn-sm" onClick={() => handleEdit(idx)}>
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 14, overflow: 'hidden', border: 'none' }}>
                <div className="portal-modal-header">
                  <h5><i className="bi bi-person-gear me-2"></i>Edit User: {editUser.username}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCancel}></button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  {msg && <div className="portal-alert-error">{msg}</div>}
                  <div className="row g-3">
                    {[
                      { name: 'full_name', label: 'Full Name' },
                      { name: 'emp_code', label: 'Employee Code' },
                      { name: 'department', label: 'Department' },
                      { name: 'designation', label: 'Designation' },
                      { name: 'pan_no', label: 'PAN No' },
                    ].map(f => (
                      <div className="col-12 col-sm-6" key={f.name}>
                        <label className="portal-label">{f.label}</label>
                        <input name={f.name} value={editUser[f.name] || ''} onChange={handleChange} className="portal-input" />
                      </div>
                    ))}
                    <div className="col-12 col-sm-6">
                      <label className="portal-label">Gender</label>
                      <select name="gender" value={editUser.gender || ''} onChange={handleChange} className="portal-select">
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="portal-label">Email (read-only)</label>
                      <input name="email" value={editUser.email || ''} onChange={handleChange} className="portal-input" disabled style={{ opacity: 0.6 }} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #e5e9f0', padding: '14px 20px', gap: 10 }}>
                  <button className="portal-btn-outline" onClick={handleCancel} disabled={loading}>Cancel</button>
                  <button className="portal-btn portal-btn-success" onClick={handleSave} disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-1"></span> Saving…</> : <><i className="bi bi-check-lg"></i> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserListPage;
