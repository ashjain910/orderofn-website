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

  const handleChange = e => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateUserAndPayslip(editUser.username, editUser);
    if (res.success) {
      const updated = [...users];
      updated[editIdx] = { ...editUser };
      setUsers(updated);
      setMsg('User updated!');
      setEditIdx(null);
      setModalOpen(false);
    } else {
      setMsg(res.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {msg && <div className="alert alert-info">{msg}</div>}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h2 className='mb-0' style={{fontSize: '24px'}}>User List</h2>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-sm mb-0" style={{fontSize: '13px'}}>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.username}>
                    <td>{u.username}</td>
                    <td>{u.full_name}</td>
                    <td>{u.emp_code}</td>
                    <td>{u.department}</td>
                    <td>{u.designation}</td>
                    <td>{u.pan_no}</td>
                    <td>{u.gender}</td>
                    <td>{u.email}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(idx)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Edit */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User: {editUser.username}</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Full Name</label>
                  <input name="full_name" value={editUser.full_name || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Emp Code</label>
                  <input name="emp_code" value={editUser.emp_code || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Department</label>
                  <input name="department" value={editUser.department || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Designation</label>
                  <input name="designation" value={editUser.designation || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">PAN No</label>
                  <input name="pan_no" value={editUser.pan_no || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Gender</label>
                  <select name="gender" value={editUser.gender || ''} onChange={handleChange} className="form-select">
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input name="email" value={editUser.email || ''} onChange={handleChange} className="form-control" disabled />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancel} disabled={loading}>Cancel</button>
                <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserListPage;