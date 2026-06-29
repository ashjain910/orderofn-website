import React, { useState, useEffect } from 'react';
import { getAllUsers, getPayslipForUser, updatePayslipForUser } from '../api/googleScriptApi';

const initialState = {
  username: '', name: '', employeeCode: '', designation: '', department: '',
  employeeGroup: '', doj: '', panNo: '', gender: '', payPeriod: '', location: '',
  basic: '', specialAllowance: '', tds: '', advance: '', bank: '', bankAccountNo: '',
  uan: '', houseRentAllowance: '', lop: '',
};

function getFinancialYears(count = 2) {
  const today = new Date();
  let startYear = today.getMonth() + 1 < 4 ? today.getFullYear() - 1 : today.getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const s = startYear + i, e = s + 1;
    return { label: `April ${s} - March ${e}`, value: `${String(s).slice(-2)}-${String(e).slice(-2)}` };
  });
}

const fieldGroups = [
  {
    title: 'Employee Info',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'employeeCode', label: 'Employee Code' },
      { name: 'designation', label: 'Designation' },
      { name: 'department', label: 'Department' },
      { name: 'employeeGroup', label: 'Employee Group' },
      { name: 'doj', label: 'D.O.J' },
      { name: 'panNo', label: 'PAN No' },
      { name: 'gender', label: 'Gender' },
      { name: 'payPeriod', label: 'Pay Period' },
      { name: 'location', label: 'Location' },
      { name: 'uan', label: 'UAN' },
    ],
  },
  {
    title: 'Salary Details',
    fields: [
      { name: 'basic', label: 'Basic', type: 'number' },
      { name: 'houseRentAllowance', label: 'House Rent Allowance', type: 'number' },
      { name: 'specialAllowance', label: 'Special Allowance', type: 'number' },
      { name: 'tds', label: 'T.D.S', type: 'number' },
      { name: 'advance', label: 'Advance', type: 'number' },
      { name: 'leave', label: 'Leave', type: 'number' },
      { name: 'lop', label: 'Loss of Pay (LOP)' },
    ],
  },
];

const AdminPayslipEditPage = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const financialYears = getFinancialYears(2);
  const [selectedFY, setSelectedFY] = useState(financialYears[0].value);

  const today = new Date();
  const currentMonth = today.getMonth() + 1, currentYear = today.getFullYear();
  const visibleFY = financialYears.filter(fy =>
    fy.value !== '26-27' || currentYear > 2026 || (currentYear === 2026 && currentMonth >= 4)
  );

  useEffect(() => {
    setUsersLoading(true);
    getAllUsers().then(res => { if (res.success) setUsers(res.users); setUsersLoading(false); });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFetch = async e => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const res = await getPayslipForUser(form.username, selectedFY);
      if (res.success) { setForm({ ...initialState, ...res.data, username: form.username }); setEditMode(true); }
      else { setMsg(res.message || 'Payslip not found'); setMsgType('error'); }
    } catch { setMsg('Error fetching payslip'); setMsgType('error'); }
    setLoading(false);
  };

  let formattedDoj = form.doj;
  if (form.doj && typeof form.doj === 'string' && form.doj.includes('T')) {
    const d = new Date(form.doj);
    formattedDoj = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const res = await updatePayslipForUser({
        username: form.username, financialYear: selectedFY, name: form.name,
        employeeCode: form.employeeCode, designation: form.designation, department: form.department,
        doj: formattedDoj, employeeGroup: form.employeeGroup, panNo: form.panNo, payPeriod: form.payPeriod,
        lop: form.lop, location: form.location, basic: form.basic, houseRentAllowance: form.houseRentAllowance,
        specialAllowance: form.specialAllowance, tds: form.tds, leave: form.leave, advance: form.advance,
        month: currentMonth, year: currentYear,
      });
      setMsg(res.success ? 'Payslip updated successfully!' : res.message || 'Error');
      setMsgType(res.success ? 'success' : 'error');
    } catch { setMsg('Error updating payslip'); setMsgType('error'); }
    setLoading(false);
  };

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-10">

          <div className="mb-3">
            <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>Edit Payslip</h4>
            <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>Update salary details for a user</p>
          </div>

          {/* User + FY selection */}
          <div className="portal-card mb-3">
            <div className="portal-card-header">
              <i className="bi bi-person-badge-fill" style={{ fontSize: '1.1rem' }}></i>
              <h5>Select User & Financial Year</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 24 }}>
              {msg && <div className={msgType === 'success' ? 'portal-alert-success' : 'portal-alert-error'}>{msg}</div>}
              <form onSubmit={editMode ? handleSubmit : handleFetch}>
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-5">
                    <label className="portal-label">Select User</label>
                    {usersLoading ? (
                      <div className="portal-input d-flex align-items-center" style={{ color: '#8a9ab5' }}>
                        <span className="spinner-border spinner-border-sm me-2"></span> Loading users…
                      </div>
                    ) : (
                      <select name="username" className="portal-select" value={form.username} onChange={handleChange} required disabled={editMode}>
                        <option value="">— Select User —</option>
                        {users.map(u => <option key={u.username} value={u.username}>{u.username}</option>)}
                      </select>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="portal-label">Financial Year</label>
                    <select className="portal-select" value={selectedFY} onChange={e => setSelectedFY(e.target.value)} disabled={editMode}>
                      {visibleFY.map(fy => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-3">
                    {!editMode ? (
                      <button className="portal-btn portal-btn-success w-100" type="submit" disabled={loading || usersLoading || !form.username} style={{ justifyContent: 'center', height: 44 }}>
                        {loading ? <><span className="spinner-border spinner-border-sm"></span> Fetching…</> : <><i className="bi bi-search"></i> Fetch Payslip</>}
                      </button>
                    ) : (
                      <button type="button" className="portal-btn-outline w-100" style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        onClick={() => { setForm(initialState); setEditMode(false); setMsg(''); }}>
                        <i className="bi bi-arrow-left"></i> Edit Another
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Edit form */}
          {editMode && (
            <form onSubmit={handleSubmit}>
              {fieldGroups.map(group => (
                <div className="portal-card mb-3" key={group.title}>
                  <div className="portal-card-header">
                    <h5>{group.title}</h5>
                  </div>
                  <div className="portal-card-body" style={{ padding: 24 }}>
                    <div className="row g-3">
                      {group.fields.map(f => (
                        <div className="col-12 col-md-4" key={f.name}>
                          <label className="portal-label">{f.label}</label>
                          <input
                            name={f.name}
                            type={f.type || 'text'}
                            className="portal-input"
                            value={f.name === 'doj' ? formattedDoj : (form[f.name] || '')}
                            onChange={handleChange}
                            onWheel={f.type === 'number' ? e => e.target.blur() : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-end">
                <button className="portal-btn portal-btn-success" type="submit" disabled={loading} style={{ minWidth: 160, justifyContent: 'center', height: 46 }}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span> Saving…</> : <><i className="bi bi-save"></i> Save Payslip</>}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPayslipEditPage;
